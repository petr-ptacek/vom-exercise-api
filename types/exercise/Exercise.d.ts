import type { DictionaryT, NullableT } from '../typings';
import type { CardT, LanguageT, MapT, MapTranslateT, DialogOptionsT, ValidationErrorT, ISetupData, IConstructorOptions, IUserDefinedHooks, TimerHighlightColorT } from './typings';
export declare abstract class Exercise implements IUserDefinedHooks {
    private readonly _data;
    private readonly _dataService;
    private readonly _timer;
    private readonly _emitter;
    constructor(options: IConstructorOptions);
    get attemptId(): string;
    get config(): NullableT<DictionaryT>;
    get configParams(): NullableT<DictionaryT>;
    get mapIds(): NullableT<string[]>;
    get exerciseName(): NullableT<string>;
    get nativeLanguage(): NullableT<LanguageT>;
    get exerciseLanguage(): NullableT<LanguageT>;
    get cardsCountTotal(): number;
    get totalSteps(): NullableT<number>;
    get currentStep(): NullableT<number>;
    get completionPercentage(): number;
    get successPercentage(): number;
    get initialized(): boolean;
    get loading(): boolean;
    get maxDurationMinutes(): NullableT<number>;
    abstract onSetup(): Promise<ISetupData>;
    abstract onInitialized(errors: ValidationErrorT[]): Promise<boolean>;
    abstract onStart(): Promise<boolean>;
    abstract onEnd(): Promise<boolean>;
    abstract onBeforeEnd(): Promise<boolean>;
    abstract onTimeExpired(): Promise<boolean>;
    abstract onAllAnswersFilled(): Promise<boolean>;
    private _validateServer;
    private _writeStart;
    private _writeFinish;
    private _attachTimeExpiredWatcher;
    private _detachTimeExpiredWatcher;
    private _validateInternal;
    private _validate;
    private _setCurrentStep;
    private _cleanup;
    private _preSetup;
    private _setup;
    private _postSetup;
    private _fetchConfigurationData;
    isRunning(): boolean;
    isCountdown(): boolean;
    initialize(): Promise<boolean>;
    writeAnswer(answer: boolean, step?: number): Promise<boolean>;
    getTime(): number;
    getTimeRemaining(): number | null;
    stepNext(): Promise<boolean>;
    stepBack(): Promise<boolean>;
    setCurrentStep(step: number): Promise<boolean>;
    start(): Promise<boolean>;
    end(): Promise<void>;
    beforeEnd(): Promise<boolean>;
    timeExpired(): Promise<void>;
    showLoader(): void;
    hideLoader(): void;
    highlightTimer(color: TimerHighlightColorT): void;
    exit(): void;
    showDialog(options: DialogOptionsT): void;
    getAnswers(): (boolean | null)[];
    getAnswersTruthy(): number[];
    getAnswersFalsy(): number[];
    getConfigProperty(key: string): unknown;
    getConfigParamProperty(key: string): unknown;
    getMap(mapId: string): Promise<MapT>;
    getTranslate(mapTranslateId: string): Promise<MapTranslateT>;
    getCard(mapTranslateId: string, cardId: string): Promise<CardT>;
    getCards(mapTranslateId: string): Promise<CardT[]>;
}
//# sourceMappingURL=Exercise.d.ts.map