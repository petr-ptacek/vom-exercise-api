import type { IOptions, ISetupData, ValidationError } from './Exercise/Exercise.js';
import { Exercise } from './Exercise/Exercise.js';
export interface ICreateExerciseOptions {
    setup(): Promise<ISetupData> | ISetupData;
    onInitialized(errors: ValidationError[]): Promise<boolean> | boolean;
    onStart(): void;
    onEnd(): void;
    onBeforeEnd(): boolean;
    onTimeExpired(): void;
    onAllAnswersFilled(): void;
}
export interface ICreateExerciseFn {
    (options: ICreateExerciseOptions): Exercise;
}
export declare function createUserExerciseFactory(constructorOptions: IOptions): ICreateExerciseFn;
//# sourceMappingURL=createUserExerciseFactory.d.ts.map