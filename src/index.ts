import type { IExerciseApi } from './ExerciseApi';
import { ExerciseApi }       from './ExerciseApi';

declare global {
  interface Window {
    ExerciseApi: IExerciseApi;
    Urls: { [key: string]: (...args: unknown[]) => string };
  }
}

export type { ICreateExerciseOptions, ICreateExerciseFn } from './createUserExerciseFactory';
export { createUserExerciseFactory }                      from './createUserExerciseFactory';

export { createUserExercise } from './createUserExercise';

export type {
  ICard,
  IConfiguration,
  ILanguage,
  IMap,
  ITranslate
} from './typings';

window.ExerciseApi = ExerciseApi;

export {
  IExerciseApi,
  ExerciseApi
};