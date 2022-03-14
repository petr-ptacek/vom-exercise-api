import type {
  DictionaryT,
  NullableT
}                          from '../typings';
import type {
  CardT,
  ConfigurationT,
  LanguageT,
  MapT,
  MapTranslateT,
  ShowMessageOptionsT,
  ValidationErrorT,
  IData,
  ISetupData,
  IConstructorOptions,
  IUserDefinedHooks
}                          from './typings';
import { ApiService }      from '../service';
import {
  execAsync,
  isBoolean,
  isNull,
  isNumber
}                          from '../utils';
import { exerciseEmitter } from './exerciseEmitter';
import { exerciseUtils }   from './exerciseUtils';

export abstract class Exercise implements IUserDefinedHooks {
  private readonly _data: IData;
  private readonly _emitter = exerciseEmitter;
  public readonly utils = exerciseUtils;

  constructor(options: IConstructorOptions) {
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

    this._emitter.emit(
      'instance-created',
      { exercise: this }
    );
  }

  get attemptId(): string {
    return this._data.attemptId;
  }

  get config(): NullableT<DictionaryT> {
    return this._data.configuration?.config ?? null;
  }

  get configParams(): NullableT<DictionaryT> {
    return this._data.configuration?.config_params ?? null;
  }

  get mapIds(): NullableT<string[]> {
    return this._data.configuration?.maps ?? null;
  }

  get exerciseName(): NullableT<string> {
    return this._data.configuration?.exercise_name ?? null;
  }

  get nativeLanguage(): NullableT<LanguageT> {
    return this._data.configuration?.native_language ?? null;
  }

  get exerciseLanguage(): NullableT<LanguageT> {
    return this._data.configuration?.exercise_language ?? null;
  }

  get cardsCountTotal(): number {
    return this._data.configuration?.count_cards_total ?? 0;
  }

  get totalSteps(): NullableT<number> {
    return this._data.totalSteps;
  }

  get currentStep(): NullableT<number> {
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

  get maxDurationMinutes(): NullableT<number> {
    return this._data.configuration?.max_duration_minutes ?? null;
  }

  abstract onSetup(): Promise<ISetupData>;

  abstract onInitialized(errors: ValidationErrorT[]): Promise<boolean>;

  abstract onStart(): Promise<boolean>

  abstract onEnd(): Promise<boolean>;

  abstract onBeforeEnd(): Promise<boolean>;

  abstract onTimeExpired(): Promise<boolean>;

  abstract onAllAnswersFilled(): Promise<boolean>;

  private async _validateServer(): Promise<ValidationErrorT[]> {
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

  private async _validateInternal(): Promise<ValidationErrorT[]> {
    const errors: ValidationErrorT[] = [];

    if ( typeof this._data.totalSteps !== 'number' ) {
      errors.push({
        type: 'internal',
        message: 'Property totalSteps must to be specified and type number.'
      });
    }

    return errors;
  }

  private async _validate(): Promise<ValidationErrorT[]> {
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
    this._emitter.emit('update-step', { exercise: this });
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
      this._data.configuration = response.data as ConfigurationT;
    }
  }

  public async initialize(): Promise<boolean> {
    await this._fetchConfigurationData();

    const setupData: ISetupData = await this.onSetup();
    this._setup(setupData);

    const validationErrors = await this._validate();
    this._data.initialized = await this.onInitialized(validationErrors);

    this._emitter.emit('initialized', { exercise: this });
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
    this._emitter.emit('answer-set', { exercise: this });

    if ( this._data.answers.every(answer => isBoolean(answer)) ) {
      this.onAllAnswersFilled();
      this._emitter.emit('all-answers-filled', { exercise: this });
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

      this._emitter.emit('start', { exercise: this });
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
    this._emitter.emit('end', { exercise: this });
  }

  public beforeEnd(): Promise<boolean> {
    return this.onBeforeEnd();
  }

  public async timeExpired(): Promise<void> {
    this._detachTimeExpiredChecker();
    await this.end();
    this.onTimeExpired();
    this._emitter.emit('time-expired', { exercise: this });
  }

  public showLoader(): void {
    this._data.loading = true;
    this._emitter.emit('loader-show', { exercise: this });
  }

  public hideLoader(): void {
    this._data.loading = false;
    this._emitter.emit('loader-hide', { exercise: this });
  }

  public exit(): void {
    this._emitter.emit('exit', { exercise: this });
  }

  public showMessage(options: ShowMessageOptionsT): void {
    this._emitter.emit(
      'message-show',
      {
        exercise: this,
        data: options
      }
    );
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

  public async getMap(mapId: string): Promise<MapT> {
    return (await ApiService.getMap(this._data.attemptId, mapId)).data!;
  }

  public async getTranslate(mapTranslateId: string): Promise<MapTranslateT> {
    return (await ApiService.getMapTranslate(mapTranslateId)).data!;
  }

  public async getCard(mapTranslateId: string, cardId: string): Promise<CardT> {
    return (await ApiService.getCard(mapTranslateId, cardId)).data!;
  }

  public async getCards(mapTranslateId: string): Promise<CardT[]> {
    return (await ApiService.getCards(mapTranslateId)).data!;
  }
}
