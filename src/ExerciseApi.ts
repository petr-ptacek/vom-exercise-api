import { EmitHandler, EventEmitter, OffHandler, OnHandler } from './EventEmitter';
import { Exercise }                                         from './Exercise/Exercise.js';
import { createUserExercise }                               from './createUserExercise';

export interface IExerciseApi {
  exercise: Exercise | null;
  createUserExercise: typeof createUserExercise | null;
  addEventListener: OnHandler;
  removeEventListener: OffHandler;
  dispatchEvent: EmitHandler;
}

const ExerciseApi: IExerciseApi = {
  exercise: null,
  createUserExercise: null,

  addEventListener(type, handler) {
    EventEmitter.on(type, handler);
  },
  removeEventListener(type, handler) {
    EventEmitter.off(type, handler);
  },
  dispatchEvent(type, event) {
    EventEmitter.emit(type, event);
  }
};

export { ExerciseApi };