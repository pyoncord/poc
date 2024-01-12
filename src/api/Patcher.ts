// this is very horrid
import { after, before, instead } from "spitroast";

type Unpatcher = () => (void | boolean);
type NonPrimitive<T> = Exclude<T, boolean | number | bigint | string | symbol>;

type BeforeCallback = Parameters<typeof before>[2];
type AfterCallback = Parameters<typeof after>[2];
type InsteadCallback = Parameters<typeof instead>[2];

export const patchesInstances = new Map<string, Patcher>();

export default class Patcher {
    identifier: string;
    patches: Unpatcher[] = [];
    stopped = false;

    constructor(identifier: string) {
        if (!identifier || typeof identifier !== "string") {
            throw new Error("Patcher identifier must be a non-empty string");
        }

        if (patchesInstances.has(identifier)) {
            throw new Error(`Patcher with identifier "${identifier}" already exists`);
        }

        this.identifier = identifier;
        patchesInstances.set(identifier, this);
    }

    before = <T>(parent: NonPrimitive<T>, method: string, patch: BeforeCallback) => this.addUnpatcher(before(method, parent, patch));
    after = <T>(parent: NonPrimitive<T>, method: string, patch: AfterCallback) => this.addUnpatcher(after(method, parent, patch));
    instead = <T>(parent: NonPrimitive<T>, method: string, patch: InsteadCallback) => this.addUnpatcher(instead(method, parent, patch));

    // private waitAndPatch<P extends "before" | "after" | "instead">(
    //     patchType: P,
    //     filter: FilterFn,
    //     method: string,
    //     patch: Parameters<typeof Patcher.prototype[typeof patchType]>[2],
    // ) {
    //     let unpatch: Unpatcher;
    //     const unwaiter = waitForModule(filter, module => {
    //         if (this.stopped) return false;
    //         unpatch = this[patchType](module, method, <any>patch);
    //     });

    //     return () => (this.addUnpatcher(unwaiter), unpatch());
    // }

    // patch = (filter: FilterFn) => ({
    //     before: (method: string, patch: BeforeCallback) => this.waitAndPatch("before", filter, method, patch),
    //     after: (method: string, patch: AfterCallback) => this.waitAndPatch("after", filter, method, patch),
    //     instead: (method: string, patch: InsteadCallback) => this.waitAndPatch("instead", filter, method, patch),
    // });

    addUnpatcher = (callback: Unpatcher) => {
        if (this.stopped) return () => false;
        if (typeof callback !== "function") {
            throw new Error("Unpatcher must be a function");
        }

        this.patches.push(callback);
        return callback;
    };

    unpatchAllAndStop() {
        let success = true;
        this.stopped = true;

        for (const unpatch of this.patches) {
            try {
                if (unpatch?.() === false) throw void 0;
            } catch {
                success = false;
            }
        }

        patchesInstances.delete(this.identifier);
        return success;
    }
}
