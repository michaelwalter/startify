import {Component} from "../../component";

export class Example2 extends Component {
    constructor (element) {
        super(element);
    }

    protected onMounted(): void {
        this.initialize();
    }

    protected onUnmounted(): void {

    }

    initialize () {
        setInterval(() => {
            Component.emitter.emit("updateExample", Math.random());
        }, 1000)
    }
}
