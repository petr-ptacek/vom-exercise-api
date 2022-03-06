import { defineConfig } from 'vite';
import * as path        from 'path';

export default defineConfig({
  build: {
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    lib: {
      name: 'ExerciseApi',
      formats: ['umd', 'es'],
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format => `vom-exercise-api.${ format }.js`)
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
