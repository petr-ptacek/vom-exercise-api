import type { IExerciseApi } from './ExerciseApi';
import { ExerciseApi }       from './ExerciseApi';

declare global {
  interface Window {
    ExerciseApi: IExerciseApi;
    Urls: { [key: string]: (...args: unknown[]) => string };
  }
}

window.ExerciseApi = ExerciseApi;

export type {
  ConfigurationT,
  MapT,
  MapTranslateT,
  CardT,
  LanguageT
} from './exercise';

export type {
  IExerciseApi
};

export {
  Exercise,
  exerciseUtils as utils
} from './exercise';

export {
  ExerciseApi
};