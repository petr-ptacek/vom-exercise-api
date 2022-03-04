export function isPromise<T = unknown>(value: any): value is Promise<T> {
  return value instanceof Promise;
}