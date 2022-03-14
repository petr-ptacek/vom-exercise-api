import { defineConfig } from 'vite';
import * as path        from 'path';

export default defineConfig({
  build: {
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    lib: {
      name: 'ExerciseApi',
      formats: ['es'],
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format => `vom-exercise-api.${ format }.js`)
    }
  }
});
