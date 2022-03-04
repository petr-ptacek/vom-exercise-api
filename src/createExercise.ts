import type { ValidationError, ISetupData } from './Exercise';
import { Exercise }                         from './Exercise';

export interface ICreateExerciseOptions {
  setup(): Promise<ISetupData> | ISetupData;

  onInitialized(errors: ValidationError[]): Promise<boolean> | boolean;

  onStart(): void;

  onEnd(): void;

  onBeforeEnd(): boolean;

  onTimeExpired(): void;

  onAllAnswersFilled(): void;
}

export interface CreateExerciseFn {
  (options: ICreateExerciseOptions): Exercise;
}

/**
 * @param {ICreateExerciseOptions} options
 * @returns {Exercise}
 */
// @ts-ignore
export function createExercise(options: ICreateExerciseOptions): Exercise {
  throw new Error('Not implemented ...');
}

/**
 * EXAMPLE: THE IMPLEMENTATION  of createExercise
 function createExercise(options) {
  class _Exercise extends Exercise {
    onInitialized(errors) {
      return options.onInitialized(errors);
    }

    setup() {
      return options.setup();
    }

    onStart() {
      return options.onStart();
    }

    onEnd() {
      return options.onEnd();
    }

    onBeforeEnd() {
      return options.onBeforeEnd();
    }

    onTimeExpired() {
      return options.onTimeExpired();
    }
  }

  return new _Exercise({
    exerciseAttemptId: '123-456-789'
  });
}
 **/