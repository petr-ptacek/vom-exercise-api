import type { NullableT }      from '../typings';
import type { ConfigurationT } from './typings';

export interface IExerciseData {
  loading: boolean;
  initialized: boolean;
  attemptId: string;
  totalSteps: NullableT<number>;
  currentStep: NullableT<number>;
  startAt: NullableT<Date>;
  configuration: NullableT<ConfigurationT>;
  answers: NullableT<boolean>[];

  timeExpireCheckerIntervalId: number | null;
  timeExpireNotifySeconds: number | null;
  timeExpireNotifyHandler: (() => void) | null;
}

const proxyHandler: ProxyHandler<IExerciseData> = {
  get(target: IExerciseData, property: keyof IExerciseData): any {
    return Reflect.get(target, property);
  },
  set(target: IExerciseData, property: keyof IExerciseData, value: any): boolean {
    return Reflect.set(target, property, value);
  }
};

export function createState(data: IExerciseData): IExerciseData {
  return new Proxy(data, proxyHandler);
}