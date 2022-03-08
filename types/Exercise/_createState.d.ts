import { IConfiguration, Nullable } from '../typings';
export interface IExerciseData {
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
export declare function createState(data: IExerciseData): IExerciseData;
//# sourceMappingURL=_createState.d.ts.map