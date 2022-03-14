import { IConstructorOptions, ISetupData, IUserDefinedHooks, ValidationErrorT } from './typings';
import { Exercise }                                                             from './Exercise';

export interface ICreateExerciseOptions extends IUserDefinedHooks {
}

export function createExercise(constructorOptions: IConstructorOptions, options: ICreateExerciseOptions) {

  return new class extends Exercise {
    constructor() {
      super(constructorOptions);
    }

    public onAllAnswersFilled(): Promise<boolean> {
      return options.onAllAnswersFilled();
    }

    public onBeforeEnd(): Promise<boolean> {
      return options.onBeforeEnd();
    }

    public onEnd(): Promise<boolean> {
      return options.onEnd();
    }

    public onInitialized(errors: ValidationErrorT[]): Promise<boolean> {
      return options.onInitialized(errors);
    }

    public onSetup(): Promise<ISetupData> {
      return options.onSetup();
    }

    public onStart(): Promise<boolean> {
      return options.onStart();
    }

    public onTimeExpired(): Promise<boolean> {
      return options.onTimeExpired();
    }
  };
}