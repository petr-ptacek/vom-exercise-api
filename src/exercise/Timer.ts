import type { NullableT } from '../typings';

export class Timer {
  private _intervalId: NullableT<number> = null;
  private _counter: number = 0;
  private _running: boolean = false;
  private _paused: boolean = false;
  private _timeout: number;

  constructor(timeout: number = 1000) {
    this._timeout = timeout;
  }

  get counter(): number {
    return this._counter;
  }

  get running(): boolean {
    return this._running;
  }

  get paused(): boolean {
    return this._paused;
  }

  public start(): void {
    this._intervalId = window.setInterval(
      () => {
        this._counter++;
      },
      this._timeout
    );
    this._running = true;
  }

  public stop(): void {
    this.clear();
  }

  public pause(): void {
    this.clearInterval();
    this._paused = true;
  }

  private clearInterval() {
    if ( this._intervalId ) {
      window.clearInterval(this._intervalId as number);
    }

    this._intervalId = null;
  }

  private clear() {
    this.clearInterval();
    this._counter = 0;
    this._running = false;
    this._paused = false;
  }
}