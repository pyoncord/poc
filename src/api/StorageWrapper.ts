import ObservableSlim from "observable-slim";

const { RTNFileManager } = nativeModuleProxy;

type JSONSerializable = string | number | boolean | JSONSerializable[] | { [key: string]: JSONSerializable; };

/**
 * Awaits all current tasks
 */
export let _globalAwaiter = Promise.resolve();

/**
 * A wrapper to write to a file to the documents directory
 * @param path Path to the file
 * @param data String data to write to the file
 */
export async function writeFile(path: string, data: string): Promise<void> {
    if (ReactNative.Platform.OS === "ios" && !RTNFileManager.saveFileToGallery) path = `Documents/${path}`;
    return void await RTNFileManager.writeFile("documents", path, data, "utf8");
}

/**
 * A wrapper to read a file from the documents directory
 * @param path Path to the file
 * @param fallback Fallback data to return if the file doesn't exist, and will be written to the file
 */
export async function readFile(path: string, fallback: string): Promise<string> {
    const readPath = `${RTNFileManager.getConstants().DocumentsDirPath}/${path}`;

    try {
        return await RTNFileManager.readFile(readPath, "utf8");
    } catch {
        writeFile(path, fallback);
        return fallback;
    }
}

// TODO: Make faster
export default class StorageWrapper<T extends JSONSerializable = Record<string, any>> {
    private _cachedProxy: T | null = null;
    private readonly _initAwaiter;
    private readonly callbacks = new Set<(snapshot: T) => void>();

    readonly path: string;
    readonly snapshot = {} as T;

    constructor(path: string) {
        this.path = `pyoncord/${path}`;
        this._initAwaiter = this.begin();
    }

    private async begin() {
        const data = await readFile(this.path, "{}");
        Object.assign(this.snapshot, JSON.parse(data));
    }

    subscribe = (callback: (snapshot: T) => void) => {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    };

    useStorage() {
        const forceUpdate = React.useReducer(n => ~n, 0)[1];

        React.useEffect(() => {
            const unsub = this.subscribe(forceUpdate);
            return () => void unsub();
        }, []);

        return this.getProxy();
    }

    getProxy = () => this._cachedProxy ??= ObservableSlim.create(this.snapshot, true, changes => {
        changes.forEach(async () => {
            await this._initAwaiter;
            this.callbacks.forEach(cb => cb(this.snapshot));

            const task = writeFile(this.path, JSON.stringify(this.snapshot));
            _globalAwaiter = _globalAwaiter.then(() => task);
        });
    }) as unknown as T;

    awaitAndGetProxy = async () => {
        await this._initAwaiter;
        return this.getProxy();
    };
}

export { ObservableSlim };
