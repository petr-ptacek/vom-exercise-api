import type { IExerciseApi } from './ExerciseApi';
import { ExerciseApi } from './ExerciseApi';
declare global {
    interface Window {
        ExerciseApi: IExerciseApi;
        Urls: {
            [key: string]: (...args: unknown[]) => string;
        };
    }
}
export type { ICreateExerciseOptions, ICreateExerciseFn } from './createUserExerciseFactory';
export { createUserExerciseFactory } from './createUserExerciseFactory';
export { createUserExercise } from './createUserExercise';
export { Exercise } from './Exercise/Exercise.js';
export { EXERCISE_UTILS } from './EXERCISE_UTILS';
export type { ICard, IConfiguration, ILanguage, IMap, ITranslate } from './typings';
export { IExerciseApi, ExerciseApi };
//# sourceMappingURL=index.d.ts.map