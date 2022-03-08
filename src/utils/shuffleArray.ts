export function shuffleArray<T = unknown>(array: T[]): T[] {
  let currentIndex: number = array.length;
  let randomIndex: number = 0;

  while ( currentIndex !== 0 ) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}