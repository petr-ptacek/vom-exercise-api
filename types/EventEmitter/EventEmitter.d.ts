import { Handler } from 'mitt';
import { Exercise } from '../Exercise/Exercise';
import type { ShowMessageOptionsT } from '../typings/';
export declare type EventTypes = {
    'EXERCISE_INSTANCE_CREATED': Exercise;
    'EXERCISE_INITIALIZED': boolean;
    'EXERCISE_START': void;
    'EXERCISE_TIME_EXPIRED': void;
    'EXERCISE_BEFORE_END': void;
    'EXERCISE_END': void;
    'EXERCISE_EXIT': void;
    'EXERCISE_MESSAGE_SHOW': ShowMessageOptionsT;
    'EXERCISE_ANSWER_SET': void;
    'EXERCISE_ALL_ANSWERS_FILLED': void;
    'EXERCISE_STEP_UPDATE': void;
    'EXERCISE_LOADER_SHOW': void;
    'EXERCISE_LOADER_HIDE': void;
};
export declare type OnHandler = <Key extends keyof EventTypes>(type: Key, handler: Handler<EventTypes[Key]>) => void;
export declare type OffHandler = <Key extends keyof EventTypes>(type: Key, handler?: Handler<EventTypes[Key]>) => void;
export declare type EmitHandler = <Key extends keyof EventTypes>(type: Key, event?: EventTypes[Key]) => void;
export declare class EventEmitter {
    static on: OnHandler;
    static off: OffHandler;
    static emit: EmitHandler;
}
//# sourceMappingURL=EventEmitter.d.ts.map