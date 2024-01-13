globalThis.__PYON_MODULE_DEFINITIONS_HASH__='f9e59ef92560efbe30b6ae4f6d631f27aaeb223641c0abc2a8a55ebef85503ac';
(async function(){var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/shared.js
var patchTypes, patchedObjects;
var init_shared = __esm({
  "node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/shared.js"() {
    patchTypes = [
      "a",
      "b",
      "i"
    ];
    patchedObjects = /* @__PURE__ */ new Map();
  }
});

// node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/hook.js
function hook_default(funcName, funcParent, funcArgs, ctxt, isConstruct) {
  const patch = patchedObjects.get(funcParent)?.[funcName];
  if (!patch)
    return isConstruct ? Reflect.construct(funcParent[funcName], funcArgs, ctxt) : funcParent[funcName].apply(ctxt, funcArgs);
  for (const hook of patch.b.values()) {
    const maybefuncArgs = hook.call(ctxt, funcArgs);
    if (Array.isArray(maybefuncArgs))
      funcArgs = maybefuncArgs;
  }
  let workingRetVal = [
    ...patch.i.values()
  ].reduce(
    function(prev, current) {
      return function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return current.call(ctxt, args, prev);
      };
    },
    // This calls the original function
    function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return isConstruct ? Reflect.construct(patch.o, args, ctxt) : patch.o.apply(ctxt, args);
    }
  )(...funcArgs);
  for (const hook of patch.a.values())
    workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
  return workingRetVal;
}
var init_hook = __esm({
  "node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/hook.js"() {
    init_shared();
    __name(hook_default, "default");
  }
});

// node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/unpatch.js
function unpatch(funcParent, funcName, hookId, type) {
  const patchedObject = patchedObjects.get(funcParent);
  const patch = patchedObject?.[funcName];
  if (!patch?.[type].has(hookId))
    return false;
  patch[type].delete(hookId);
  if (patchTypes.every(function(t) {
    return patch[t].size === 0;
  })) {
    const success = Reflect.defineProperty(funcParent, funcName, {
      value: patch.o,
      writable: true,
      configurable: true
    });
    if (!success)
      funcParent[funcName] = patch.o;
    delete patchedObject[funcName];
  }
  if (Object.keys(patchedObject).length == 0)
    patchedObjects.delete(funcParent);
  return true;
}
var init_unpatch = __esm({
  "node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/unpatch.js"() {
    init_shared();
    __name(unpatch, "unpatch");
  }
});

// node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/getPatchFunc.js
function getPatchFunc_default(patchType) {
  return function(funcName, funcParent, callback) {
    let oneTime = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    if (typeof funcParent[funcName] !== "function")
      throw new Error(`${funcName} is not a function in ${funcParent.constructor.name}`);
    if (!patchedObjects.has(funcParent))
      patchedObjects.set(funcParent, {});
    const parentInjections = patchedObjects.get(funcParent);
    if (!parentInjections[funcName]) {
      const origFunc = funcParent[funcName];
      parentInjections[funcName] = {
        o: origFunc,
        b: /* @__PURE__ */ new Map(),
        i: /* @__PURE__ */ new Map(),
        a: /* @__PURE__ */ new Map()
      };
      const runHook = /* @__PURE__ */ __name(function(ctxt, args, construct) {
        const ret = hook_default(funcName, funcParent, args, ctxt, construct);
        if (oneTime)
          unpatchThisPatch();
        return ret;
      }, "runHook");
      const replaceProxy = new Proxy(origFunc, {
        apply: function(_, ctxt, args) {
          return runHook(ctxt, args, false);
        },
        construct: function(_, args) {
          return runHook(origFunc, args, true);
        },
        get: function(target, prop, receiver) {
          return prop == "toString" ? origFunc.toString.bind(origFunc) : Reflect.get(target, prop, receiver);
        }
      });
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: replaceProxy,
        configurable: true,
        writable: true
      });
      if (!success)
        funcParent[funcName] = replaceProxy;
    }
    const hookId = Symbol();
    const unpatchThisPatch = /* @__PURE__ */ __name(function() {
      return unpatch(funcParent, funcName, hookId, patchType);
    }, "unpatchThisPatch");
    parentInjections[funcName][patchType].set(hookId, callback);
    return unpatchThisPatch;
  };
}
var init_getPatchFunc = __esm({
  "node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/getPatchFunc.js"() {
    init_hook();
    init_shared();
    init_unpatch();
    __name(getPatchFunc_default, "default");
  }
});

// node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/index.js
var before, instead, after;
var init_esm = __esm({
  "node_modules/.pnpm/spitroast@1.4.3/node_modules/spitroast/dist/esm/index.js"() {
    init_getPatchFunc();
    init_unpatch();
    before = getPatchFunc_default("b");
    instead = getPatchFunc_default("i");
    after = getPatchFunc_default("a");
  }
});

// internal-metro/index.ts
function isInvalidExport(exports) {
  return exports == null || exports === globalThis || typeof exports === "boolean" || typeof exports === "number" || typeof exports === "string" || exports["whar???"] === null;
}
function blacklist(id) {
  Object.defineProperty(modules, id, {
    value: modules[id],
    enumerable: false,
    configurable: true,
    writable: true
  });
}
function waitForModuleWithProp(prop, callback) {
  const find = findInitializedModule(filters.byProps(prop));
  if (find !== -1)
    return callback(globalThis.__r(find)), function() {
    };
  const matches = /* @__PURE__ */ __name(function(exports) {
    if (exports.default && exports.__esModule && filters.byProps(prop)(exports.default)) {
      factoryCallbacks.delete(matches);
      callback(exports.default);
    }
    if (filters.byProps(prop)(exports)) {
      factoryCallbacks.delete(matches);
      callback(exports);
    }
  }, "matches");
  factoryCallbacks.add(matches);
  return function() {
    return factoryCallbacks.delete(matches);
  };
}
function* getInitializedModules() {
  for (const id in modules) {
    if (modules[id].isInitialized) {
      if (isInvalidExport(modules[id].publicModule.exports)) {
        blacklist(id);
        continue;
      }
      yield {
        id: Number(id),
        ...modules[id].publicModule
      };
    }
  }
}
function findInitializedModule(filter) {
  for (const { exports, id } of getInitializedModules()) {
    if (exports?.default && filter(exports.default) || filter(exports)) {
      return id;
    }
  }
  return -1;
}
function findByProps() {
  for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }
  return findInitializedModule(filters.byProps(...props));
}
function findByName(name) {
  return findInitializedModule(filters.byName(name));
}
function findByDisplayName(displayName) {
  return findInitializedModule(filters.byDisplayName(displayName));
}
function findByStoreName(storeName) {
  return findInitializedModule(filters.byStoreName(storeName));
}
var factoryCallbacks, _resolveReady, onceReady, filters, _importingModuleId;
var init_internal_metro = __esm({
  "internal-metro/index.ts"() {
    "use strict";
    init_esm();
    factoryCallbacks = /* @__PURE__ */ new Set();
    onceReady = new Promise(function(resolve) {
      return _resolveReady = resolve;
    });
    __name(isInvalidExport, "isInvalidExport");
    __name(blacklist, "blacklist");
    __name(waitForModuleWithProp, "waitForModuleWithProp");
    filters = {
      byProps: function() {
        for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
          props[_key] = arguments[_key];
        }
        return function(exp) {
          return props.length === 1 ? exp[props[0]] != null : props.every(function(prop) {
            return exp?.[prop] != null;
          });
        };
      },
      byName: function(name) {
        let deExp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function(exp) {
          return (deExp ? exp.name : exp.default?.name) === name;
        };
      },
      byDisplayName: function(displayName) {
        let deExp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function(exp) {
          return (deExp ? exp.displayName : exp.default?.displayName) === displayName;
        };
      },
      byStoreName: function(storeName) {
        let deExp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return function(exp) {
          return exp._dispatcher && (deExp ? exp : exp.default)?.getName?.() === storeName;
        };
      }
    };
    _importingModuleId = -1;
    Object.keys(modules).forEach(function(id) {
      if (modules[id].factory) {
        instead("factory", modules[id], function(args, orig) {
          _importingModuleId = Number(id);
          orig(...args);
          const { 5: exports } = args;
          if (!isInvalidExport(exports)) {
            factoryCallbacks.forEach(function(cb) {
              return cb(exports);
            });
          }
          _importingModuleId = -1;
        }, true);
      }
    });
    waitForModuleWithProp("fileFinishedImporting", function(importTracker) {
      before("fileFinishedImporting", importTracker, function(param) {
        let [location] = param;
        if (_importingModuleId === -1)
          return;
        modules[_importingModuleId].location = location;
      });
    });
    waitForModuleWithProp("_actionHandlers", function(FluxDispatcher2) {
      const cb = /* @__PURE__ */ __name(function() {
        _resolveReady();
        FluxDispatcher2.unsubscribe("CONNECTION_OPEN", cb);
      }, "cb");
      FluxDispatcher2.subscribe("CONNECTION_OPEN", cb);
    });
    __name(getInitializedModules, "getInitializedModules");
    __name(findInitializedModule, "findInitializedModule");
    __name(findByProps, "findByProps");
    __name(findByName, "findByName");
    __name(findByDisplayName, "findByDisplayName");
    __name(findByStoreName, "findByStoreName");
  }
});

// internal-metro/requireDef.ts
function requireDef_default() {
  return {
    "react": findByProps("createElement"),
    "react-native": findByProps("PlatformColor"),
    "AssetManager": findByProps("getAssetByID"),
    "I18n": findByProps("Messages"),
    "Tables": findByProps("TableRow"),
    "NavigationNative": findByProps("NavigationContainer"),
    "Colors": findByProps("unsafe_rawColors"),
    "Constants": findByProps("NODE_SIZE"),
    "FluxDispatcher": findByProps("dispatch", "subscribe"),
    "TabsNavigationRef": findByProps("getRootNavigationRef"),
    "SettingConstants": findByProps("SETTING_RENDERER_CONFIG")
    //
  };
}
var init_requireDef = __esm({
  "internal-metro/requireDef.ts"() {
    "use strict";
    init_internal_metro();
    __name(requireDef_default, "default");
  }
});

// internal-metro/cacher.ts
var cacher_exports = {};
__export(cacher_exports, {
  default: () => cacher_default
});
async function getItem() {
  const raw = await MMKVManager.getItem("pyon-cache");
  if (raw == null)
    return;
  return JSON.parse(raw);
}
async function updateItemAndRestart(value) {
  let key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "pyon-cache";
  MMKVManager.removeItem(key);
  MMKVManager.setItem(key, JSON.stringify(value));
  await MMKVManager.getItem(key);
  window2.nativeModuleProxy.BundleUpdaterManager.reload();
}
async function beginCache() {
  console.log(`Cache invalidated, begining cache for version=${currentVersion}, hash=${__PYON_MODULE_DEFINITIONS_HASH__}`);
  const cache = {
    version: currentVersion,
    hash: __PYON_MODULE_DEFINITIONS_HASH__,
    stats: {
      skippedModuleIds: new Array(),
      logs: new Array()
    },
    modules: {},
    assets: {}
  };
  const log = /* @__PURE__ */ __name(function(w) {
    console.log(w);
    cache.stats.logs.push(w);
  }, "log");
  const AssetManager2 = globalThis.__r(findInitializedModule(function(m) {
    return m.registerAsset;
  }));
  before("registerAsset", AssetManager2, function(param) {
    let [asset] = param;
    cache.assets[asset.name] = asset;
  });
  for (const key in window2.modules) {
    const exports = function() {
      try {
        return window2.__r(key);
      } catch (e) {
        cache.stats.skippedModuleIds.push(Number(key));
      }
    }();
    if (exports?.default && exports.default._dispatcher && typeof exports.default.getName === "function") {
      cache.modules[exports.default.getName()] = Number(key);
    }
    if (window2.modules[key]?.location) {
      cache.modules[window2.modules[key].location] = Number(key);
    }
  }
  const requireDefinition = requireDef_default();
  for (const key in requireDefinition) {
    if (cache.modules[key] != null) {
      log(`Manual require definition of ('${key}') conflicts with internal cacher, skipping..`);
      continue;
    }
    const id = requireDefinition[key];
    if (id === -1) {
      cache.modules[key] = -1;
      log(`Failed to execute find of '${key}'`);
      continue;
    }
    cache.modules[key] = id;
    if (window2.modules[id].location) {
      cache.modules[window2.modules[id].location] = id;
      log(`Module '${key}' (${id}) can be located with path '${window2.modules[id].location}'`);
    }
  }
  await updateItemAndRestart(cache);
}
function isCacheInvalidated(cache) {
  if (cache.version !== currentVersion)
    return true;
  if (cache.hash !== __PYON_MODULE_DEFINITIONS_HASH__)
    return true;
}
async function cacher_default() {
  const cached = await getItem();
  if (cached && !isCacheInvalidated(cached)) {
    window2.pyonRequire = /* @__PURE__ */ __name(function pyonRequire2(id) {
      return cached.modules[id];
    }, "pyonRequire");
    return Object.assign(window2.pyonRequire, {
      _getCache: function() {
        return cached;
      },
      requireAsset: function(assetId) {
        return cached.assets[assetId];
      }
    });
  }
  window2.ErrorUtils = void 0;
  window2.__startDiscord?.();
  await beginCache().then(console.error);
  await new Promise(function() {
    return void 0;
  });
}
var MMKVManager, currentVersion, window2;
var init_cacher = __esm({
  "internal-metro/cacher.ts"() {
    "use strict";
    init_esm();
    init_internal_metro();
    init_requireDef();
    MMKVManager = nativeModuleProxy.MMKVManager;
    currentVersion = nativeModuleProxy.RTNClientInfoManager.Build;
    window2 = globalThis;
    __name(getItem, "getItem");
    __name(updateItemAndRestart, "updateItemAndRestart");
    __name(beginCache, "beginCache");
    __name(isCacheInvalidated, "isCacheInvalidated");
    __name(cacher_default, "default");
  }
});

// src/utils/proxyLazy.ts
function proxyLazy(factory) {
  const dummy = /* @__PURE__ */ __name(function() {
    return void 0;
  }, "dummy");
  dummy[factorySymbol] = function() {
    return dummy[cacheSymbol] ??= factory();
  };
  return new Proxy(dummy, lazyHandler);
}
var factorySymbol, cacheSymbol, unconfigurable, isUnconfigurable, lazyHandler;
var init_proxyLazy = __esm({
  "src/utils/proxyLazy.ts"() {
    "use strict";
    factorySymbol = Symbol("lazyFactory");
    cacheSymbol = Symbol("lazyCache");
    unconfigurable = [
      "arguments",
      "caller",
      "prototype"
    ];
    isUnconfigurable = /* @__PURE__ */ __name(function(key) {
      return typeof key === "string" && unconfigurable.includes(key);
    }, "isUnconfigurable");
    lazyHandler = {
      ...Object.fromEntries(Object.getOwnPropertyNames(Reflect).map(function(fnName) {
        return [
          fnName,
          function(target) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return Reflect[fnName](target[factorySymbol](), ...args);
          }
        ];
      })),
      ownKeys: function(target) {
        const cacheKeys = Reflect.ownKeys(target[factorySymbol]());
        unconfigurable.forEach(function(key) {
          return isUnconfigurable(key) && cacheKeys.push(key);
        });
        return cacheKeys;
      },
      getOwnPropertyDescriptor: function(target, p) {
        if (isUnconfigurable(p))
          return Reflect.getOwnPropertyDescriptor(target, p);
        const descriptor = Reflect.getOwnPropertyDescriptor(target[factorySymbol](), p);
        if (descriptor)
          Object.defineProperty(target, p, descriptor);
        return descriptor;
      }
    };
    __name(proxyLazy, "proxyLazy");
  }
});

// src/metro/common.ts
var AssetManager, I18n, Forms, Tables, NavigationNative, Colors, Constants, FluxDispatcher, TabsNavigationRef;
var init_common = __esm({
  "src/metro/common.ts"() {
    "use strict";
    init_metro();
    AssetManager = requireMetroLazy("AssetManager");
    I18n = requireMetroDefaultLazy("I18n");
    Forms = requireMetroLazy("uikit-native/refresh/form/index.tsx");
    Tables = requireMetroLazy("Tables");
    NavigationNative = requireMetroLazy("NavigationNative");
    Colors = requireMetroDefaultLazy("Colors");
    Constants = requireMetroLazy("Constants");
    FluxDispatcher = requireMetroDefaultLazy("FluxDispatcher");
    TabsNavigationRef = requireMetroLazy("TabsNavigationRef");
  }
});

// src/metro/index.ts
var metro_exports = {};
__export(metro_exports, {
  AssetManager: () => AssetManager,
  Colors: () => Colors,
  Constants: () => Constants,
  FluxDispatcher: () => FluxDispatcher,
  Forms: () => Forms,
  I18n: () => I18n,
  NavigationNative: () => NavigationNative,
  Tables: () => Tables,
  TabsNavigationRef: () => TabsNavigationRef,
  _resolveReady: () => _resolveReady,
  canRequire: () => canRequire,
  factoryCallbacks: () => factoryCallbacks,
  filters: () => filters,
  findByDisplayName: () => findByDisplayName,
  findByName: () => findByName,
  findByProps: () => findByProps,
  findByStoreName: () => findByStoreName,
  findInitializedModule: () => findInitializedModule,
  getInitializedModules: () => getInitializedModules,
  onceReady: () => onceReady,
  requireMetro: () => requireMetro,
  requireMetroDefaultLazy: () => requireMetroDefaultLazy,
  requireMetroLazy: () => requireMetroLazy,
  waitForModule: () => waitForModule
});
function canRequire(name) {
  return pyonRequire(name) != null && pyonRequire(name) !== -1;
}
function requireMetro(name) {
  if (!canRequire(name))
    throw new Error(`Module with name '${name}' was not found/cached`);
  const id = pyonRequire(name);
  return globalThis.__r(id);
}
function requireMetroLazy(name, resolver) {
  if (!canRequire(name))
    throw new Error(`Module with name '${name}' was not found/cached`);
  return proxyLazy(function() {
    return resolver ? resolver(requireMetro(name)) : requireMetro(name);
  });
}
function requireMetroDefaultLazy(name) {
  return requireMetroLazy(name, function(m) {
    return m.default;
  });
}
function waitForModule(name, callback) {
  const id = pyonRequire(name);
  if (!id || id === -1) {
    throw new Error(`Module '${name}' was ${id ? "not found" : "not cached"}`);
  }
  const module = modules[id];
  if (module.isInitialized) {
    callback(module.publicModule.exports, module, id);
    return function() {
      return void 0;
    };
  } else {
    const unpatch2 = after("factory", modules[id], function(args) {
      callback(args[4].exports, module, id);
    }, true);
    return function() {
      return unpatch2();
    };
  }
}
var init_metro = __esm({
  "src/metro/index.ts"() {
    "use strict";
    init_proxyLazy();
    init_esm();
    init_common();
    init_internal_metro();
    __name(canRequire, "canRequire");
    __name(requireMetro, "requireMetro");
    __name(requireMetroLazy, "requireMetroLazy");
    __name(requireMetroDefaultLazy, "requireMetroDefaultLazy");
    __name(waitForModule, "waitForModule");
  }
});

// node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_class_call_check.js
function _class_call_check(instance, Constructor) {
  if (!(instance instanceof Constructor))
    throw new TypeError("Cannot call a class as a function");
}
var init_class_call_check = __esm({
  "node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_class_call_check.js"() {
    __name(_class_call_check, "_class_call_check");
  }
});

// node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_create_class.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _create_class(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
var init_create_class = __esm({
  "node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_create_class.js"() {
    __name(_defineProperties, "_defineProperties");
    __name(_create_class, "_create_class");
  }
});

// node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_define_property.js
function _define_property(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else
    obj[key] = value;
  return obj;
}
var init_define_property = __esm({
  "node_modules/.pnpm/@swc+helpers@0.5.3/node_modules/@swc/helpers/esm/_define_property.js"() {
    __name(_define_property, "_define_property");
  }
});

// src/api/Patcher.ts
var patchesInstances, Patcher;
var init_Patcher = __esm({
  "src/api/Patcher.ts"() {
    "use strict";
    init_class_call_check();
    init_create_class();
    init_define_property();
    init_esm();
    patchesInstances = /* @__PURE__ */ new Map();
    Patcher = /* @__PURE__ */ function() {
      "use strict";
      function Patcher2(identifier) {
        var _this = this;
        _class_call_check(this, Patcher2);
        _define_property(this, "identifier", void 0);
        _define_property(this, "patches", []);
        _define_property(this, "stopped", false);
        _define_property(this, "before", function(parent, method, patch) {
          return _this.addUnpatcher(before(method, parent, patch));
        });
        _define_property(this, "after", function(parent, method, patch) {
          return _this.addUnpatcher(after(method, parent, patch));
        });
        _define_property(this, "instead", function(parent, method, patch) {
          return _this.addUnpatcher(instead(method, parent, patch));
        });
        _define_property(this, "addUnpatcher", function(callback) {
          if (_this.stopped)
            return function() {
              return false;
            };
          if (typeof callback !== "function") {
            throw new Error("Unpatcher must be a function");
          }
          _this.patches.push(callback);
          return callback;
        });
        if (!identifier || typeof identifier !== "string") {
          throw new Error("Patcher identifier must be a non-empty string");
        }
        if (patchesInstances.has(identifier)) {
          throw new Error(`Patcher with identifier "${identifier}" already exists`);
        }
        this.identifier = identifier;
        patchesInstances.set(identifier, this);
      }
      __name(Patcher2, "Patcher");
      _create_class(Patcher2, [
        {
          key: "unpatchAllAndStop",
          value: /* @__PURE__ */ __name(function unpatchAllAndStop() {
            let success = true;
            this.stopped = true;
            for (const unpatch2 of this.patches) {
              try {
                if (unpatch2?.() === false)
                  throw void 0;
              } catch {
                success = false;
              }
            }
            patchesInstances.delete(this.identifier);
            return success;
          }, "unpatchAllAndStop")
        }
      ]);
      return Patcher2;
    }();
  }
});

// src/native.ts
var native_exports = {};
__export(native_exports, {
  readFile: () => readFile,
  writeFile: () => writeFile
});
async function writeFile(path, data) {
  let prefix = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "pyoncord/";
  return void await RTNFileManager.writeFile("documents", `${prefix}${path}`, data, "utf8");
}
async function readFile(path, fallback) {
  let prefix = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "pyoncord/";
  try {
    return await RTNFileManager.readFile(`${RTNFileManager.getConstants().DocumentsDirPath}/${prefix}${path}`, "utf8");
  } catch {
    if (fallback == null) {
      throw new Error(`File ${path} doesn't exist`);
    }
    writeFile(path, fallback);
    return fallback;
  }
}
var RTNFileManager;
var init_native = __esm({
  "src/native.ts"() {
    "use strict";
    ({ RTNFileManager } = nativeModuleProxy);
    __name(writeFile, "writeFile");
    __name(readFile, "readFile");
  }
});

// src/utils/assets.ts
var assets_exports = {};
__export(assets_exports, {
  getAssetByID: () => getAssetByID,
  getAssetByName: () => getAssetByName,
  getAssetIDByName: () => getAssetIDByName,
  patchAssets: () => patchAssets,
  registeredAssets: () => registeredAssets,
  requireAssetFromCache: () => requireAssetFromCache,
  resolveAssets: () => resolveAssets
});
function patchAssets() {
  patcher.instead(AssetManager, "registerAsset", function(args, orig) {
    const [asset2] = args;
    if (registeredAssets[asset2.name]) {
      Object.assign(registeredAssets[asset2.name], asset2);
      return registeredAssets[asset2.name].id;
    }
    registeredAssets[asset2.name] = {
      ...asset2,
      id: orig(...args)
    };
    return registeredAssets[asset2.name].id;
  });
  let asset, id = 1;
  while (asset = AssetManager.getAssetByID(id)) {
    registeredAssets[asset.name] ??= {
      ...asset,
      id: id++
    };
  }
  return function() {
    return patcher.unpatchAllAndStop();
  };
}
function requireAssetFromCache(name) {
  const cache = pyonRequire.requireAsset(name);
  return AssetManager.registerAsset(cache);
}
function resolveAssets(assets) {
  return new Proxy({}, {
    get: function(t, p) {
      return t[p] ??= requireAssetFromCache(assets[p]);
    }
  });
}
var patcher, registeredAssets, getAssetByName, getAssetByID, getAssetIDByName;
var init_assets = __esm({
  "src/utils/assets.ts"() {
    "use strict";
    init_Patcher();
    init_common();
    patcher = new Patcher("assets-patcher");
    registeredAssets = {};
    __name(patchAssets, "patchAssets");
    getAssetByName = /* @__PURE__ */ __name(function(name) {
      return registeredAssets[name];
    }, "getAssetByName");
    getAssetByID = /* @__PURE__ */ __name(function(id) {
      return AssetManager.getAssetByID(id);
    }, "getAssetByID");
    getAssetIDByName = /* @__PURE__ */ __name(function(name) {
      return registeredAssets[name]?.id;
    }, "getAssetIDByName");
    __name(requireAssetFromCache, "requireAssetFromCache");
    __name(resolveAssets, "resolveAssets");
  }
});

// src/utils/findInReactTree.ts
function findInReactTree(tree, filter) {
  return findInTree(tree, filter, {
    walkable: [
      "props",
      "children",
      "child",
      "sibling"
    ]
  });
}
var init_findInReactTree = __esm({
  "src/utils/findInReactTree.ts"() {
    "use strict";
    init_utils();
    __name(findInReactTree, "findInReactTree");
  }
});

// src/utils/findInTree.ts
function treeSearch(tree, filter, opts, depth) {
  if (depth > opts.maxDepth)
    return;
  if (!tree)
    return;
  try {
    if (filter(tree))
      return tree;
  } catch {
  }
  if (Array.isArray(tree)) {
    for (const item of tree) {
      if (typeof item !== "object" || item === null)
        continue;
      try {
        const found = treeSearch(item, filter, opts, depth + 1);
        if (found)
          return found;
      } catch {
      }
    }
  } else if (typeof tree === "object") {
    for (const key of Object.keys(tree)) {
      if (typeof tree[key] !== "object" || tree[key] === null)
        continue;
      if (opts.walkable.length && !opts.walkable.includes(key))
        continue;
      if (opts.ignore.includes(key))
        continue;
      try {
        const found = treeSearch(tree[key], filter, opts, depth + 1);
        if (found)
          return found;
      } catch {
      }
    }
  }
}
function findInTree(tree, filter) {
  let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  return treeSearch(tree, filter, {
    walkable: [],
    ignore: [],
    maxDepth: 100,
    ...opts
  }, 0);
}
var init_findInTree = __esm({
  "src/utils/findInTree.ts"() {
    "use strict";
    __name(treeSearch, "treeSearch");
    __name(findInTree, "findInTree");
  }
});

// src/utils/lazyNavigate.tsx
async function lazyNavigate(navigation, renderPromise, screenOptions, props) {
  const Component = await renderPromise.then(function(m) {
    return m.default;
  });
  if (typeof screenOptions === "string") {
    screenOptions = {
      title: screenOptions
    };
  }
  navigation.navigate("PyoncordCustomPage", {
    ...screenOptions,
    render: function() {
      return /* @__PURE__ */ React.createElement(Component, props);
    }
  });
}
var init_lazyNavigate = __esm({
  "src/utils/lazyNavigate.tsx"() {
    "use strict";
    __name(lazyNavigate, "lazyNavigate");
  }
});

// src/utils/observeObject.ts
function observeObject(obj, callback) {
  const handler = {
    get(target, key) {
      const value = target[key];
      if (typeof value === "object") {
        return observeObject(value, callback);
      }
      return value;
    },
    set(target, key, value) {
      target[key] = value;
      callback(target);
      return true;
    },
    deleteProperty(target, key) {
      delete target[key];
      callback(target);
      return true;
    }
  };
  return new Proxy(obj, handler);
}
var init_observeObject = __esm({
  "src/utils/observeObject.ts"() {
    "use strict";
    __name(observeObject, "observeObject");
  }
});

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  assets: () => assets_exports,
  findInReactTree: () => findInReactTree,
  findInTree: () => findInTree,
  lazyNavigate: () => lazyNavigate,
  observeObject: () => observeObject,
  proxyLazy: () => proxyLazy
});
var init_utils = __esm({
  "src/utils/index.ts"() {
    "use strict";
    init_assets();
    init_findInReactTree();
    init_findInTree();
    init_lazyNavigate();
    init_observeObject();
    init_proxyLazy();
  }
});

// src/api/SettingsAPI.ts
var _globalAwaiter, SettingsAPI;
var init_SettingsAPI = __esm({
  "src/api/SettingsAPI.ts"() {
    "use strict";
    init_class_call_check();
    init_create_class();
    init_define_property();
    init_native();
    init_utils();
    _globalAwaiter = Promise.resolve();
    SettingsAPI = /* @__PURE__ */ function() {
      "use strict";
      function SettingsAPI2(path) {
        let defaultData = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _this = this;
        _class_call_check(this, SettingsAPI2);
        _define_property(this, "path", void 0);
        _define_property(this, "defaultData", void 0);
        _define_property(this, "_cachedProxy", void 0);
        _define_property(this, "_readAwaiter", void 0);
        _define_property(this, "callbacks", void 0);
        _define_property(this, "snapshot", void 0);
        _define_property(this, "init", void 0);
        _define_property(this, "subscribe", void 0);
        _define_property(this, "useStorage", void 0);
        this.path = path;
        this.defaultData = defaultData;
        this._cachedProxy = null;
        this.callbacks = /* @__PURE__ */ new Set();
        this.init = async function() {
          if (_this._readAwaiter)
            return _this._readAwaiter;
          _this.snapshot = JSON.parse(await readFile(_this.path, JSON.stringify(_this.defaultData)));
          return _this;
        };
        this.subscribe = function(callback) {
          _this.callbacks.add(callback);
          return function() {
            return _this.callbacks.delete(callback);
          };
        };
        this.useStorage = function() {
          const forceUpdate = React.useReducer(function(n) {
            return ~n;
          }, 0)[1];
          React.useEffect(function() {
            const unsub = _this.subscribe(forceUpdate);
            return function() {
              return void unsub();
            };
          }, []);
          return _this.proxy;
        };
        this._readAwaiter = this.init();
      }
      __name(SettingsAPI2, "SettingsAPI");
      _create_class(SettingsAPI2, [
        {
          key: "proxy",
          get: function() {
            var _this = this;
            if (!this.snapshot)
              throw new Error("StorageWrapper not initialized");
            return this._cachedProxy ??= observeObject(this.snapshot, async function(obj) {
              _this.callbacks.forEach(function(cb) {
                return cb(_this.snapshot);
              });
              const writeTask = writeFile(_this.path, JSON.stringify(obj));
              _globalAwaiter = _globalAwaiter.then(function() {
                return writeTask;
              });
            });
          }
        }
      ]);
      return SettingsAPI2;
    }();
  }
});

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  Patcher: () => Patcher,
  SettingsAPI: () => SettingsAPI
});
var init_api = __esm({
  "src/api/index.ts"() {
    "use strict";
    init_Patcher();
    init_SettingsAPI();
  }
});

// src/debug/index.ts
var debug_exports = {};
__export(debug_exports, {
  connectToDebugger: () => connectToDebugger
});
function connectToDebugger() {
  if (websocket)
    return;
  websocket = new WebSocket("ws://localhost:9090/");
  const toExpose = {
    ...pyoncord.metro,
    ...pyoncord.utils,
    patcher: patcher2
  };
  const [exposeKeys, exposeValues] = [
    Object.keys(toExpose),
    Object.values(toExpose)
  ];
  websocket.addEventListener("open", function() {
    return console.log("Connected to debug websocket");
  });
  websocket.addEventListener("error", function(e) {
    return console.error(e.message);
  });
  websocket.addEventListener("message", function(message) {
    try {
      const toEval = new AsyncFunction(...exposeKeys, `return (${message.data})`);
      toEval(...exposeValues).then(console.log).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  });
  const unpatch2 = before2(globalThis, "nativeLoggingHook", function(param) {
    let [message, level] = param;
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        level,
        message
      }));
    }
  });
  websocket.addEventListener("close", function() {
    unpatch2();
    websocket = null;
    setTimeout(connectToDebugger, 3e3);
  });
}
var before2, patcher2, websocket, AsyncFunction;
var init_debug = __esm({
  "src/debug/index.ts"() {
    "use strict";
    init_Patcher();
    ({ before: before2 } = new Patcher("debug-ws-patcher"));
    patcher2 = new Patcher("ws-patcher");
    websocket = null;
    AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    __name(connectToDebugger, "connectToDebugger");
  }
});

// src/managers/plugins.ts
async function loadPlugin(plugin) {
  const pluginJS = await readFile(`plugins/${plugin.js}`);
  const wrappedJS = `(()=>{return ${pluginJS}})//# sourceURL=pyon-plugin-${plugin.name}`;
  try {
    const evaled = eval?.(wrappedJS)();
    const ret = evaled?.default ?? evaled ?? {};
    ret.onLoad?.();
    pluginInstances.set(plugin.name, ret);
    console.log(`Loaded plugin ${plugin.name}`);
  } catch (err) {
    console.error(`Failed to load plugin ${plugin.name}: ${err}`);
    delete pluginInstances[plugin.name];
  }
}
async function loadPlugins() {
  await pluginStorage.init();
  for (const plugin of pluginStorage.proxy)
    if (plugin.enabled) {
      loadPlugin(plugin);
    }
}
var pluginStorage, pluginInstances;
var init_plugins = __esm({
  "src/managers/plugins.ts"() {
    "use strict";
    init_api();
    init_native();
    pluginStorage = new SettingsAPI("plugins/plugins.json", []);
    pluginInstances = /* @__PURE__ */ new Map();
    __name(loadPlugin, "loadPlugin");
    __name(loadPlugins, "loadPlugins");
  }
});

// src/patches/chatInput.ts
async function patchChatInput() {
  let hideGiftButton, moduleExports;
  const unwait = waitForModule("uikit-native/ChatInput.tsx", function(param) {
    let { default: exports } = param;
    moduleExports = exports;
    ({ hideGiftButton } = exports.defaultProps);
    exports.defaultProps.hideGiftButton = true;
  });
  return function() {
    return hideGiftButton !== void 0 ? moduleExports.defaultProps.hideGiftButton = hideGiftButton : unwait();
  };
}
var init_chatInput = __esm({
  "src/patches/chatInput.ts"() {
    "use strict";
    init_metro();
    __name(patchChatInput, "patchChatInput");
  }
});

// src/patches/experiments.ts
async function patchExperiments() {
  try {
    FluxDispatcher.subscribe("CONNECTION_OPEN", function() {
      UserStore.getCurrentUser().flags |= 1;
      UserStore._dispatcher._actionHandlers._computeOrderedActionHandlers("OVERLAY_INITIALIZE").forEach(function(param) {
        let { name, actionHandler } = param;
        name.includes?.("Experiment") && actionHandler?.({
          serializedExperimentStore: ExperimentStore.getSerializedState(),
          user: {
            flags: 1
          }
        });
      });
    });
  } catch (err) {
    console.error("An error occurred while patching experiments", err);
  }
}
var UserStore, ExperimentStore;
var init_experiments = __esm({
  "src/patches/experiments.ts"() {
    "use strict";
    init_metro();
    init_common();
    UserStore = requireMetroDefaultLazy("UserStore");
    ExperimentStore = requireMetroDefaultLazy("ExperimentStore");
    __name(patchExperiments, "patchExperiments");
  }
});

// src/patches/idle.ts
async function patchIdle() {
  await onceReady;
  patcher3.before(FluxDispatcher, "dispatch", function(args) {
    if (args[0].type === "IDLE") {
      return [
        {
          type: "THIS_TYPE_DOES_NOT_EXIST"
        }
      ];
    }
  });
  return patcher3.unpatchAllAndStop;
}
var patcher3;
var init_idle = __esm({
  "src/patches/idle.ts"() {
    "use strict";
    init_Patcher();
    init_metro();
    init_common();
    patcher3 = new Patcher("idle-patcher");
    __name(patchIdle, "patchIdle");
  }
});

// src/ui/screens/General.tsx
var General_exports = {};
__export(General_exports, {
  default: () => General
});
function General() {
  const settings2 = settings.useStorage();
  return /* @__PURE__ */ React.createElement(ScrollView, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 38
    }
  }, /* @__PURE__ */ React.createElement(Stack, {
    style: {
      paddingVertical: 24,
      paddingHorizontal: 12
    },
    spacing: 24
  }, /* @__PURE__ */ React.createElement(TableRowGroup, {
    title: "Settings"
  }, /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Enable Discord's experiments menu",
    subLabel: "Enables the experiments menu in Discord's settings, which only staff has access to.",
    icon: /* @__PURE__ */ React.createElement(TableRow.Icon, {
      source: icons.StaffBadge
    }),
    value: settings2.experiments,
    onValueChange: function(v) {
      return settings2.experiments = v;
    }
  }), /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Hide gift button on chat input",
    subLabel: "Hides the gift button on the chat input.",
    icon: /* @__PURE__ */ React.createElement(TableRow.Icon, {
      source: icons.Gift
    }),
    value: settings2.hideGiftButton,
    onValueChange: function(v) {
      return settings2.hideGiftButton = v;
    }
  }), /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Hide idle status",
    subLabel: "Hides the idling status when app is backgrounded.",
    icon: /* @__PURE__ */ React.createElement(TableRow.Icon, {
      source: icons.Idle
    }),
    value: settings2.hideIdling,
    onValueChange: function(v) {
      return settings2.hideIdling = v;
    }
  }))));
}
var ScrollView, Stack, TableRow, TableSwitchRow, TableRowGroup, icons;
var init_General = __esm({
  "src/ui/screens/General.tsx"() {
    "use strict";
    init_src();
    init_common();
    init_assets();
    ({ ScrollView } = ReactNative);
    ({ Stack, TableRow, TableSwitchRow, TableRowGroup } = Tables);
    icons = resolveAssets({
      StaffBadge: "ic_badge_staff",
      Gift: "ic_gift_24px",
      Idle: "StatusIdle"
    });
    __name(General, "General");
  }
});

// src/ui/screens/Plugins.tsx
var Plugins_exports = {};
__export(Plugins_exports, {
  default: () => UpdaterPage
});
function UpdaterPage() {
  return /* @__PURE__ */ React.createElement(ScrollView2, null, /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, null, "Plugin system coming soon (never).")));
}
var View, Text, ScrollView2;
var init_Plugins = __esm({
  "src/ui/screens/Plugins.tsx"() {
    "use strict";
    ({ View, Text, ScrollView: ScrollView2 } = ReactNative);
    __name(UpdaterPage, "UpdaterPage");
  }
});

// src/patches/settings.tsx
function patchSettings() {
  waitForModule("SettingConstants", function(module) {
    module.SETTING_RENDERER_CONFIG.PYONCORD_CUSTOM_PAGE = {
      type: "route",
      title: function() {
        return "Blah?";
      },
      screen: {
        route: "PyoncordCustomPage",
        getComponent: function() {
          return CustomPageRenderer;
        }
      }
    };
    for (const sect of Object.values(sections)) {
      sect.forEach(function(param) {
        let [key, title, getRender, icon] = param;
        module.SETTING_RENDERER_CONFIG[key] = {
          type: "pressable",
          title: function() {
            return title;
          },
          icon,
          onPress: function() {
            const ref = TabsNavigationRef.getRootNavigationRef();
            lazyNavigate(ref, getRender(), title);
          },
          withArrow: true
        };
      });
    }
  });
  waitForModule("modules/main_tabs_v2/native/settings/renderer/SettingListRenderer.tsx", function(module) {
    patcher4.before(module.SearchableSettingsList, "type", function(param) {
      let [{ sections: res }] = param;
      if (res.__pyonMarkDirty)
        return;
      res.__pyonMarkDirty = true;
      let index = -~res.findIndex(function(i) {
        return i.label === I18n.Messages.ACCOUNT_SETTINGS;
      }) || 1;
      Object.keys(sections).forEach(function(sect) {
        res.splice(index++, 0, {
          label: sect,
          settings: sections[sect].map(function(a) {
            return a[0];
          })
        });
      });
    });
  });
  return function() {
    return patcher4.unpatchAllAndStop();
  };
}
var patcher4, icons2, sections, CustomPageRenderer;
var init_settings = __esm({
  "src/patches/settings.tsx"() {
    "use strict";
    init_Patcher();
    init_metro();
    init_common();
    init_utils();
    init_assets();
    patcher4 = new Patcher("settings-patcher");
    icons2 = resolveAssets({
      Discord: "Discord",
      Wrench: "ic_progress_wrench_24px"
    });
    sections = window.__pyoncord_sections_patch = {
      [`Pyoncord (${"c80ee49"}) ${true ? "(DEV)" : ""}`.trimEnd()]: [
        [
          "PYONCORD",
          "Pyoncord",
          function() {
            return Promise.resolve().then(() => (init_General(), General_exports));
          },
          icons2.Discord
        ],
        [
          "PYONCORD_PLUGINS",
          "Plugins",
          function() {
            return Promise.resolve().then(() => (init_Plugins(), Plugins_exports));
          },
          icons2.Wrench
        ]
      ]
    };
    CustomPageRenderer = React.memo(function() {
      const navigation = NavigationNative.useNavigation();
      const route = NavigationNative.useRoute();
      const { render: PageComponent, ...args } = route.params;
      React.useEffect(function() {
        return void navigation.setOptions({
          ...args
        });
      }, []);
      return /* @__PURE__ */ React.createElement(PageComponent, null);
    });
    __name(patchSettings, "patchSettings");
  }
});

// src/themes.ts
var themes_exports = {};
__export(themes_exports, {
  getCurrentTheme: () => getCurrentTheme
});
function getCurrentTheme() {
  throw new Error("Not implemented");
}
var init_themes = __esm({
  "src/themes.ts"() {
    "use strict";
    __name(getCurrentTheme, "getCurrentTheme");
  }
});

// src/patches/theme.ts
async function patchTheme() {
  return;
  const currentTheme = getCurrentTheme();
  waitForModule(function(m) {
    return m?.unsafe_rawColors && m.meta;
  }, function(ColorModule) {
    let semanticColorsSymbol;
    const orig_rawColors = ColorModule.unsafe_rawColors;
    ColorModule.unsafe_rawColors = {
      ...ColorModule.unsafe_rawColors,
      ...currentTheme.data.rawColors
    };
    patcher5.addUnpatcher(function() {
      ColorModule.unsafe_rawColors = orig_rawColors;
    });
    patcher5.instead(ColorModule.meta, "resolveSemanticColor", function(param, orig) {
      let [theme, key] = param;
      const realKey = key[semanticColorsSymbol ??= Object.getOwnPropertySymbols(key)[0]];
      const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;
      if (currentTheme.data.semanticColors[realKey]?.[themeIndex]) {
        return currentTheme.data.semanticColors[realKey][themeIndex];
      }
      return orig(theme, key);
    });
  });
  return function() {
    return patcher5.unpatchAllAndStop();
  };
}
var patcher5;
var init_theme = __esm({
  "src/patches/theme.ts"() {
    "use strict";
    init_Patcher();
    init_metro();
    init_themes();
    patcher5 = new Patcher("theme-patcher");
    __name(patchTheme, "patchTheme");
  }
});

// src/patches/index.ts
var patches_exports = {};
__export(patches_exports, {
  patchChatInput: () => patchChatInput,
  patchExperiments: () => patchExperiments,
  patchIdle: () => patchIdle,
  patchSettings: () => patchSettings,
  patchTheme: () => patchTheme
});
var init_patches = __esm({
  "src/patches/index.ts"() {
    "use strict";
    init_chatInput();
    init_experiments();
    init_idle();
    init_settings();
    init_theme();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  api: () => api_exports,
  debug: () => debug_exports,
  default: () => src_default,
  metro: () => metro_exports,
  native: () => native_exports,
  patches: () => patches_exports,
  settings: () => settings,
  themes: () => themes_exports,
  utils: () => utils_exports
});
async function src_default() {
  connectToDebugger();
  const settingsProxy = (await settings.init()).proxy;
  const patches = [
    patchAssets(),
    settingsProxy.experiments && patchExperiments(),
    settingsProxy.hideGiftButton && patchChatInput(),
    settingsProxy.hideIdling && patchIdle(),
    patchSettings()
  ];
  loadPlugins();
  window.__startDiscord?.();
  await Promise.all(patches);
  return function() {
    console.log("Unloading Pyoncord...");
    patches.forEach(async function(p) {
      return p && (await p)?.();
    });
  };
}
var settings;
var init_src = __esm({
  "src/index.ts"() {
    "use strict";
    init_api();
    init_debug();
    init_plugins();
    init_patches();
    init_assets();
    init_api();
    init_debug();
    init_metro();
    init_native();
    init_patches();
    init_themes();
    init_utils();
    settings = new SettingsAPI("settings.json", {
      experiments: true,
      hideGiftButton: true,
      hideIdling: true
    });
    __name(src_default, "default");
  }
});

// entry.js
console.log(`Pyon! (Pyoncord, hash=${"c80ee49"}, dev=${true})`);
try {
  Object.freeze = Object.seal = Object;
  window.pyonRequire = await Promise.resolve().then(() => (init_cacher(), cacher_exports)).then(function(m) {
    return m.default();
  });
  const { waitForModule: waitForModule2 } = await Promise.resolve().then(() => (init_metro(), metro_exports));
  waitForModule2("react", function(m) {
    return window.React = m;
  });
  waitForModule2("react-native", function(m) {
    return window.ReactNative = m;
  });
  window.pyoncord = {
    ...await Promise.resolve().then(() => (init_src(), src_exports))
  };
  pyoncord.unload = await pyoncord.default();
  delete pyoncord.default;
} catch (error) {
  error = error?.stack ?? error;
  alert([
    "Failed to load Pyoncord.\n",
    `Build Hash: ${"c80ee49"}`,
    `Debug Build: ${true}`,
    `Build Number: ${nativeModuleProxy.RTNClientInfoManager?.Build}`,
    error
  ].join("\n"));
  console.error(error);
  window.__startDiscord?.();
}
})().catch(e => alert(e?.stack ?? e));
//# sourceURL=pyoncord