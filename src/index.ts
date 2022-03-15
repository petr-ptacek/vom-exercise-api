import { emitter, Exercise, createExercise, createUserExercise } from './exercise';

interface IExerciseApi {
  exercise: Exercise | null;
  createExercise: typeof createExercise | null;
  createUserExercise: typeof createUserExercise | null;
  addEventListener: typeof emitter.on;
  removeEventListener: typeof emitter.off;
  dispatchEvent: typeof emitter.emit;
}

declare global {
  interface Window {
    ExerciseApi: IExerciseApi;
    Urls: { [key: string]: (...args: unknown[]) => string };
  }
}

const ExerciseApi: IExerciseApi = {
  exercise: null,
  createExercise: null,
  createUserExercise: null,
  addEventListener: emitter.on,
  removeEventListener: emitter.off,
  dispatchEvent: emitter.emit
};


window.ExerciseApi = ExerciseApi;

export type {
  ConfigurationT,
  MapT,
  MapTranslateT,
  CardT,
  LanguageT
} from './exercise';

export {
  Exercise,
  exerciseUtils as utils
} from './exercise';

export type {
  createExercise,
  createUserExercise,
  IExerciseApi
};

export {
  ExerciseApi
};