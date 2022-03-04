import mitt, { Handler } from 'mitt';
import { Exercise }      from '../Exercise.js';

export type EventTypes = {
  'EXERCISE_INSTANCE_CREATED': Exercise;
  'EXERCISE_INITIALIZED': boolean;
  'EXERCISE_START': void;
  'EXERCISE_TIME_EXPIRED': void;
  'EXERCISE_BEFORE_END': void;
  'EXERCISE_END': void;

  'EXERCISE_ANSWER_SET': void;
  'EXERCISE_ALL_ANSWERS_FILLED': void;
  'EXERCISE_STEP_UPDATE': void;

  'EXERCISE_LOADER_SHOW': void;
  'EXERCISE_LOADER_HIDE': void;
}

export type OnHandler =
  <Key extends keyof EventTypes> (type: Key, handler: Handler<EventTypes[Key]>) => void;

export type OffHandler =
  <Key extends keyof EventTypes>(type: Key, handler?: Handler<EventTypes[Key]>) => void;

export type EmitHandler =
  <Key extends keyof EventTypes>(type: Key, event?: EventTypes[Key]) => void;


const _emitter = mitt<EventTypes>();

export class EventEmitter {
  static on: OnHandler = function (type, handler) {
    _emitter.on(type, handler);
  };

  static off: OffHandler = function (type, handler) {
    _emitter.off(type, handler);
  };

  static emit: EmitHandler = function (type, event): void {
    // @ts-ignore
    _emitter.emit(type, event);
  };
}