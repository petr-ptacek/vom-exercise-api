// author: Mapulary

const title_container = "exercise_header";
const main_container = "exercise_main";

class ExerciseData {
    constructor (exercise_id) {
        // load from server
        this.exercise_id = exercise_id;
        this.title = null;
        this.description = null;
        this.maps = {}
        this.config = {}
        this.time_limit = null
        // others property from definitions

        this.load_from_server()
    }

    load_from_server() {
        // Load from server based exercise_id
        console.log("Loading data from server excercise "+this.exercise_id);

        this.title = "Titulek konkrétního cvičení uživatele";
        this.description = "Objeví se Vám postupně obrázky s nápovědou ve vašem jazyce. Bude třeba, abyste ...";
        // this.maps = ?
        // this.time_limit = ?
        // ...
    }

    // return details about map
    get_map_details(map_uid) {
        console.log("Loading data from server for map"+map_uid);
        return {"translates": {}, "tags": {}}
    }

    // Get translate details
    get_translate_detail(translate_uid) {
        console.log("Loading data from server for translate "+translate_uid);
        return {"translates": {}, "tags": {}}
    }

    // others methods cards, pictures etc.
    // ...
}

//
class MapularyInterface {
    constructor (exercise_id) {
        this.initialized = false;
        this.data = null;
        this.max_question = null;
        this.load_data(exercise_id);
        if (!this.check_definition()) {
            throw new Error('Excersise is not possible to run');
        }
        this.display_start();
        this.initialized = true;
    }

    // Check of definition
    check_definition() {
        // Check from Marek
        console.log("Checking definition on the server "+this.data.exercise_id);
        // Check locally
        return this.check_local_definition()
    }

    // for overload by programmer
    check_local_definition() {
        console.log("Checking local definition withou Marek "+this.data.exercise_id);
        if (!this.max_question) {
            console.log("Property max_question is not setup");
            return  false;
        }
        // Checking f.e. config context etc.
        return true;
    }

    load_data(exercise_id) {
        this.data = new ExerciseData(exercise_id);
        this.custom_setup();
    }

    // abstract methof for ovewriting by "exercise programmer"
    custom_setup() {
        throw new Error('Invalid custom_setup. Max_questions is need to setup at least.');
    }

    // possible to overwrite
    display_start() {
        this.change_exercise_title(this.data.title);
        console.log("Prepared to start "+this.data.exercise_id);
    }

    // abstract method
    start() {
        throw new Error('Invalid definitions of start.');
    }

    // --------------------  method for interactions with environment, buttons, timer, messages etc...
    // ...
    // example
    change_exercise_title(title) {
        // changed of title
    }

    display_message(message) {
        // creating mapulary message. I used alert for simplicity.
        alert(message);
    }
}