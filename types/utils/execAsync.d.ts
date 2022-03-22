export declare type ExecAsyncResultT<T = unknown, K = unknown> = {
    data: T | null;
    error: K | null;
};
export declare function execAsync<T = unknown, K extends Error = Error>(promiseLike: PromiseLike<T>): Promise<ExecAsyncResultT<T, K>>;
//# sourceMappingURL=execAsync.d.ts.map