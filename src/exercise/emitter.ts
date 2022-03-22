import { Exercise }                                  from './Exercise';
import mitt                                          from 'mitt';
import type { DialogOptionsT, TimerHighlightColorT } from './typings';

interface IEventPayload<T = any> {
  exercise: Exercise;
  preventDefault?: boolean;
  data?: T;
}

interface IEventPayloadShowDialog extends IEventPayload {
  data: DialogOptionsT;
}

interface IEventPayloadTimerHighlight extends IEventPayload {
  data: {
    color: TimerHighlightColorT
  };
}

type EventsT = {
  INSTANCE_CREATED: IEventPayload,
  INITIALIZED: IEventPayload,
  START: IEventPayload,
  END: IEventPayload,
  EXIT: IEventPayload,
  LOADER_SHOW: IEventPayload,
  LOADER_HIDE: IEventPayload,
  SHOW_DIALOG: IEventPayloadShowDialog,
  UPDATE_STEP: IEventPayload,
  ANSWER_SET: IEventPayload,
  ALL_ANSWERS_FILLED: IEventPayload,
  TIME_EXPIRED: IEventPayload,
  TIMER_HIGHLIGHT: IEventPayloadTimerHighlight
}

type EventNamesT = keyof EventsT;

const emitter = mitt<EventsT>();

const EVENT_NAMES: Readonly<{ readonly [K in EventNamesT]: K }> = Object.freeze({
  INSTANCE_CREATED: 'INSTANCE_CREATED',
  INITIALIZED: 'INITIALIZED',
  START: 'START',
  END: 'END',
  EXIT: 'EXIT',
  LOADER_SHOW: 'LOADER_SHOW',
  LOADER_HIDE: 'LOADER_HIDE',
  SHOW_DIALOG: 'SHOW_DIALOG',
  UPDATE_STEP: 'UPDATE_STEP',
  ANSWER_SET: 'ANSWER_SET',
  ALL_ANSWERS_FILLED: 'ALL_ANSWERS_FILLED',
  TIME_EXPIRED: 'TIME_EXPIRED',
  TIMER_HIGHLIGHT: 'TIMER_HIGHLIGHT'
});

export {
  emitter,
  EVENT_NAMES,
  EventsT,
  EventNamesT,
  IEventPayload,
  IEventPayloadTimerHighlight,
  IEventPayloadShowDialog
};
