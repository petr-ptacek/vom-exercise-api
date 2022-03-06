import { aspectRatio } from './utils';
import { Dictionary, ICard, IConfiguration, ILanguage, IMap, ITranslate, Nullable } from './typings';
export declare type SetupFn = () => Promise<ISetupData> | ISetupData;
export declare type OnStartFn = () => void;
export declare type OnEndFn = () => void;
export declare type OnBeforeEndFn = () => boolean;
export declare type OnTimeExpiredFn = () => void;
export declare type OnInitializedFn = (errors: ValidationError[]) => boolean;
export interface IData {
    loading: boolean;
    initialized: boolean;
    attemptId: string;
    totalSteps: number | null;
    currentStep: number | null;
    startAt: Date | null;
    configuration: IConfiguration | null;
    answers: (boolean | null)[];
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
export declare type ValidationError = {
    type: 'server' | 'internal';
    message: string;
};
export declare abstract class Exercise {
    private _data;
    readonly utils: Readonly<{
        aspectRatio: typeof aspectRatio;
    }>;
    constructor(options: IOptions);
    get attemptId(): string;
    get config(): Nullable<Dictionary>;
    get configParams(): Nullable<Dictionary>;
    get mapIds(): Nullable<string[]>;
    get exerciseName(): Nullable<string>;
    get nativeLanguage(): Nullable<ILanguage>;
    get exerciseLanguage(): Nullable<ILanguage>;
    get totalSteps(): Nullable<number>;
    get currentStep(): Nullable<number>;
    get completionPercentage(): number;
    get successPercentage(): number;
    get initialized(): boolean;
    get loading(): boolean;
    get maxDurationMinutes(): Nullable<number>;
    protected abstract setup(): Promise<ISetupData> | ISetupData;
    protected abstract onInitialized(errors: ValidationError[]): Promise<boolean> | boolean;
    protected abstract onStart(): Promise<void> | void;
    protected abstract onEnd(): void;
    protected abstract onBeforeEnd(): boolean;
    protected abstract onTimeExpired(): void;
    protected abstract onAllAnswersFilled(): void;
    private _validateServer;
    private _attachTimeExpiredChecker;
    private _detachTimeExpiredChecker;
    private _validateInternal;
    private _validate;
    private _setCurrentStep;
    private _setup;
    private _fetchConfigurationData;
    initialize(): Promise<boolean>;
    writeAnswer(answer: boolean, step?: number): Promise<boolean>;
    getTime(): number;
    getTimeRemaining(): number | null;
    stepNext(): Promise<boolean>;
    stepBack(): Promise<boolean>;
    setCurrentStep(step: number): Promise<boolean>;
    start(): Promise<void>;
    end(): Promise<void>;
    beforeEnd(): boolean;
    timeExpired(): void;
    showLoader(): void;
    hideLoader(): void;
    getAnswers(): (boolean | null)[];
    getTrueAnswers(): number[];
    getFalseAnswers(): number[];
    getMap(mapId: string): Promise<IMap>;
    getTranslate(mapTranslateId: string): Promise<ITranslate>;
    getCard(mapTranslateId: string, cardId: string): Promise<ICard>;
    getCards(mapTranslateId: string): Promise<ICard[]>;
}
//# sourceMappingURL=Exercise.d.ts.map