// crazy
export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, listener) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            listeners.add(listener);
        } else {
            this.events.set(eventName, new Set([listener]));
        }
    }

    emit(eventName, ...args) {
        const listeners = this.events.get(eventName);
        if (listeners) {
            listeners.forEach((listener) => {
                listener(...args);
            });
        }
    }

    once(eventName, listener) {
        const onceWrapper = (...args) => {
            this.removeListener(eventName, onceWrapper);
            listener(...args);
        };
        this.on(eventName, onceWrapper);
    }

    off(eventName, listenerToRemove) {
        const listeners = this.events.get(eventName);
        if (!listeners) {
            return;
        }

        listeners.delete(listenerToRemove);
        if (listeners.size === 0) {
            this.events.delete(eventName);
        }
    }
}