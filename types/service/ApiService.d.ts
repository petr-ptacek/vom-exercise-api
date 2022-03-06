import type { IMap, ITranslate, IConfiguration, ICard } from './../typings';
export declare namespace ApiService {
    interface Response<T = any> {
        status: number;
        data?: T;
    }
    type PromisifyResponse<T = any> = Promise<Response<T>>;
}
export declare class ApiService {
    static getExerciseConfiguration(exerciseAttemptId: string): ApiService.PromisifyResponse<IConfiguration>;
    static getMap(exerciseAttemptId: string, mapId: string): ApiService.PromisifyResponse<IMap>;
    static getMapTranslate(mapTranslateId: string): ApiService.PromisifyResponse<ITranslate>;
    static getCard(mapTranslateId: string, cardId: string): ApiService.PromisifyResponse<ICard>;
    static getCards(mapTranslateId: string): ApiService.PromisifyResponse<ICard[]>;
    static startExercise(exerciseAttemptId: string): ApiService.PromisifyResponse<{
        id: string;
        started: string;
    }>;
    static finishExercise(exerciseAttemptId: string): ApiService.PromisifyResponse<unknown>;
    static writeProgress(exerciseAttemptId: string, score: number): ApiService.PromisifyResponse<{
        result_percentage: number;
    }>;
    static validate(exerciseAttemptId: string): ApiService.PromisifyResponse<{
        errors: string[];
    }>;
    static setCurrentQuestion(exerciseAttemptId: string, step: number): ApiService.PromisifyResponse<{
        current_question: number;
    }>;
    static setCurrentAnswer(exerciseAttemptId: string, questionIndex: number, answer: boolean): ApiService.PromisifyResponse<{
        index: number;
        value: boolean;
    }>;
}
//# sourceMappingURL=ApiService.d.ts.map