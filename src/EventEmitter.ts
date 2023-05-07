// crazy
export default class EventEmitter {
    events = new Map<string, Set<Function>>();

    on(eventName: string, listener: Function) {
        if (!this.events.get(eventName)?.add(listener)) {
            this.events.set(eventName, new Set([listener]));
        }
    }

    emit(eventName: string, ...args: any[]) {
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
