import type { DictionaryT, NullableT } from '../../typings';
import type { IProvidedDataApi }       from '../DataService';

export type TimerHighlightColorT = 'warn' | 'success' | 'error' | 'initial';

export interface IConstructorOptions {
  dataProviders: IProvidedDataApi;
  exerciseAttemptId: string;
  timeExpireHandlers?: HandlersMapT;
}

export type HandlersMapT<T = ((() => void)[]) | (() => void)> = {
  [key: string | number]: T;
}

export interface ISetupData {
  totalSteps: number;
  timeExpireHandlers?: HandlersMapT;
}

export interface IData {
  loading: boolean;
  initialized: boolean;
  attemptId: string;
  totalSteps: NullableT<number>;
  currentStep: NullableT<number>;
  startAt: NullableT<Date>;
  configuration: NullableT<ConfigurationT>;
  userAnswers: NullableT<boolean>[];
  countdown: boolean;

  timeExpire: {
    intervalId: number | null;
    handlers: HandlersMapT<(() => void)[]>;
  };
}

export interface IUserDefinedHooks {
  onSetup(): Promise<ISetupData>;

  onInitialized(errors: ValidationErrorT[]): Promise<boolean>;

  onStart(): Promise<boolean>;

  onEnd(): Promise<boolean>;

  onBeforeEnd(): Promise<boolean>;

  onTimeExpired(): Promise<boolean>;

  onAllAnswersFilled(): Promise<boolean>;
}

export type DialogTypeT = 'success' | 'error' | 'warning';

export type DialogOptionsT = {
  type?: DialogTypeT;
  title?: string;
  message?: string;
  closeable?: boolean;
  onCloseHandler?: () => void;
  buttons?: {
    type?: 'success' | 'error' | 'warning';
    label: string;
    handler: () => void;
  }[]
}

export type ValidationErrorT = {
  type: 'server' | 'internal';
  message: string;
}

export type LanguageT = {
  description: string;
  icon_image: string;
  id: string;
  identifier: string;
}

export type ConfigurationT = {
  maps: string[];
  config: DictionaryT;
  config_params: DictionaryT;
  exercise_name: string;
  native_language: LanguageT;
  exercise_language: LanguageT;
  count_cards_total: number;
  max_duration_minutes: NullableT<number>;
}

export type MapT = {
  id: string;
  img: string;
  map_translate_native: string;
  map_translate_exercise: string;
}

export type MapTranslateT = {
  id: string;
  map_id: string;
  name: string;
  description: string;
  cards: string[];
}

export type CardT = {
  id: string;
  map_id: string;
  map_translate_id: string;
  picture: string;
  card_translate: string;
};