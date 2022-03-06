import { EmitHandler, OffHandler, OnHandler } from './EventEmitter';
import { Exercise } from './Exercise';
import { createUserExercise } from './createUserExercise';
export interface IExerciseApi {
    exercise: Exercise | null;
    createUserExercise: typeof createUserExercise | null;
    addEventListener: OnHandler;
    removeEventListener: OffHandler;
    dispatchEvent: EmitHandler;
}
declare const ExerciseApi: IExerciseApi;
export { ExerciseApi };
//# sourceMappingURL=ExerciseApi.d.ts.map