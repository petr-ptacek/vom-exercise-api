import { HandlersMapT } from '../typings';

export function toMapOfArrayHandlers(handlers: HandlersMapT): HandlersMapT<(() => void)[]> {
  const result: HandlersMapT<(() => void)[]> = {};

  Object.entries(handlers).forEach(
    ([key, handler]) => {
      if ( !result[key] ) {
        result[key] = [];
      }

      if ( Array.isArray(handler) ) {
        result[key].push(...handler);
      } else {
        result[key].push(handler);
      }
    }
  );

  return result;
}