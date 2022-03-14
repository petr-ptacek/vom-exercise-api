import { Exercise }               from './Exercise';
import { ICreateExerciseOptions } from './createExercise';

export function createUserExercise(options: ICreateExerciseOptions): Exercise {
  if ( !window.parent?.ExerciseApi?.createUserExercise ) {
    throw new Error('[createUserExercise] function is not defined');
  }

  return window.parent.ExerciseApi.createUserExercise(options);
}