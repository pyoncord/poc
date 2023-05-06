const factorySymbol = Symbol("lazyFactory");
const cacheSymbol = Symbol("lazyCache");

const unconfigurable = ["arguments", "caller", "prototype"];
const isUnconfigurable = (key: PropertyKey) => typeof key === "string" && unconfigurable.includes(key);

const lazyHandler: ProxyHandler<any> = {
    ...Object.fromEntries(Object.getOwnPropertyNames(Reflect).map(fnName => {
        return [fnName, (target: any, ...args: any[]) => {
            return Reflect[fnName](target[factorySymbol](), ...args);
        }];
    })),
    ownKeys: (target) => {
        const cacheKeys = Reflect.ownKeys(target[factorySymbol]());
        unconfigurable.forEach(key => isUnconfigurable(key) && cacheKeys.push(key));
        return cacheKeys;
    },
    getOwnPropertyDescriptor: (target, p) => {
        if (isUnconfigurable(p)) return Reflect.getOwnPropertyDescriptor(target, p);

        const descriptor = Reflect.getOwnPropertyDescriptor(target[factorySymbol](), p);
        if (descriptor) Object.defineProperty(target, p, descriptor);
        return descriptor;
    },
}

/**
 * Lazy proxy that will only call the factory function when needed (when a property is accessed)
 * @param factory Factory function to create the object
 * @param fallback A fallback value to return if the factory returns undefined
 * @returns A proxy that will call the factory function only when needed
 */
export default function proxyLazy<T>(factory: () => T): T {
    const dummy = function () { } as any;
    dummy[factorySymbol] = () => {
        return (dummy[cacheSymbol] ??= factory());
    };

    return new Proxy(dummy, lazyHandler) as any;
}