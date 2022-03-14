export type NullableT<T = any> = T | null

export type DictionaryT<T = unknown> = { [key: string]: T };

export type Promisify<T = unknown> = T | Promise<T>;