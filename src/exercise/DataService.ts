import type {
  MapT,
  MapTranslateT,
  ConfigurationT,
  CardT
} from './typings';

export interface IProvidedDataApi {
  configuration: (exerciseAttemptId: string) =>
    ReturnType<DataService['getConfiguration']>;
  map: (exerciseAttemptId: string, mapId: string) =>
    ReturnType<DataService['getMap']>;
  mapTranslate: (mapTranslateId: string) =>
    ReturnType<DataService['getMapTranslate']>;
  card: (mapTranslateId: string, cardId: string) =>
    ReturnType<DataService['getCard']>;
  cards: (mapTranslateId: string) =>
    ReturnType<DataService['getCards']>;
  startExercise: (exerciseAttemptId: string) =>
    ReturnType<DataService['startExercise']>;
  finishExercise: (exerciseAttemptId: string, duration: number) =>
    ReturnType<DataService['finishExercise']>;
  writeProgress: (exerciseAttemptId: string, score: number) =>
    ReturnType<DataService['writeProgress']>;
  validate: (exerciseAttemptId: string) =>
    ReturnType<DataService['validate']>;
  setCurrentQuestion: (exerciseAttemptId: string, questionIndex: number) =>
    ReturnType<DataService['setCurrentQuestion']>;
  setCurrentAnswer: (exerciseAttemptId: string, questionIndex: number, answer: boolean) =>
    ReturnType<DataService['setCurrentAnswer']>;
}

export interface IDataServiceOptions {
  dataProviders: IProvidedDataApi;
}

export type DataServiceResultT<T = unknown> = {
  data: T;
  ok: boolean;
}

export class DataService {
  readonly dataProviders: IProvidedDataApi;

  constructor(options: IDataServiceOptions) {
    this.dataProviders = options.dataProviders;
  }

  getConfiguration(exerciseAttemptId: string): Promise<DataServiceResultT<ConfigurationT>> {
    return this.dataProviders.configuration(exerciseAttemptId);
  }

  getMap(exerciseAttemptId: string, mapId: string): Promise<DataServiceResultT<MapT>> {
    return this.dataProviders.map(exerciseAttemptId, mapId);
  }

  getMapTranslate(mapTranslateId: string): Promise<DataServiceResultT<MapTranslateT>> {
    return this.dataProviders.mapTranslate(mapTranslateId);
  }

  getCard(mapTranslateId: string, cardId: string): Promise<DataServiceResultT<CardT>> {
    return this.dataProviders.card(mapTranslateId, cardId);
  }

  getCards(mapTranslateId: string): Promise<DataServiceResultT<CardT[]>> {
    return this.dataProviders.cards(mapTranslateId);
  }

  startExercise(exerciseAttemptId: string): Promise<DataServiceResultT<{ id: string, started: string }>> {
    return this.dataProviders.startExercise(exerciseAttemptId);
  }

  finishExercise(exerciseAttemptId: string, duration: number): Promise<DataServiceResultT<unknown>> {
    return this.dataProviders.finishExercise(exerciseAttemptId, duration);
  }

  writeProgress(exerciseAttemptId: string, score: number): Promise<DataServiceResultT<{ result_percentage: number }>> {
    return this.dataProviders.writeProgress(exerciseAttemptId, score);
  }

  validate(exerciseAttemptId: string): Promise<DataServiceResultT<{ errors: string[] }>> {
    return this.dataProviders.validate(exerciseAttemptId);
  }

  setCurrentQuestion(exerciseAttemptId: string, step: number): Promise<DataServiceResultT<{ current_question: number }>> {
    return this.dataProviders.setCurrentQuestion(exerciseAttemptId, step);
  }

  setCurrentAnswer(exerciseAttemptId: string, questionIndex: number, answer: boolean): Promise<DataServiceResultT<{ index: number, value: boolean }>> {
    return this.dataProviders.setCurrentAnswer(exerciseAttemptId, questionIndex, answer);
  }
}