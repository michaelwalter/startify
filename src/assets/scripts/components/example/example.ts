import {Component} from "../../component";

export class Example extends Component {

    constructor (element) {
        super (element);
    }

    onMounted () {
        this.initialize();
    }

    onUnmounted () {

    }

    private initialize () {
        if (this.componentConfig.id !== "1") {
            const selectedComponent = Component.getById("1");
            setInterval(() => {
                // fetch('https://jsonplaceholder.typicode.com/todos/1')
                //     .then(response => response.json())
                //     .then(json => console.log(json))
                //     .catch(error => console.error('Error:', error));
            }, 3000);
        }
    }
}