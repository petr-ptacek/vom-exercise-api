export type ExecAsyncResult<T = unknown, K = unknown> = {
  data: T | null
  error: K | null
}

export async function execAsync<T = unknown, K extends Error = Error>(promiseLike: PromiseLike<T>): Promise<ExecAsyncResult<T, K>> {
  const result: ExecAsyncResult<T, K> = {
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
