// crazy
export default class EventEmitter {
    events = new Map();

    on(eventName: string, listener: Function) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).add(listener);
        } else {
            this.events.set(eventName, new Set([listener]));
        }
    }

    emit(eventName: string, ...args: Function[]) {
        const listeners = this.events.get(eventName);
        if (listeners) {
            listeners.forEach((listener: Function) => {
                listener(...args);
            });
        }
    }

    off(eventName: string, listenerToRemove: Function) {
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