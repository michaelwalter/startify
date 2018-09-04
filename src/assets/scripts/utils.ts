import * as toastr from 'toastr';
import * as Cookies from 'js-cookie';

const ajax  = require('vendors/ajax');

export interface Offset {
    top: number,
    left: number
}

export class Utils {

    constructor() { }

    static offset (element: HTMLElement): Offset {
        let rect = {
            top: 0,
            left: 0
        };
        let scrollLeft = 0;
        let scrollTop = 0;
        if (element) {
            rect = element.getBoundingClientRect();
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        }
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    static fadeOut (element: any): void {
        element.style.opacity = 1;

        (function fade() {
            if ((element.style.opacity -= .1) < 0) {
                element.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    static fadeIn (element, display?: string): void {
        element.style.opacity = 0;
        element.style.display = display || "block";

        (function fade() {
            var val = parseFloat(element.style.opacity);
            if (!((val += .1) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };

    static ajax (config: object): void {
        ajax(config);
    }

    static makeCurrencyNumber (currency: string): string {
        return currency.replace(/ /g, '');
    }

    static isAnyPartOfElementInViewport (element: HTMLElement): Boolean {
        if (element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

            const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
            const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

            return (vertInView && horInView);
        } else {
            return false;
        }
    }

    static addEvent(element: any, type: string, handler: Function): void {
        if (element) {
            if (element.attachEvent){
                element.attachEvent('on'+type, handler);
            }
            else {
                element.addEventListener(type, handler, false);
            }
        }
    }

    static removeEvent(element: any, type: string, handler: Function): void {
        if (element) {
            if (element.detachEvent) {
                element.detachEvent('on'+type, handler);
            }
            else {
                element.removeEventListener(type, handler);
            }
        }
    }

    static addLiveEvent (selector: string, event: string, callback: Function, context?: HTMLElement): void {
        Utils.addEvent(context || document, event, function(e) {
            let qs = (context || document).querySelectorAll(selector);
            if (qs) {
                let el = e.target || e.srcElement, index = -1;
                while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                    el = el.parentElement;
                }
                if (index > -1) {
                    callback.call(undefined, e, el);
                }
            }
        });
    }

    static message(type: string, message: string): void {
        switch (type.toLowerCase()) {
            case 'error': {
                toastr.error(message);
                break;
            }
            case 'warning': {
                toastr.warning(message);
                break;
            }
            case 'success': {
                toastr.success(message);
                break;
            }
            case 'info': {
                toastr.info(message);
                break;
            }
            default: {
                toastr.info(message);
                break;
            }
        }
    }

    static readCookie (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static getCookie (name) {
        return Cookies.get(name);
    }

    static setCookie (name, value, config) {
        Cookies.set(name, value, config);
    }

    static deleteCookie(name) {
        Cookies.remove(name);
    }

    static copyToClipboard (element) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        Utils.message('success', 'Skopiowano');
        try {
            document.execCommand('copy');
            selection.removeAllRanges();
        } catch(e) {
            Utils.message('warning', 'Nie można było skopiować wskazanej wartości');
        }
    }

    static convertNumberToCurrency (convertedNumber: number, decimal: Boolean = false): any {
        const n = 2;
        const sectionsDelimeter = ' ';
        const decimalDelimeter = ',';
        const re = '\\d(?=(\\d{' + (3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
        let result = '';
        let num = convertedNumber.toFixed(Math.max(0, ~~n)).toString();

        if (decimal) {
            result = (decimalDelimeter ? num.replace('.', decimalDelimeter) : num).replace(new RegExp(re, 'g'), '$&' + (sectionsDelimeter || ','));
        } else {
            result = (decimalDelimeter ? num.replace('.', decimalDelimeter) : num).replace(new RegExp(re, 'g'), '$&' + (sectionsDelimeter || ','));
            result = result.substring(0, result.indexOf(decimalDelimeter));
        }
        return result;
    };

    static getWindowScrollOffset (): any {
        const doc = document.documentElement;
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        return {
            left: left,
            top: top
        }
    }

    static importStaticIdsFromData (idsFromData): Array<string> {
        const idsArray = [];
        if (idsFromData) {
            const parsedIds = JSON.parse(idsFromData);
            for (let i = 0; i < parsedIds.length; i++) {
                idsArray.push(parsedIds[i].toString());
            }
        }
        return idsArray;
    }
}