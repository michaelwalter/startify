import {Utils} from "./utils";
import {Component} from './component';

import {Example} from "./components/example/example";

const availableComponents = {
    example: Example
};

export class App {
    public components: Array<any>;
    private env: string;

    constructor (env?: string) {
        this.env = env || 'development';
        this.components = [];
    }

    public initialize () {
        this.getComponents();
        this.getAbstractComponents();
        this.initializeVendors();
        this.mountComponents();
    }

    /**
     * Get all components from loaded DOM trought selector [data-component]
     *
     */
    private getComponents (): void {
        const components = document.querySelectorAll('[data-component]');
        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            const componentName = component.getAttribute('data-component');
            if (availableComponents[componentName]) {
                this.components.push(new availableComponents[componentName](component))
            }
        }
    }

    private getAbstractComponents (): void {

    }

    /**
     * We mount components here but we have acces
     * to instances of all components now (getVisibleComponents)
     *
     */
    private mountComponents (): void {
        this.components.forEach((component: Component) => {
            if (component instanceof Component) {
                component.mount();
            }
        })
    }

    private unmountComponents (): void {
        this.components.forEach( (component: Component) => {
            if (component instanceof Component) {
                component.unmount();
            }
        });
        this.components.length = 0;
    }

    private initializeVendors (): void {

    }
}

export const APP = new App();

window.onload = function () {
    APP.initialize();
};