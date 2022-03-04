# Exercise-js-api

```html

<script>
  window.ExerciseApi.createExercise = function createExercise(options) {
    if ( window.ExerciseApi.exercise ) {
      throw new Error('Exercise instance already exists.');
    }

    class _Exercise extends window.ExerciseApi.Exercise {

      /**
       * @param {ValidationError[]} errors
       * @returns {(Promise<boolean> | boolean)}
       */
      onInitialized(errors) {
        return options.onInitialized(errors);
      }

      /**
       * @returns {(Promise<ISetupData>|ISetupData)}
       */
      setup() {
        return options.setup();
      }

      /**
       * @returns {void}
       */
      onStart() {
        return options.onStart();
      }

      /**
       * @returns {void}
       */
      onEnd() {
        return options.onEnd();
      }

      /**
       * @returns {boolean}
       */
      onBeforeEnd() {
        return options.onBeforeEnd();
      }

      /**
       * @returns {void}
       */
      onTimeExpired() {
        return options.onTimeExpired();
      }
    }

    window.ExerciseApi.exercise = new _Exercise({
      exerciseAttemptId: '123-456-789'
    });

    return window.ExerciseApi.exercise;
  }
</script>
```