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
        console.log('Initialize Example');
    }
}