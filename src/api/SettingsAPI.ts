import { readFile, writeFile } from "@native";
import { observeObject } from "@utils";

type JSONSerializable = string | number | boolean | JSONSerializable[] | { [key: string]: JSONSerializable; };

type CastDown<T> =
    T extends number ? number :
    T extends string ? string :
    T extends boolean ? boolean :
    T extends object ? CastDownObject<T> :
    T;

type CastDownObject<T> = {
    [K in keyof T]?: T[K] extends object ? CastDownObject<T[K]> : CastDown<T[K]>;
};

/**
 * Awaits all current tasks
 */
export let _globalAwaiter = Promise.resolve();

// TODO: Make faster
export default class SettingsAPI<T extends JSONSerializable = JSONSerializable> {
    private _cachedProxy: T | null = null;
    private readonly _readAwaiter;
    private readonly callbacks = new Set<(snapshot: T) => void>();
    private snapshot!: T;

    constructor(
        public readonly path: string,
        public readonly defaultData: CastDownObject<T> = {}
    ) {
        this._readAwaiter = this.init();
    }

    init = async (): Promise<this> => {
        if (this._readAwaiter) return this._readAwaiter;

        this.snapshot = JSON.parse(await readFile(this.path, JSON.stringify(this.defaultData)));
        return this;
    };

    subscribe = (callback: (snapshot: T) => void) => {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    };

    useStorage = () => {
        const forceUpdate = React.useReducer(n => ~n, 0)[1];

        React.useEffect(() => {
            const unsub = this.subscribe(forceUpdate);
            return () => void unsub();
        }, []);

        return this.proxy;
    };

    get proxy() {
        if (!this.snapshot) throw new Error("StorageWrapper not initialized");

        return this._cachedProxy ??= observeObject(this.snapshot, async obj => {
            this.callbacks.forEach(cb => cb(this.snapshot));

            const writeTask = writeFile(this.path, JSON.stringify(obj));
            _globalAwaiter = _globalAwaiter.then(() => writeTask);
        });
    }
}
