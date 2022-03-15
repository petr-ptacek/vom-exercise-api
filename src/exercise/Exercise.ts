import type {
  DictionaryT,
  NullableT
}                        from '../typings';
import type {
  CardT,
  ConfigurationT,
  LanguageT,
  MapT,
  MapTranslateT,
  DialogMessageOptionsT,
  ValidationErrorT,
  IData,
  ISetupData,
  IConstructorOptions,
  IUserDefinedHooks
}                        from './typings';
import { ApiService }    from '../service';
import {
  execAsync,
  isBoolean,
  isNull,
  isNumber
}                        from '../utils';
import { emitter }       from './emitter';
import { exerciseUtils } from './exerciseUtils';

export abstract class Exercise implements IUserDefinedHooks {
  private readonly _data: IData;
  private readonly _emitter = emitter;
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
      countdown: false,
      userAnswers: [],

      timeExpire: {
        intervalId: null,
        handlers: {}
      }
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
    const { userAnswers } = this._data;
    const answeredAnswers = userAnswers.filter(isBoolean);
    const answersCount = userAnswers.length || 1;
    const answeredCount = answeredAnswers.length;

    return Math.round((answeredCount / answersCount) * 100);
  }

  get successPercentage(): number {
    const validAnswers = this._data.userAnswers.filter(isBoolean);
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
        error => ({ type: 'server', message: error })
      );
  }

  private async _writeStart() {
    return execAsync(
      ApiService.startExercise(this._data.attemptId)
    );
  }

  private async _writeFinish() {
    return execAsync(
      ApiService.finishExercise(this._data.attemptId)
    );
  }

  private _attachTimeExpiredWatcher(): void {
    const handlers = Object.entries(this._data.timeExpire.handlers)
      .map(([seconds, handlers]) => ({
        notified: false,
        handlers,
        seconds: parseInt(seconds, 10)
      }));

    let timeExpiredNotified = false;

    const handler = () => {
      const remainingSeconds = Math.floor(this.getTimeRemaining()!);

      handlers.forEach(item => {
        if ( !item.notified && remainingSeconds <= item.seconds ) {
          item.notified = true;
          item.handlers.forEach(handler => handler());
        }
      });

      if ( !timeExpiredNotified && remainingSeconds <= 0 ) {
        timeExpiredNotified = true;
        this.timeExpired();
      }
    };

    this._data.timeExpire.intervalId = window.setInterval(handler, 1000);
    handler();
  }

  private _detachTimeExpiredWatcher(): void {
    if ( isNumber(this._data.timeExpire.intervalId) ) {
      window.clearInterval(this._data.timeExpire.intervalId);
      this._data.timeExpire.intervalId = null;
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

  private _cleanup() {
    this._data.startAt = null;
    this._detachTimeExpiredWatcher();
  }

  private _preSetup(): void {
    this._data.countdown = isNumber(this._data.configuration?.max_duration_minutes);
  }

  private _setup(data: ISetupData): void {
    this._data.totalSteps = data.totalSteps;
    this._data.timeExpire.handlers = data.timeExpireNotifyHandlers ?? {};
  }

  private _postSetup() {

  }

  private async _fetchConfigurationData(): Promise<void> {
    const { data: response, error } = await execAsync(
      ApiService.getExerciseConfiguration(this._data.attemptId)
    );

    if ( error || response?.status !== 200 ) {
      throw new Error('[fetchConfigurationData] failed!');
    }

    if ( response ) {
      this._data.configuration = response.data as ConfigurationT;
    }
  }

  public isRunning(): boolean {
    return !!this._data.startAt;
  }

  public isCountdown(): boolean {
    return this._data.countdown;
  }

  public async initialize(): Promise<boolean> {
    await this._fetchConfigurationData();

    this._preSetup();
    this._setup(await this.onSetup());
    this._postSetup();

    this._data.initialized = await this.onInitialized(await this._validate());

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

    this._data.userAnswers[step] = answer;
    this._emitter.emit('answer-set', { exercise: this });

    if (
      this._data.userAnswers.length &&
      this._data.userAnswers.every(answer => isBoolean(answer))
    ) {
      await this.onAllAnswersFilled();
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

  public async start(): Promise<boolean> {
    const { data: response, error } = await this._writeStart();


    if ( error || !response?.ok || !response?.data ) {
      return false;
    }

    this._data.startAt = new Date(response.data.started);
    this._data.currentStep = 0;
    this._data.userAnswers = Array.from({ length: this._data.totalSteps! }, _ => null);

    await this.onStart();

    if ( this._data.configuration!.max_duration_minutes ) {
      this._attachTimeExpiredWatcher();
    }

    this._emitter.emit('start', { exercise: this });
    return true;
  }

  public async end(): Promise<void> {
    await this._writeFinish();
    this._cleanup();
    await this.onEnd();
    this._emitter.emit('end', { exercise: this });
  }

  public beforeEnd(): Promise<boolean> {
    return this.onBeforeEnd();
  }

  public async timeExpired(): Promise<void> {
    this._cleanup();
    await this._writeFinish();
    await this.onTimeExpired();
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

  public showDialogMessage(options: DialogMessageOptionsT): void {
    this._emitter.emit(
      'message-show',
      {
        exercise: this,
        data: options
      }
    );
  }

  public getAnswers(): (boolean | null)[] {
    return this._data.userAnswers.slice();
  }

  public getAnswersTruthy(): number[] {
    return this._data.userAnswers.reduce(
      (accum, answer, index) => {
        if ( isBoolean(answer) && answer ) {
          accum.push(index);
        }
        return accum;
      },
      [] as number[]
    );
  }

  public getAnswersFalsy(): number[] {
    return this._data.userAnswers.reduce(
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
