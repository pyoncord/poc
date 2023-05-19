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
    if (!await RTNFileManager.fileExists(path)) {
        writeFile(path, fallback);
        return fallback;
    }

    return await RTNFileManager.readFile(path, "utf8");
}

export default class StorageWrapper<T extends JSONSerializable = Record<string, any>> {
    readonly path: string;
    readonly snapshot = {} as T;
    readonly _initAwaiter;

    constructor(path: string) {
        this.path = `pyoncord/${path}`;
        this._initAwaiter = this.begin();
    }

    private begin = async () => {
        const data = await readFile(this.path, "{}");
        Object.assign(this.snapshot, JSON.parse(data));
    };

    getProxy = () => <T><unknown>ObservableSlim.create(this.snapshot, true, changes => {
        changes.forEach(async change => {
            Object.assign(this.snapshot, change.target);

            await this._initAwaiter;
            const task = writeFile(this.path, JSON.stringify(this.snapshot));
            _globalAwaiter = _globalAwaiter.then(() => task);
        });
    });
}

export { ObservableSlim };
