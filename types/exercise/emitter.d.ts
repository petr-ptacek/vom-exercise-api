import { Exercise } from './Exercise';
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
        color: TimerHighlightColorT;
    };
}
declare type EventsT = {
    INSTANCE_CREATED: IEventPayload;
    INITIALIZED: IEventPayload;
    START: IEventPayload;
    END: IEventPayload;
    EXIT: IEventPayload;
    LOADER_SHOW: IEventPayload;
    LOADER_HIDE: IEventPayload;
    SHOW_DIALOG: IEventPayloadShowDialog;
    UPDATE_STEP: IEventPayload;
    ANSWER_SET: IEventPayload;
    ALL_ANSWERS_FILLED: IEventPayload;
    TIME_EXPIRED: IEventPayload;
    TIMER_HIGHLIGHT: IEventPayloadTimerHighlight;
};
declare type EventNamesT = keyof EventsT;
declare const emitter: import("mitt").Emitter<EventsT>;
declare const EVENT_NAMES: Readonly<{
    readonly [K in EventNamesT]: K;
}>;
export { emitter, EVENT_NAMES, EventsT, EventNamesT, IEventPayload, IEventPayloadTimerHighlight, IEventPayloadShowDialog };
//# sourceMappingURL=emitter.d.ts.map