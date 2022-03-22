import { emitter, Exercise, createExercise, createUserExercise } from './exercise';
interface IExerciseApi {
    exercise: Exercise | null;
    createExercise: typeof createExercise;
    createUserExercise: typeof createUserExercise | null;
    addEventListener: typeof emitter.on;
    removeEventListener: typeof emitter.off;
    dispatchEvent: typeof emitter.emit;
}
declare global {
    interface Window {
        ExerciseApi: IExerciseApi;
    }
}
declare const ExerciseApi: IExerciseApi;
export type { ConfigurationT, MapT, MapTranslateT, CardT, LanguageT, EventsT, IEventPayload, IEventPayloadShowDialog, IEventPayloadTimerHighlight, IProvidedDataApi } from './exercise';
export type { IExerciseApi };
export { Exercise, emitter, EVENT_NAMES, createExercise, createUserExercise, createUserExerciseFactory } from './exercise';
export { computeAreaBasedAspectRatio, getRandomNumber, shuffleArray } from './utils';
export { ExerciseApi };
//# sourceMappingURL=index.d.ts.map