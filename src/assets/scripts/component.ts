import {EventEmitter} from "events";
import {APP} from './scripts';

export interface Config {
    id: string
    type: string,
    element?: HTMLElement
}

export interface RefsArray extends Array<any> {
    first: Function
}

interface ComponentsArray extends Array<Component> {
    first: Function
}

export abstract class Component {
    public config: Config;

    private refs: RefsArray;

    static emitter: EventEmitter = new EventEmitter();
    /**
     * Generate Component ID (get from dataset or generate random)
     *
     * @returns {string}
     */
    static generateId (): string {
        return Math.floor((Math.random() * 100000)).toString();
    }

    /**
     * Get Component by own ID
     *
     * @param {string | number} id
     * @returns {{}}
     */
    static getById(id: string | number): Component {
        let component = <Component>{};
        if (APP.components) {
            APP.components.forEach(function (item) {
                if (item.config.id === id) {
                    component = item;
                }
            });
        } else {
            console.log('Component with ID: ' + id + ' doesn\'t exist');
        }
        return component;
    }

    static getByType(type: string): Array<Component> {
        let components = <ComponentsArray>[];
        if (APP.components) {
            APP.components.forEach(function (item) {
                if (item instanceof Component && item.config.type === type) {
                    components.push(item);
                }
            });
        } else {
            console.log('Component with type ' + type + ' doesn\'t exist');
        }
        components.first = (): any => {
            return components.length ? components[0] : null;
        };
        return components;
    }

    protected constructor (protected element?: HTMLElement, protected type?: string) {
        this.prepareConfigByElement(element, type);
        this.prepareRefs(element);

        if (element) {
            element['component-id'] = this.config.id;
        }
    }

    protected abstract onMounted (): void;

    protected abstract onUnmounted (): void;

    /**
     * Mount Component
     *
     */
    public mount (): void {
        this.onMounted();
    }

    /**
     * Unmount Component
     *
     */
    public unmount (): void {
        this.onUnmounted();
    }

    public getRefs (name: string): RefsArray {
        const elements = this.refs[name] || [];
        elements.first = (): any => {
            return elements.length ? elements[0] : null;
        };
        return elements;
    }

    /**
     * Create Component config by DOM element if exist
     *
     * @param {HTMLElement} element
     * @param type
     * @returns {{id: string; element: HTMLElement; type: string | null}}
     */
    private prepareConfigByElement (element?: HTMLElement, type?: string): void {
        const generatedId = Component.generateId();
        const generatedType = type || null;
        this.config = {
            id: element ? element.getAttribute('data-id') || generatedId : generatedId,
            type: element ? element.getAttribute('data-component') || generatedType : generatedType,
            element: element || null
        };
    }

    private prepareRefs (element?: HTMLElement): void {
        const refs = <RefsArray>[];
        if (element) {
            const refElements = <NodeList>element.querySelectorAll('[data-ref]');
            for (let i = 0; i < refElements.length; i++) {
                const refElement = <HTMLElement>refElements[i];
                const refName = refElement.getAttribute('data-ref');
                if (typeof refs[refName] === 'undefined') {
                    const refNameSelector = '[data-ref="' + refName + '"]';
                    refs[refName] = element.querySelectorAll(refNameSelector);
                }
            }
        }
        this.refs = refs;
    }

    /**
     * Get Component config object
     *
     * @returns {object}
     */
    get componentConfig () {
        return this.config;
    }
}