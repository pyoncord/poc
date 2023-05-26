import { observeObject } from "@utils";

const { RTNFileManager } = nativeModuleProxy;

type JSONSerializable = string | number | boolean | JSONSerializable[] | { [key: string]: JSONSerializable; };

type CastDown<T> =
    T extends number ? number :
    T extends string ? string :
    T extends boolean ? boolean :
    T extends object ? Record<string, any> :
    T;

type CastDownObject<T> = {
    [K in keyof T]?: T[K] extends object ? CastDownObject<T[K]> : CastDown<T[K]>;
};

/**
 * Awaits all current tasks
 */
export let _globalAwaiter = Promise.resolve();

/**
 * A wrapper to write to a file to the documents directory
 * @param path Path to the file
 * @param data String data to write to the file
 */
export async function writeFile(path: string, data: string, prefix = "pyoncord/"): Promise<void> {
    path = `${prefix}${path}`;
    return void await RTNFileManager.writeFile("documents", path, data, "utf8");
}

/**
 * A wrapper to read a file from the documents directory
 * @param path Path to the file
 * @param fallback Fallback data to return if the file doesn't exist, and will be written to the file
 */
export async function readFile(path: string, fallback: string, prefix = "pyoncord/"): Promise<string> {
    try {
        return await RTNFileManager.readFile(`${RTNFileManager.getConstants().DocumentsDirPath}/${prefix}${path}`, "utf8");
    } catch {
        writeFile(path, fallback);
        return fallback;
    }
}

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
        !path.endsWith(".json") && (path += ".json");
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
