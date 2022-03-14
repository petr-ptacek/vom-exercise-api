export type ExecAsyncResultT<T = unknown, K = unknown> = {
  data: T | null
  error: K | null
}

export async function execAsync<T = unknown, K extends Error = Error>(promiseLike: PromiseLike<T>): Promise<ExecAsyncResultT<T, K>> {
  const result: ExecAsyncResultT<T, K> = {
    data: null,
    error: null
  };

  try {
    result.data = await promiseLike;
  } catch ( e ) {
    result.error = e as K;
  }

  return result;
}
