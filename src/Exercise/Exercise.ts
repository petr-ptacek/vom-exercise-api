import type {
  Dictionary,
  ICard,
  IConfiguration,
  ILanguage,
  IMap,
  ITranslate,
  Nullable
}                         from '../typings/index.js';
import { ApiService }     from '../service/index.js';
import {
  execAsync,
  isBoolean,
  isNull,
  isNumber
}                         from '../utils/index.js';
import { EventEmitter }   from '../EventEmitter/index.js';
import { EXERCISE_UTILS } from '../EXERCISE_UTILS.js';

export interface IData {
  loading: boolean;
  initialized: boolean;
  attemptId: string;
  totalSteps: Nullable<number>;
  currentStep: Nullable<number>;
  startAt: Nullable<Date>;
  configuration: Nullable<IConfiguration>;
  answers: Nullable<boolean>[];

  timeExpireCheckerIntervalId: number | null;
  timeExpireNotifySeconds: number | null;
  timeExpireNotifyHandler: (() => void) | null;
}

export interface ISetupData {
  totalSteps: number;
  timeExpireNotifySeconds?: number;
  timeExpireNotifyHandler?: () => void;
}

export interface IOptions {
  exerciseAttemptId: string;
}

export type ValidationError = {
  type: 'server' | 'internal';
  message: string;
}

export abstract class Exercise {
  private _data: IData;

  public readonly utils = EXERCISE_UTILS;

  constructor(options: IOptions) {
    this._data = {
      loading: false,
      attemptId: options.exerciseAttemptId,
      startAt: null,
      configuration: null,
      initialized: false,
      currentStep: null,
      totalSteps: null,
      answers: [],
      timeExpireCheckerIntervalId: null,
      timeExpireNotifySeconds: null,
      timeExpireNotifyHandler: null
    };

    window.setTimeout(
      () => EventEmitter.emit('EXERCISE_INSTANCE_CREATED', this)
    );
  }

  get attemptId(): string {
    return this._data.attemptId;
  }

  get config(): Nullable<Dictionary> {
    return this._data.configuration?.config ?? null;
  }

  get configParams(): Nullable<Dictionary> {
    return this._data.configuration?.config_params ?? null;
  }

  get mapIds(): Nullable<string[]> {
    return this._data.configuration?.maps ?? null;
  }

  get exerciseName(): Nullable<string> {
    return this._data.configuration?.exercise_name ?? null;
  }

  get nativeLanguage(): Nullable<ILanguage> {
    return this._data.configuration?.native_language ?? null;
  }

  get exerciseLanguage(): Nullable<ILanguage> {
    return this._data.configuration?.exercise_language ?? null;
  }

  get totalSteps(): Nullable<number> {
    return this._data.totalSteps;
  }

  get currentStep(): Nullable<number> {
    return this._data.currentStep;
  }

  get completionPercentage(): number {
    const { answers } = this._data;
    const answeredAnswers = answers.filter(isBoolean);
    const answersCount = answers.length || 1;
    const answeredCount = answeredAnswers.length;

    return Math.round((answeredCount / answersCount) * 100);
  }

  get successPercentage(): number {
    const validAnswers = this._data.answers.filter(isBoolean);
    const truthyAnswers = validAnswers.filter(Boolean);

    return Math.floor((truthyAnswers.length / (validAnswers.length || 1)) * 100);
  }

  get initialized(): boolean {
    return this._data.initialized;
  }

  get loading(): boolean {
    return this._data.loading;
  }

  get maxDurationMinutes(): Nullable<number> {
    return this._data.configuration?.max_duration_minutes ?? null;
  }

  protected abstract setup(): Promise<ISetupData> | ISetupData;

  protected abstract onInitialized(errors: ValidationError[]): Promise<boolean> | boolean;

  protected abstract onStart(): Promise<void> | void

  protected abstract onEnd(): void;

  protected abstract onBeforeEnd(): boolean;

  protected abstract onTimeExpired(): void;

  protected abstract onAllAnswersFilled(): void;

  private async _validateServer(): Promise<ValidationError[]> {
    const result = await execAsync(
      ApiService.validate(this._data.attemptId)
    );

    return (result.data?.data?.errors || [])
      .map(
        error => {
          return {
            type: 'server',
            message: error
          };
        }
      );
  }

  private _attachTimeExpiredChecker(): void {
    let beforeTimeExpireNotified = false;
    let timeExpiredNotified = false;

    const handler = () => {
      const seconds = Math.floor(this.getTimeRemaining()!);

      if (
        !beforeTimeExpireNotified &&
        seconds <= this._data.timeExpireNotifySeconds!
      ) {
        beforeTimeExpireNotified = true;
        this._data.timeExpireNotifyHandler?.();
      }

      if (
        !timeExpiredNotified &&
        seconds <= 0
      ) {
        timeExpiredNotified = true;
        this.timeExpired();
      }
    };

    this._data.timeExpireCheckerIntervalId = window.setInterval(handler, 1000);
    handler();
  }

  private _detachTimeExpiredChecker(): void {
    if ( isNumber(this._data.timeExpireCheckerIntervalId) ) {
      window.clearInterval(this._data.timeExpireCheckerIntervalId);
    }
  }

  private async _validateInternal(): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if ( typeof this._data.totalSteps !== 'number' ) {
      errors.push({
        type: 'internal',
        message: 'Property totalSteps must to be specified and type number.'
      });
    }

    return errors;
  }

  private async _validate(): Promise<ValidationError[]> {
    const [server, internal] = await Promise.all([
      this._validateServer(),
      this._validateInternal()
    ]);

    return [...server, ...internal];
  }

  private async _setCurrentStep(step: number): Promise<boolean> {
    if ( !(step >= 0 && step < this._data.totalSteps!) ) {
      return false;
    }

    await ApiService.setCurrentQuestion(
      this._data.attemptId,
      /** On the server is indexed from 1 to n */
      step + 1
    );

    this._data.currentStep = step;
    EventEmitter.emit('EXERCISE_STEP_UPDATE');
    return true;
  }

  private _setup(data: ISetupData): void {
    this._data.totalSteps = data.totalSteps;
    this._data.timeExpireNotifyHandler = data.timeExpireNotifyHandler ?? null;

    if ( isNumber(data.timeExpireNotifySeconds) ) {
      this._data.timeExpireNotifySeconds = data.timeExpireNotifySeconds;
    } else if ( isNumber(this._data.configuration?.max_duration_minutes) ) {
      const seconds = this._data.configuration!.max_duration_minutes * 1000;
      // teen percent of the time
      this._data.timeExpireNotifySeconds = seconds * 0.1;
    }
  }

  private async _fetchConfigurationData(): Promise<void> {
    const { data: response, error } = (await execAsync(
      ApiService.getExerciseConfiguration(this._data.attemptId)
    ));

    if ( error || response?.status !== 200 ) {
      throw new Error('fetchConfigurationData failed!');
    }

    if ( response ) {
      this._data.configuration = response.data as IConfiguration;
    }
  }

  public async initialize(): Promise<boolean> {
    await this._fetchConfigurationData();

    const setupData: ISetupData = await this.setup();
    this._setup(setupData);

    const validationErrors = await this._validate();
    this._data.initialized = await this.onInitialized(validationErrors);

    EventEmitter.emit('EXERCISE_INITIALIZED', this._data.initialized);
    return this._data.initialized;
  }

  public async writeAnswer(answer: boolean, step: number = this._data.currentStep!): Promise<boolean> {
    if ( !(step >= 0 && step < this._data.totalSteps!) ) {
      return false;
    }

    const { error } = await execAsync(
      ApiService.setCurrentAnswer(this._data.attemptId, step + 1, answer)
    );

    this._data.answers[step] = answer;
    EventEmitter.emit('EXERCISE_ANSWER_SET');

    if ( this._data.answers.every(answer => isBoolean(answer)) ) {
      this.onAllAnswersFilled();
      EventEmitter.emit('EXERCISE_ALL_ANSWERS_FILLED');
    }

    return !!error;
  }

  public getTime(): number {
    return !isNull(this._data.startAt) ?
      (Date.now() - this._data.startAt.getTime()) / 1000 :
      0;
  }

  public getTimeRemaining(): number | null {
    if (
      isNull(this._data.startAt) ||
      !isNumber(this._data.configuration?.max_duration_minutes)
    ) {
      return null;
    }

    const maxDurationMilliseconds = this._data.configuration?.max_duration_minutes! * 60 * 1000;
    const { startAt } = this._data;
    const remainingMilliseconds = (startAt.getTime() + maxDurationMilliseconds) - Date.now();

    return (remainingMilliseconds >= 0 ? remainingMilliseconds : 0) / 1000;
  }

  public async stepNext(): Promise<boolean> {
    return this.setCurrentStep(this._data.currentStep! + 1);
  }

  public async stepBack(): Promise<boolean> {
    return this.setCurrentStep(this._data.currentStep! - 1);
  }

  public async setCurrentStep(step: number): Promise<boolean> {
    return this._setCurrentStep(step);
  }

  public async start(): Promise<void> {
    const { data: response, error } = await execAsync(
      ApiService.startExercise(this._data.attemptId)
    );

    if ( error ) {
      return;
    }

    if ( response?.data ) {
      this._data.startAt = new Date(response.data.started);
      this._data.currentStep = 0;
      this._data.answers = Array.from({ length: this._data.totalSteps! }, _ => null);

      await this.onStart();

      if ( this._data.configuration!.max_duration_minutes ) {
        this._attachTimeExpiredChecker();
      }

      EventEmitter.emit('EXERCISE_START');
    }
  }

  public async end(): Promise<void> {
    await execAsync(
      ApiService.finishExercise(this._data.attemptId)
    );

    // cleanup
    this._data.startAt = null;
    // this._data.currentStep = null;
    // this._data.answers = [];

    await this.onEnd();
    EventEmitter.emit('EXERCISE_END');
  }

  public beforeEnd(): boolean {
    return this.onBeforeEnd();
  }

  public timeExpired(): void {
    this._detachTimeExpiredChecker();
    this.onTimeExpired();
    EventEmitter.emit('EXERCISE_TIME_EXPIRED');
  }

  public showLoader(): void {
    this._data.loading = true;
    EventEmitter.emit('EXERCISE_LOADER_SHOW');
  }

  public hideLoader(): void {
    this._data.loading = false;
    EventEmitter.emit('EXERCISE_LOADER_HIDE');
  }

  public getAnswers(): (boolean | null)[] {
    return this._data.answers.slice();
  }

  public getTrueAnswers(): number[] {
    return this._data.answers.reduce(
      (accum, answer, index) => {
        if ( isBoolean(answer) && answer ) {
          accum.push(index);
        }
        return accum;
      },
      [] as number[]
    );
  }

  public getFalseAnswers(): number[] {
    return this._data.answers.reduce(
      (accum, answer, index) => {
        if ( isBoolean(answer) && !answer ) {
          accum.push(index);
        }
        return accum;
      },
      [] as number[]
    );
  }

  public getConfigProperty(key: string) {
    if ( !this.config || !(key in this.config) ) {
      return undefined;
    }

    return this.config[key];
  }

  public getConfigParamProperty(key: string) {
    if ( !this.configParams || !(key in this.configParams) ) {
      return undefined;
    }

    return this.configParams[key];
  }

  public async getMap(mapId: string): Promise<IMap> {
    return (await ApiService.getMap(this._data.attemptId, mapId)).data!;
  }

  public async getTranslate(mapTranslateId: string): Promise<ITranslate> {
    return (await ApiService.getMapTranslate(mapTranslateId)).data!;
  }

  public async getCard(mapTranslateId: string, cardId: string): Promise<ICard> {
    return (await ApiService.getCard(mapTranslateId, cardId)).data!;
  }

  public async getCards(mapTranslateId: string): Promise<ICard[]> {
    return (await ApiService.getCards(mapTranslateId)).data!;
  }
}
