export declare class Timer {
    private _intervalId;
    private _counter;
    private _running;
    private _paused;
    private _timeout;
    constructor(timeout?: number);
    get counter(): number;
    get running(): boolean;
    get paused(): boolean;
    start(): void;
    stop(): void;
    pause(): void;
    private clearInterval;
    private clear;
}
//# sourceMappingURL=Timer.d.ts.map