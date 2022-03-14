import {
  aspectRatio,
  shuffleArray,
  getRandomNumber
} from '../utils';

export interface IExerciseUtils {
  aspectRatio: typeof aspectRatio;
  shuffleArray: typeof shuffleArray;
  getRandomNumber: typeof getRandomNumber;
}

export const exerciseUtils: Readonly<IExerciseUtils> = Object.freeze<IExerciseUtils>({
  aspectRatio,
  shuffleArray,
  getRandomNumber
});