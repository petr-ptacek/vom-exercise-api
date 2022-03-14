import { Exercise }                 from './Exercise';
import mitt                         from 'mitt';
import type { ShowMessageOptionsT } from './typings';

interface IExerciseEventPayload<T = any> {
  exercise: Exercise;
  data?: T;
}

interface IMessageShowEventPayload extends IExerciseEventPayload {
  data: ShowMessageOptionsT;
}

type ExerciseEventsT = {
  'instance-created': IExerciseEventPayload,
  'initialized': IExerciseEventPayload,
  'start': IExerciseEventPayload,
  'end': IExerciseEventPayload,
  'exit': IExerciseEventPayload,
  'loader-show': IExerciseEventPayload,
  'loader-hide': IExerciseEventPayload,
  'message-show': IMessageShowEventPayload,
  'update-step': IExerciseEventPayload,
  'answer-set': IExerciseEventPayload,
  'all-answers-filled': IExerciseEventPayload,
  'time-expired': IExerciseEventPayload
}

type ExerciseEventNamesT = keyof ExerciseEventsT;

const exerciseEmitter = mitt<ExerciseEventsT>();

export {
  exerciseEmitter,
  ExerciseEventsT,
  ExerciseEventNamesT,
  IExerciseEventPayload
};
