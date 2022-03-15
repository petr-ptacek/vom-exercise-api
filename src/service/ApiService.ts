import type {
  MapT,
  MapTranslateT,
  ConfigurationT,
  CardT
}                         from './../exercise';
import { Urls }           from './Urls';
import { HTTPController } from './HTTPController';

async function parseResponse<T = any>(response: Response): ApiService.PromisifyResponse<T> {
  const data = await HTTPController.parseResponseBodyJSON<T>(response);

  return {
    status: response.status,
    ok: response.ok,
    data
  };
}

export namespace ApiService {
  export interface Response<T = any> {
    status: number;
    ok: boolean;
    data?: T;
  }

  export type PromisifyResponse<T = any> = Promise<Response<T>>
}


export class ApiService {
  static async getExerciseConfiguration(exerciseAttemptId: string): ApiService.PromisifyResponse<ConfigurationT> {
    const url: string = window.Urls[Urls.InitConfiguration](exerciseAttemptId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async getMap(exerciseAttemptId: string, mapId: string): ApiService.PromisifyResponse<MapT> {
    const url: string = window.Urls[Urls.Map](exerciseAttemptId, mapId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async getMapTranslate(mapTranslateId: string): ApiService.PromisifyResponse<MapTranslateT> {
    const url: string = window.Urls[Urls.MapTranslate](mapTranslateId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async getCard(mapTranslateId: string, cardId: string): ApiService.PromisifyResponse<CardT> {
    const url: string = window.Urls[Urls.Card](cardId, mapTranslateId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async getCards(mapTranslateId: string): ApiService.PromisifyResponse<CardT[]> {
    const url: string = window.Urls[Urls.Cards](mapTranslateId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async startExercise(exerciseAttemptId: string): ApiService.PromisifyResponse<{ id: string, started: string }> {
    const url: string = window.Urls[Urls.StartExercise](exerciseAttemptId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async finishExercise(exerciseAttemptId: string): ApiService.PromisifyResponse<unknown> {
    const url: string = window.Urls[Urls.FinishExercise](exerciseAttemptId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async writeProgress(exerciseAttemptId: string, score: number): ApiService.PromisifyResponse<{ result_percentage: number }> {
    const url: string = window.Urls[Urls.WriteProgress](exerciseAttemptId);
    const response = await HTTPController.put(url, { result_percentage: score });
    return parseResponse(response);
  }

  static async validate(exerciseAttemptId: string): ApiService.PromisifyResponse<{ errors: string[] }> {
    const url: string = window.Urls[Urls.Validate](exerciseAttemptId);
    const response = await HTTPController.get(url);
    return parseResponse(response);
  }

  static async setCurrentQuestion(exerciseAttemptId: string, step: number): ApiService.PromisifyResponse<{ current_question: number }> {
    const url: string = window.Urls[Urls.SetCurrentQuestion](exerciseAttemptId);
    const response = await HTTPController.put(url, { current_question: step });
    return parseResponse(response);
  }

  static async setCurrentAnswer(exerciseAttemptId: string, questionIndex: number, answer: boolean): ApiService.PromisifyResponse<{ index: number, value: boolean }> {
    const url = window.Urls[Urls.SetCurrentAnswer](exerciseAttemptId);
    const response = await HTTPController.put(
      url, { index: questionIndex, value: answer }
    );

    return parseResponse(response);
  }
}
