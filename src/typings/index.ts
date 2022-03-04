export type Nullable<T = any> = T | null

export type Dictionary<T = unknown> = { [key: string]: T };

export interface ILanguage {
  description: string;
  icon_image: string;
  id: string;
  identifier: string;
}

export interface IConfiguration {
  maps: string[];
  config: Dictionary;
  config_params: Dictionary;
  exercise_name: string;
  native_language: ILanguage;
  exercise_language: ILanguage;
  max_duration_minutes: number | null;
}

export interface IMap {
  id: string;
  img: string;
  map_translate_native: string;
  map_translate_exercise: string;
}

export interface ITranslate {
  id: string;
  name: string;
  description: string;
  cards: string[];
}

export interface ICard {
  id: string;
  picture: string;
  card_translate: string;
}