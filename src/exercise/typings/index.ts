import { DictionaryT, NullableT } from '../../typings';

export interface IConstructorOptions {
  exerciseAttemptId: string;
}

export interface ISetupData {
  totalSteps: number;
  timeExpireNotifySeconds?: number;
  timeExpireNotifyHandler?: () => void;
}

export interface IData {
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

export interface IUserDefinedHooks {
  onSetup(): Promise<ISetupData>;

  onInitialized(errors: ValidationErrorT[]): Promise<boolean>;

  onStart(): Promise<boolean>;

  onEnd(): Promise<boolean>;

  onBeforeEnd(): Promise<boolean>;

  onTimeExpired(): Promise<boolean>;

  onAllAnswersFilled(): Promise<boolean>;
}

export type ShowMessageOptionsT = {
  type?: 'success' | 'error' | 'warning'
  title?: string;
  message?: string;
  confirmLabel?: string;
  confirmCallback?: () => void;
  cancelLabel?: string;
  cancelCallback?: () => void;
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