import {
  Exercise,
  exerciseEmitter,
  createUserExercise,
  createExercise
} from './exercise';

export interface IExerciseApi {
  exercise: Exercise | null;
  createExercise: typeof createExercise | null;
  createUserExercise: typeof createUserExercise | null;
  addEventListener: typeof exerciseEmitter.on;
  removeEventListener: typeof exerciseEmitter.off;
  dispatchEvent: typeof exerciseEmitter.emit;
}

const ExerciseApi: IExerciseApi = {
  exercise: null,
  createExercise: null,
  createUserExercise: null,
  addEventListener: exerciseEmitter.on,
  removeEventListener: exerciseEmitter.off,
  dispatchEvent: exerciseEmitter.emit
};

export { ExerciseApi };