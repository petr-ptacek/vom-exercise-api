import { Exercise }               from './Exercise/Exercise.js';
import { ICreateExerciseOptions } from './createUserExerciseFactory';

export function createUserExercise(options: ICreateExerciseOptions): Exercise {
  if ( !window.parent.ExerciseApi.createUserExercise ) {
    throw new Error('createExercise function is not defined');
  }

  return window.parent.ExerciseApi.createUserExercise(options);
}