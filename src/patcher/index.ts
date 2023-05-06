import { before, after, instead } from "spitroast";

type Unpatcher = ReturnType<typeof before> | ReturnType<typeof after> | ReturnType<typeof instead>;

type BeforeCallback = Parameters<typeof before>[2];
type AfterCallback = Parameters<typeof after>[2];
type InsteadCallback = Parameters<typeof instead>[2];

export const patchesInstances = new Map<string, Patcher>();

export default class Patcher {
    identifier: string;
    patches: Unpatcher[] = [];
    onUnpatch: (() => void)[] = [];

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
        const unpatch = before(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    after = (parent: any, method: string, patch: AfterCallback) => {
        const unpatch = after(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    instead = (parent: any, method: string, patch: InsteadCallback) => {
        const unpatch = instead(method, parent, patch);
        this.patches.push(unpatch);
        return unpatch;
    }

    unpatch = () => {
        let success = true;

        for (const patch of this.patches) {
            success = patch() && success;
        }

        for (const callback of this.onUnpatch) {
            try {
                callback();
            } catch (err) {
                success = false;
            }
        }

        return success;
    }

    registerOnUnpatched = (callback: () => void) => {
        this.onUnpatch.push(callback);
    }
}