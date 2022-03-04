// author: Programmer of exercise

class MyExcercise extends MapularyInterface {
    start() {
        console.log("Starting exercise "+this.data.title);
        this.display_message("Souštěno");
    }

    custom_setup() {
        // this.max_question = this.data.config.count_or_question -- Example how to get from params
        this.max_question = 10;
    }

    display_start() {
        super.display_start();
        // preapre default start page with description and button to start f.e.
        // button in header is possible to use as secondary
    }
}

