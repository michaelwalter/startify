import * as Toastr from "toastr";
import * as Cookies from "js-cookie";
interface Offset {
    top: number,
    left: number
}

export namespace Utils {
    export function offset (element: HTMLElement): Offset {
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

    export function fadeOut (element: any): void {
        element.style.opacity = 1;

        (function fade() {
            if ((element.style.opacity -= .1) < 0) {
                element.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    export function fadeIn (element, display?: string): void {
        element.style.opacity = 0;
        element.style.display = display || "block";

        (function fade() {
            var val = parseFloat(element.style.opacity);
            if (!((val += .1) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    export function isAnyPartOfElementInViewport (element: HTMLElement): Boolean {
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

    export function addEvent(element: any, type: string, handler: Function): void {
        if (element) {
            if (element.attachEvent){
                element.attachEvent("on"+type, handler);
            }
            else {
                element.addEventListener(type, handler, false);
            }
        }
    }

    export function removeEvent(element: any, type: string, handler: Function): void {
        if (element) {
            if (element.detachEvent) {
                element.detachEvent("on"+type, handler);
            }
            else {
                element.removeEventListener(type, handler);
            }
        }
    }

    export function addLiveEvent (selector: string, event: string, callback: Function, context?: HTMLElement): void {
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

    export function message(type: string, message: string): void {
        switch (type.toLowerCase()) {
            case "error": {
                Toastr.error(message);
                break;
            }
            case "warning": {
                Toastr.warning(message);
                break;
            }
            case "success": {
                Toastr.success(message);
                break;
            }
            case "info": {
                Toastr.info(message);
                break;
            }
            default: {
                Toastr.info(message);
                break;
            }
        }
    }

    export function readCookie (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    export function getCookie (name) {
        return Cookies.get(name);
    }

    export function setCookie (name, value, config) {
        Cookies.set(name, value, config);
    }

    export function deleteCookie(name) {
        Cookies.remove(name);
    }

    export function copyToClipboard (element) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        Utils.message("success", "Skopiowano");
        try {
            document.execCommand("copy");
            selection.removeAllRanges();
        } catch(e) {
            Utils.message("warning", "Nie można było skopiować wskazanej wartości");
        }
    }

    export function getWindowScrollOffset (): any {
        const doc = document.documentElement;
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        return {
            left: left,
            top: top
        }
    }
}