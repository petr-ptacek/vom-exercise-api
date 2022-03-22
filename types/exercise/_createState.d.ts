import type { NullableT } from '../typings';
import type { ConfigurationT } from './typings';
export interface IExerciseData {
    loading: boolean;
    initialized: boolean;
    attemptId: string;
    totalSteps: NullableT<number>;
    currentStep: NullableT<number>;
    startAt: NullableT<Date>;
    configuration: NullableT<ConfigurationT>;
    answers: NullableT<boolean>[];
    timeExpireCheckerIntervalId: number | null;
    timeExpireNotifySeconds: number | null;
    timeExpireNotifyHandler: (() => void) | null;
}
export declare function createState(data: IExerciseData): IExerciseData;
//# sourceMappingURL=_createState.d.ts.map