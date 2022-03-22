import type { MapT, MapTranslateT, ConfigurationT, CardT } from './typings';
export interface IProvidedDataApi {
    configuration: (exerciseAttemptId: string) => ReturnType<DataService['getConfiguration']>;
    map: (exerciseAttemptId: string, mapId: string) => ReturnType<DataService['getMap']>;
    mapTranslate: (mapTranslateId: string) => ReturnType<DataService['getMapTranslate']>;
    card: (mapTranslateId: string, cardId: string) => ReturnType<DataService['getCard']>;
    cards: (mapTranslateId: string) => ReturnType<DataService['getCards']>;
    startExercise: (exerciseAttemptId: string) => ReturnType<DataService['startExercise']>;
    finishExercise: (exerciseAttemptId: string, duration: number) => ReturnType<DataService['finishExercise']>;
    writeProgress: (exerciseAttemptId: string, score: number) => ReturnType<DataService['writeProgress']>;
    validate: (exerciseAttemptId: string) => ReturnType<DataService['validate']>;
    setCurrentQuestion: (exerciseAttemptId: string, questionIndex: number) => ReturnType<DataService['setCurrentQuestion']>;
    setCurrentAnswer: (exerciseAttemptId: string, questionIndex: number, answer: boolean) => ReturnType<DataService['setCurrentAnswer']>;
}
export interface IDataServiceOptions {
    dataProviders: IProvidedDataApi;
}
export declare type DataServiceResultT<T = unknown> = {
    data: T;
    ok: boolean;
};
export declare class DataService {
    readonly dataProviders: IProvidedDataApi;
    constructor(options: IDataServiceOptions);
    getConfiguration(exerciseAttemptId: string): Promise<DataServiceResultT<ConfigurationT>>;
    getMap(exerciseAttemptId: string, mapId: string): Promise<DataServiceResultT<MapT>>;
    getMapTranslate(mapTranslateId: string): Promise<DataServiceResultT<MapTranslateT>>;
    getCard(mapTranslateId: string, cardId: string): Promise<DataServiceResultT<CardT>>;
    getCards(mapTranslateId: string): Promise<DataServiceResultT<CardT[]>>;
    startExercise(exerciseAttemptId: string): Promise<DataServiceResultT<{
        id: string;
        started: string;
    }>>;
    finishExercise(exerciseAttemptId: string, duration: number): Promise<DataServiceResultT<unknown>>;
    writeProgress(exerciseAttemptId: string, score: number): Promise<DataServiceResultT<{
        result_percentage: number;
    }>>;
    validate(exerciseAttemptId: string): Promise<DataServiceResultT<{
        errors: string[];
    }>>;
    setCurrentQuestion(exerciseAttemptId: string, step: number): Promise<DataServiceResultT<{
        current_question: number;
    }>>;
    setCurrentAnswer(exerciseAttemptId: string, questionIndex: number, answer: boolean): Promise<DataServiceResultT<{
        index: number;
        value: boolean;
    }>>;
}
//# sourceMappingURL=DataService.d.ts.map