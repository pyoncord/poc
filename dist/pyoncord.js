"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_class_call_check.js
  function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor))
      throw new TypeError("Cannot call a class as a function");
  }
  var init_class_call_check = __esm({
    "node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_class_call_check.js"() {
    }
  });

  // node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_create_class.js
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
    "node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_create_class.js"() {
    }
  });

  // node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_define_property.js
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
    "node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_define_property.js"() {
    }
  });

  // src/EventEmitter.ts
  var EventEmitter;
  var init_EventEmitter = __esm({
    "src/EventEmitter.ts"() {
      "use strict";
      init_class_call_check();
      init_create_class();
      init_define_property();
      EventEmitter = /* @__PURE__ */ function() {
        "use strict";
        function EventEmitter2() {
          _class_call_check(this, EventEmitter2);
          _define_property(this, "events", /* @__PURE__ */ new Map());
        }
        _create_class(EventEmitter2, [
          {
            key: "on",
            value: function on(eventName, listener) {
              if (!this.events.get(eventName)?.add(listener)) {
                this.events.set(eventName, /* @__PURE__ */ new Set([
                  listener
                ]));
              }
            }
          },
          {
            key: "emit",
            value: function emit(eventName) {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              const listeners = this.events.get(eventName);
              if (listeners) {
                listeners.forEach(function(listener) {
                  listener(...args);
                });
              }
            }
          },
          {
            key: "off",
            value: function off(eventName, listenerToRemove) {
              const listeners = this.events.get(eventName);
              if (!listeners) {
                return;
              }
              listeners.delete(listenerToRemove);
              if (listeners.size === 0) {
                this.events.delete(eventName);
              }
            }
          }
        ]);
        return EventEmitter2;
      }();
    }
  });

  // src/utils/proxyLazy.ts
  function proxyLazy(factory) {
    const dummy = function() {
      return void 0;
    };
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
      isUnconfigurable = function(key) {
        return typeof key === "string" && unconfigurable.includes(key);
      };
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
    }
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/shared.js
  var patchTypes, patchedObjects;
  var init_shared = __esm({
    "node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/shared.js"() {
      patchTypes = [
        "a",
        "b",
        "i"
      ];
      patchedObjects = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/hook.js
  function hook_default(funcName, funcParent, funcArgs, ctxt, isConstruct) {
    const patch = patchedObjects.get(funcParent)?.[funcName];
    if (!patch)
      return isConstruct ? Reflect.construct(funcParent[funcName], funcArgs, ctxt) : funcParent[funcName].apply(ctxt, funcArgs);
    for (const hook of patch.b.values()) {
      const maybefuncArgs = hook.call(ctxt, funcArgs);
      if (Array.isArray(maybefuncArgs))
        funcArgs = maybefuncArgs;
    }
    let insteadPatchedFunc = function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return isConstruct ? Reflect.construct(patch.o, args, ctxt) : patch.o.apply(ctxt, args);
    };
    for (const callback of patch.i.values()) {
      const oldPatchFunc = insteadPatchedFunc;
      insteadPatchedFunc = function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return callback.call(ctxt, args, oldPatchFunc);
      };
    }
    let workingRetVal = insteadPatchedFunc(...funcArgs);
    for (const hook of patch.a.values())
      workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
    return workingRetVal;
  }
  var init_hook = __esm({
    "node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/hook.js"() {
      init_shared();
    }
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/unpatch.js
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
    "node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/unpatch.js"() {
      init_shared();
    }
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/getPatchFunc.js
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
        const runHook = function(ctxt, args, construct) {
          const ret = hook_default(funcName, funcParent, args, ctxt, construct);
          if (oneTime)
            unpatchThisPatch();
          return ret;
        };
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
      const unpatchThisPatch = function() {
        return unpatch(funcParent, funcName, hookId, patchType);
      };
      parentInjections[funcName][patchType].set(hookId, callback);
      return unpatchThisPatch;
    };
  }
  var init_getPatchFunc = __esm({
    "node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/getPatchFunc.js"() {
      init_hook();
      init_shared();
      init_unpatch();
    }
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js
  var before, instead, after;
  var init_esm = __esm({
    "node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js"() {
      init_getPatchFunc();
      init_unpatch();
      before = getPatchFunc_default("b");
      instead = getPatchFunc_default("i");
      after = getPatchFunc_default("a");
    }
  });

  // src/metro/index.ts
  var metro_exports = {};
  __export(metro_exports, {
    findByDisplayName: () => findByDisplayName,
    findByDisplayNameLazy: () => findByDisplayNameLazy,
    findByName: () => findByName,
    findByNameLazy: () => findByNameLazy,
    findByProps: () => findByProps,
    findByPropsLazy: () => findByPropsLazy,
    findByStoreName: () => findByStoreName,
    findByStoreNameLazy: () => findByStoreNameLazy,
    findInitializedModule: () => findInitializedModule,
    findLazy: () => findLazy,
    getInitializedModules: () => getInitializedModules,
    moduleLoadEvent: () => moduleLoadEvent,
    patchFactories: () => patchFactories,
    waitForModule: () => waitForModule
  });
  function patchFactories() {
    for (const id in modules) {
      const module = modules[id];
      if (module.factory) {
        instead("factory", module, function(args, orig) {
          orig(...args);
          module.dependencyMap = args[6];
          moduleLoadEvent.emit("export", args[5]);
        });
      }
    }
  }
  function* getInitializedModules() {
    for (const id in modules) {
      if (modules[id].isInitialized) {
        yield modules[id].publicModule;
      }
    }
  }
  function waitForModule(filter, callback) {
    const matches = function(exports) {
      if (exports.default && exports.__esModule && filter(exports.default)) {
        moduleLoadEvent.off("export", matches);
        callback(exports.default);
      }
      if (filter(exports)) {
        moduleLoadEvent.off("export", matches);
        callback(exports);
      }
    };
    moduleLoadEvent.on("export", matches);
    return function() {
      return moduleLoadEvent.off("export", matches);
    };
  }
  function findInitializedModule(filter) {
    let returnDefault = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    for (const { exports } of getInitializedModules()) {
      if (exports?.default && exports.__esModule && filter(exports.default)) {
        return returnDefault ? exports.default : exports;
      }
      if (filter(exports)) {
        return exports;
      }
    }
  }
  function findLazy(filter) {
    let returnDefault = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return proxyLazy(function() {
      return findInitializedModule(filter, returnDefault);
    });
  }
  function findByProps() {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }
    return findInitializedModule(function(m) {
      return props.every(function(prop) {
        return m?.[prop];
      });
    });
  }
  function findByPropsLazy() {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }
    return proxyLazy(function() {
      return findByProps(...props);
    });
  }
  function findByName(name) {
    let defaultExport = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return findInitializedModule(function(m) {
      return m?.name === name;
    }, defaultExport);
  }
  function findByNameLazy(name) {
    let defaultExport = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return proxyLazy(function() {
      return findByName(name, defaultExport);
    });
  }
  function findByDisplayName(displayName) {
    let defaultExport = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return findInitializedModule(function(m) {
      return m?.displayName === displayName;
    }, defaultExport);
  }
  function findByDisplayNameLazy(displayName) {
    let defaultExport = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return proxyLazy(function() {
      return findByDisplayName(displayName, defaultExport);
    });
  }
  function findByStoreName(storeName) {
    return findInitializedModule(function(m) {
      return m?.getName?.() === storeName;
    });
  }
  function findByStoreNameLazy(storeName) {
    return proxyLazy(function() {
      return findByStoreName(storeName);
    });
  }
  var moduleLoadEvent;
  var init_metro = __esm({
    "src/metro/index.ts"() {
      "use strict";
      init_EventEmitter();
      init_proxyLazy();
      init_esm();
      moduleLoadEvent = new EventEmitter();
    }
  });

  // src/patches/chatInput.ts
  async function chatInput_default() {
    let hideGiftButton, moduleExports;
    const unwait = waitForModule(function(m) {
      return typeof m?.defaultProps?.hideGiftButton === "boolean";
    }, function(exports) {
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
    }
  });

  // src/metro/common.ts
  var AssetManager, I18n, Forms, NavigationNative;
  var init_common = __esm({
    "src/metro/common.ts"() {
      "use strict";
      init_metro();
      AssetManager = findByProps("getAssetByID");
      I18n = findByPropsLazy("Messages");
      Forms = findByPropsLazy("FormSection");
      NavigationNative = findByPropsLazy("NavigationContainer");
    }
  });

  // src/patcher.ts
  var patchesInstances, Patcher;
  var init_patcher = __esm({
    "src/patcher.ts"() {
      "use strict";
      init_class_call_check();
      init_define_property();
      init_esm();
      patchesInstances = /* @__PURE__ */ new Map();
      Patcher = function Patcher2(identifier) {
        "use strict";
        var _this = this;
        _class_call_check(this, Patcher2);
        _define_property(this, "identifier", void 0);
        _define_property(this, "patches", []);
        _define_property(this, "stopped", false);
        _define_property(this, "before", function(parent, method, patch) {
          if (_this.stopped)
            return function() {
              return false;
            };
          const unpatch2 = before(method, parent, patch);
          _this.patches.push(unpatch2);
          return unpatch2;
        });
        _define_property(this, "after", function(parent, method, patch) {
          if (_this.stopped)
            return function() {
              return false;
            };
          const unpatch2 = after(method, parent, patch);
          _this.patches.push(unpatch2);
          return unpatch2;
        });
        _define_property(this, "instead", function(parent, method, patch) {
          if (_this.stopped)
            return function() {
              return false;
            };
          const unpatch2 = instead(method, parent, patch);
          _this.patches.push(unpatch2);
          return unpatch2;
        });
        _define_property(this, "unpatchAllAndStop", function() {
          let success = true;
          _this.stopped = true;
          for (const unpatch2 of _this.patches) {
            try {
              success = unpatch2?.() && success;
            } catch {
              success = false;
            }
          }
          patchesInstances.delete(_this.identifier);
          return success;
        });
        _define_property(this, "addUnpatcher", function(callback) {
          if (typeof callback !== "function") {
            throw new Error("Unpatcher must be a function");
          }
          _this.patches.push(callback);
        });
        if (!identifier || typeof identifier !== "string") {
          throw new Error("Patcher identifier must be a non-empty string");
        }
        if (patchesInstances.has(identifier)) {
          throw new Error(`Patcher with identifier "${identifier}" already exists`);
        }
        this.identifier = identifier;
        patchesInstances.set(identifier, this);
      };
    }
  });

  // src/utils/assets.ts
  var assets_exports = {};
  __export(assets_exports, {
    getAssetByID: () => getAssetByID,
    getAssetByName: () => getAssetByName,
    getAssetIDByName: () => getAssetIDByName,
    patchAssets: () => patchAssets,
    registeredAssets: () => registeredAssets
  });
  function patchAssets() {
    const unpatch2 = after2(AssetManager, "registerAsset", function(param, id2) {
      let [asset2] = param;
      registeredAssets[asset2.name] = {
        ...asset2,
        id: id2
      };
    });
    let asset, id = 1;
    while (asset = AssetManager.getAssetByID(id)) {
      registeredAssets[asset.name] ??= {
        ...asset,
        id: id++
      };
    }
    return unpatch2;
  }
  var after2, registeredAssets, getAssetByName, getAssetByID, getAssetIDByName;
  var init_assets = __esm({
    "src/utils/assets.ts"() {
      "use strict";
      init_common();
      init_patcher();
      ({ after: after2 } = new Patcher("assets-patcher"));
      registeredAssets = {};
      getAssetByName = function(name) {
        return registeredAssets[name];
      };
      getAssetByID = function(id) {
        return AssetManager.getAssetByID(id);
      };
      getAssetIDByName = function(name) {
        return registeredAssets[name]?.id;
      };
    }
  });

  // src/utils/awaitUntil.ts
  function awaitUntil(condition) {
    let timeout = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
    return new Promise(function(resolve) {
      const interval = setInterval(function() {
        if (condition()) {
          clearInterval(interval);
          resolve();
        }
      }, timeout);
    });
  }
  var init_awaitUntil = __esm({
    "src/utils/awaitUntil.ts"() {
      "use strict";
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
    }
  });

  // src/utils/index.ts
  var utils_exports = {};
  __export(utils_exports, {
    assets: () => assets_exports,
    awaitUntil: () => awaitUntil,
    findInReactTree: () => findInReactTree,
    findInTree: () => findInTree,
    lazyNavigate: () => lazyNavigate,
    proxyLazy: () => proxyLazy
  });
  var init_utils = __esm({
    "src/utils/index.ts"() {
      "use strict";
      init_assets();
      init_awaitUntil();
      init_findInReactTree();
      init_findInTree();
      init_lazyNavigate();
      init_proxyLazy();
    }
  });

  // src/patches/experiments.ts
  async function experiments_default() {
    try {
      await awaitUntil(function() {
        return UserStore.getCurrentUser?.();
      });
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
    } catch (err) {
      console.error("An error occurred while patching experiments", err);
    }
  }
  var UserStore, ExperimentStore;
  var init_experiments = __esm({
    "src/patches/experiments.ts"() {
      "use strict";
      init_metro();
      init_utils();
      UserStore = findByStoreNameLazy("UserStore");
      ExperimentStore = findByStoreNameLazy("ExperimentStore");
    }
  });

  // src/patches/idle.ts
  function idle_default() {
    const unwait = waitForModule(function(m) {
      return m?.dispatch && m._actionHandlers?._orderedActionHandlers;
    }, function(exports) {
      patcher.before(exports, "dispatch", function(args) {
        if (args[0].type === "IDLE") {
          return [
            {
              type: "THIS_TYPE_DOES_NOT_EXIST"
            }
          ];
        }
      });
    });
    return function() {
      return unwait(), patcher.unpatchAllAndStop();
    };
  }
  var patcher;
  var init_idle = __esm({
    "src/patches/idle.ts"() {
      "use strict";
      init_metro();
      init_patcher();
      patcher = new Patcher("idle-patcher");
    }
  });

  // src/ui/screens/General.tsx
  var General_exports = {};
  __export(General_exports, {
    default: () => General
  });
  function General() {
    return /* @__PURE__ */ React.createElement(ScrollView, {
      style: {
        flex: 1
      },
      contentContainerStyle: {
        paddingBottom: 38
      }
    }, /* @__PURE__ */ React.createElement(FormSection, {
      title: "Settings",
      titleStyleType: "no_border"
    }, /* @__PURE__ */ React.createElement(FormSwitchRow, {
      label: "Trigger Discord's experiments menu",
      subLabel: "Enables the experiments menu in Discord's settings, which only staff has access to.",
      leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
        source: getAssetIDByName("ic_badge_staff")
      }),
      value: true,
      onValueChange: function() {
        return void 0;
      }
    })));
  }
  var ScrollView, FormSection, FormRow, FormSwitchRow;
  var init_General = __esm({
    "src/ui/screens/General.tsx"() {
      "use strict";
      init_common();
      init_assets();
      ({ ScrollView } = ReactNative);
      ({ FormSection, FormRow, FormSwitchRow } = Forms);
    }
  });

  // src/patches/settings.tsx
  function SettingsSection() {
    const { FormSection: FormSection2, FormRow: FormRow2, FormIcon } = Forms;
    const navigation = NavigationNative.useNavigation();
    const title = `Pyoncord (${"651d91c"}) ${true ? "(DEV)" : ""}`.trimEnd();
    return /* @__PURE__ */ React.createElement(FormSection2, {
      key: "Pyoncord",
      title
    }, /* @__PURE__ */ React.createElement(FormRow2, {
      label: "General",
      leading: /* @__PURE__ */ React.createElement(FormIcon, {
        source: assets_exports.getAssetIDByName("settings")
      }),
      trailing: FormRow2.Arrow,
      onPress: function() {
        return lazyNavigate(navigation, Promise.resolve().then(() => (init_General(), General_exports)), "Pyoncord");
      }
    }));
  }
  function patchSettings() {
    const unwaitScreens = waitForModule(function(m) {
      return m.default?.name === "getScreens";
    }, function(exports) {
      patcher2.after(exports, "default", function(args, screens) {
        return Object.assign(screens, {
          PyoncordCustomPage: {
            title: "Pyoncord",
            render: function(param) {
              let { render: PageComponent, ...args2 } = param;
              const navigation = NavigationNative.useNavigation();
              React.useEffect(function() {
                navigation.setOptions({
                  ...args2
                });
              }, []);
              return /* @__PURE__ */ React.createElement(PageComponent, null);
            }
          }
        });
      });
    });
    const unwaitWrapper = waitForModule(function(m) {
      return m.default?.name === "UserSettingsOverviewWrapper";
    }, function(exports) {
      const unpatch2 = patcher2.after(exports, "default", function(_args, ret) {
        const UserSettingsOverview = findInReactTree(ret.props.children, function(n) {
          return n.type?.name === "UserSettingsOverview";
        });
        patcher2.after(UserSettingsOverview.type.prototype, "renderSupportAndAcknowledgements", function(_args2, param) {
          let { props: { children } } = param;
          try {
            const index = children.findIndex(function(c) {
              return c?.type?.name === "UploadLogsButton";
            });
            if (index !== -1)
              children.splice(index, 1);
          } catch {
          }
        });
        patcher2.after(UserSettingsOverview.type.prototype, "render", function(_args2, res) {
          const titles = [
            I18n.Messages.BILLING_SETTINGS,
            I18n.Messages.PREMIUM_SETTINGS
          ];
          try {
            const sections = findInReactTree(res.props.children, function(n) {
              return n?.children?.[1]?.type === Forms.FormSection;
            }).children;
            const index = sections.findIndex(function(c) {
              return titles.includes(c?.props.label);
            });
            sections.splice(-~index || 4, 0, /* @__PURE__ */ React.createElement(SettingsSection, null));
          } catch (e) {
            console.error("An error occurred while trying to append Pyoncord's settings section. " + e?.stack);
          }
        });
        unpatch2();
      });
    });
    return function() {
      unwaitScreens();
      unwaitWrapper();
      patcher2.unpatchAllAndStop();
    };
  }
  var patcher2;
  var init_settings = __esm({
    "src/patches/settings.tsx"() {
      "use strict";
      init_metro();
      init_common();
      init_patcher();
      init_utils();
      patcher2 = new Patcher("settings-patcher");
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
    }
  });

  // src/patches/theme.ts
  async function theme_default() {
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
      patcher3.addUnpatcher(function() {
        ColorModule.unsafe_rawColors = orig_rawColors;
      });
      patcher3.instead(ColorModule.meta, "resolveSemanticColor", function(param, orig) {
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
      return patcher3.unpatchAllAndStop();
    };
  }
  var patcher3;
  var init_theme = __esm({
    "src/patches/theme.ts"() {
      "use strict";
      init_metro();
      init_patcher();
      init_themes();
      patcher3 = new Patcher("theme-patcher");
    }
  });

  // src/patches/index.ts
  var patches_exports = {};
  __export(patches_exports, {
    patchChatInput: () => chatInput_default,
    patchExperiments: () => experiments_default,
    patchIdle: () => idle_default,
    patchSettings: () => patchSettings,
    patchTheme: () => theme_default
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
    EventEmitter: () => EventEmitter,
    default: () => src_default,
    metro: () => metro_exports,
    patches: () => patches_exports,
    themes: () => themes_exports,
    utils: () => utils_exports
  });
  async function src_default() {
    console.log(`Initializing Pyoncord (hash=${"651d91c"} dev=${true})`);
    patchFactories();
    const patches = [
      patchAssets(),
      experiments_default(),
      chatInput_default(),
      idle_default(),
      patchSettings()
    ];
    await Promise.all(patches);
    return function() {
      console.log("Unloading Pyoncord...");
      patches.forEach(async function(p) {
        return (await p)?.();
      });
    };
  }
  var init_src = __esm({
    "src/index.ts"() {
      "use strict";
      init_EventEmitter();
      init_metro();
      init_patches();
      init_assets();
      init_metro();
      init_patches();
      init_themes();
      init_utils();
    }
  });

  // entry.js
  init_metro();
  console.log("Hello from Pyoncord!");
  async function init() {
    try {
      globalThis.React = findByProps("createElement");
      globalThis.ReactNative = findByProps("View");
      const pyoncord = await Promise.resolve().then(() => (init_src(), src_exports));
      const unload = await pyoncord.default();
      globalThis.pyoncord = {
        ...pyoncord,
        default: void 0,
        unload
      };
    } catch (error) {
      error = error?.stack ?? error;
      alert("Failed to load Pyoncord.\n" + error);
      console.error(error);
    }
    console.log(globalThis.pyoncord);
  }
  init();
})();
//# sourceURL=pyoncord
