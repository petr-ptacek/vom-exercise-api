export declare type ExecAsyncResult<T = unknown, K = unknown> = {
    data: T | null;
    error: K | null;
};
export declare function execAsync<T = unknown, K extends Error = Error>(promiseLike: PromiseLike<T>): Promise<ExecAsyncResult<T, K>>;
//# sourceMappingURL=execAsync.d.ts.map