export declare type RequestMethod = 'GET' | 'POST' | 'PUT';
export declare type RequestOptions = {
    url: string;
    method: RequestMethod;
    data?: unknown;
};
export declare class HTTPController {
    static makeRequest(options: RequestOptions): Promise<Response>;
    static hasResponseJSONBody(response: Response): boolean;
    static parseResponseBodyJSON<T = unknown>(response: Response): Promise<T | undefined>;
    static get(url: string): Promise<Response>;
    static post(url: string, data?: {}): Promise<Response>;
    static put(url: string, data?: {}): Promise<Response>;
}
//# sourceMappingURL=HTTPController.d.ts.map