export default function observeObject(obj: any, callback: (obj: any) => void) {
    const handler = {
        get(target: any, key: string): any {
            const value = target[key];

            if (typeof value === "object") {
                return observeObject(value, callback);
            }

            return value;
        },
        set(target: any, key: string, value: any) {
            target[key] = value;

            callback(target);
            return true;
        },
        deleteProperty(target: any, key: string) {
            delete target[key];
            callback(target);
            return true;
        }
    };

    return new Proxy(obj, handler);
}
