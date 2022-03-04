import type { IExerciseApi } from './ExerciseApi';
import { ExerciseApi }       from './ExerciseApi';

declare global {
  interface Window {
    ExerciseApi: IExerciseApi;
    Urls: { [key: string]: (...args: unknown[]) => string };
  }
}

export type { ICreateExerciseOptions } from './createExercise';
export { createExercise }              from './createExercise';

export type {
  ICard,
  IConfiguration,
  ILanguage,
  IMap,
  ITranslate
} from './typings';

export {
  IExerciseApi,
  ExerciseApi
};