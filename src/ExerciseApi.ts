import { EmitHandler, EventEmitter, OffHandler, OnHandler } from './EventEmitter';
import { Exercise }                                         from './Exercise';

export interface IExerciseApi {
  exercise: Exercise | null;
  addEventListener: OnHandler;
  removeEventListener: OffHandler;
  dispatchEvent: EmitHandler;
}

const ExerciseApi: IExerciseApi = {
  exercise: null,

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