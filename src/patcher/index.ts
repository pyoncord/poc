import { before, after, instead } from "spitroast";

type Unpatcher = ReturnType<typeof before> | ReturnType<typeof after> | ReturnType<typeof instead>;

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

    before = (parent: any, method: string, patch: BeforeCallback) => {
        if (this.stopped) return () => false;

        const unpatch = before(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    after = (parent: any, method: string, patch: AfterCallback) => {
        if (this.stopped) return () => false;

        const unpatch = after(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    instead = (parent: any, method: string, patch: InsteadCallback) => {
        if (this.stopped) return () => false;

        const unpatch = instead(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    unpatchAllAndStop = () => {
        let success = true;
        this.stopped = true;

        for (const unpatch of this.patches) {
            try {
                success = unpatch?.() && success;
            } catch {
                success = false;
            }
        }

        patchesInstances.delete(this.identifier);
        return success;
    }

    addUnpatcher = (callback: () => void) => {
        if (typeof callback !== "function") {
            throw new Error("Unpatcher must be a function");
        }

        this.patches.push(callback as () => boolean);
    }
}