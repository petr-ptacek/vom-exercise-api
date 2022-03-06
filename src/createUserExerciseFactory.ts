import type { IOptions, ISetupData, ValidationError } from './Exercise';
import { Exercise }                                   from './Exercise';


export interface ICreateExerciseOptions {
  setup(): Promise<ISetupData> | ISetupData;

  onInitialized(errors: ValidationError[]): Promise<boolean> | boolean;

  onStart(): void;

  onEnd(): void;

  onBeforeEnd(): boolean;

  onTimeExpired(): void;

  onAllAnswersFilled(): void;
}

export interface ICreateExerciseFn {
  (options: ICreateExerciseOptions): Exercise;
}

export function createUserExerciseFactory(constructorOptions: IOptions): ICreateExerciseFn {
  return (options: ICreateExerciseOptions) => {
    window.ExerciseApi.exercise = new class extends Exercise {
      constructor() {
        super(constructorOptions);
      }

      protected onAllAnswersFilled(): void {
      }

      protected onBeforeEnd(): boolean {
        return options.onBeforeEnd();
      }

      protected onEnd(): void {
        return options.onEnd();
      }

      protected onInitialized(errors: ValidationError[]): Promise<boolean> | boolean {
        return options.onInitialized(errors);
      }

      protected onStart(): Promise<void> | void {
        return options.onStart();
      }

      protected onTimeExpired(): void {
        return options.onTimeExpired();
      }

      protected setup(): Promise<ISetupData> | ISetupData {
        return options.setup();
      }
    };

    return window.ExerciseApi.exercise;
  };

}