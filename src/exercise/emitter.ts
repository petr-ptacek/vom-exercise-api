import { Exercise }                 from './Exercise';
import mitt                           from 'mitt';
import type { DialogMessageOptionsT } from './typings';

interface IEventPayload<T = any> {
  exercise: Exercise;
  data?: T;
}

interface IMessageShowEventPayload extends IEventPayload {
  data: DialogMessageOptionsT;
}

type EventsT = {
  'instance-created': IEventPayload,
  'initialized': IEventPayload,
  'start': IEventPayload,
  'end': IEventPayload,
  'exit': IEventPayload,
  'loader-show': IEventPayload,
  'loader-hide': IEventPayload,
  'message-show': IMessageShowEventPayload,
  'update-step': IEventPayload,
  'answer-set': IEventPayload,
  'all-answers-filled': IEventPayload,
  'time-expired': IEventPayload
}

type EventNamesT = keyof EventsT;

const emitter = mitt<EventsT>();

export {
  emitter,
  EventsT,
  EventNamesT,
  IEventPayload
};
