import {Component} from "../../component";
import {Utils} from "../../utils";

export class Example extends Component {
    private counterElement: HTMLElement;

    constructor (element) {
        super (element);
    }

    onMounted () {
        this.initialize();
        this.initializeEvents();
    }

    onUnmounted () {

    }

    private initialize () {
        this.counterElement = this.getRefs('counter').first();
        console.log(this.counterElement);
        // if (this.componentConfig.id !== "1") {
        //     const selectedComponent = Component.getById("1");
        //     setInterval(() => {
        //         const randomPictureId = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        //         fetch('https://jsonplaceholder.typicode.com/photos/' + randomPictureId)
        //             .then(response => response.json())
        //             .then(json => {
        //                 selectedComponent.config.element.innerHTML = `<img src="${json.url}" alt="${json.title}" width="200" />`;
        //             })
        //             .catch(error => console.error('Error:', error));
        //     }, 3000);
        // }
    }

    private initializeEvents () {
        Component.emitter.on('updateExample', (counter) => {
            Utils.message('warning', counter);
        });
    }
}
