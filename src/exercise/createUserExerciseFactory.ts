import type { IConstructorOptions } from './typings';
import { createExercise }           from './createExercise';
import { createUserExercise }       from './createUserExercise';
import { Exercise }                 from './Exercise';


export function createUserExerciseFactory(constructorOptions: IConstructorOptions, parentWindow?: Window): typeof createUserExercise {
  const _window = parentWindow ?? window;

  return (options): Exercise => {
    _window.ExerciseApi.exercise = createExercise(constructorOptions, options);
    return _window.ExerciseApi.exercise;
  };
}