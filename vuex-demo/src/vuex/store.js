let Vue;
import applyMixin from "./mixin";
import { forEachValue } from "./utils";
import ModuleCollection from "./module/module-collection";
export class Store {
  constructor(options) {
    console.log("op", options);
    const {plugins=[]} = options
    let state = options.state;
    const computed = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this._actions = {};
    this._mutations = {};
    this._subscribers = []

    this._wrappedGetters = {};
    this._modules = new ModuleCollection(options);

    // forEachValue(options.getters, (fn, key) => {
    //   computed[key] = () => {
    //     return fn(this.state);
    //   };
    //   Object.defineProperty(this.getters, key, {
    //     get: () => this._vm[key],
    //   });
    // });
    // this._vm = new Vue({
    //   data: {
    //     $$state: state,
    //   },
    //   computed,
    // });
    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = (payload) => fn.call(this, this.state, payload);
    });
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn.call(this, this, payload);
    });
    installModule(this, state, [], this._modules.root);
    resetStoreVM(this, state);
    plugins.forEach(plugin => plugin(this))

  }
  commit = (type, payload) => {
    this._mutations[type].forEach((fn) => fn.call(this, payload));
  };
  dispatch = (type, payload) => {
    this._actions[type].forEach((fn) => fn.call(this, payload));
  };

  get state() {
    return this._vm._data.$$state;
  }
  registerModule(path, rawModule) {
    if (typeof path == "string") path = [path];
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, rawModule.rawModule);
    // 重新设置state, 更新getters
    resetStoreVM(this, this.state);
  }
  subscribe(fn){
    this._subscribers.push(fn)
  }
  replaceState(state){
    this._vm._data.$$state = state;
  }
}
function resetStoreVM(store, state) {
  let oldVm = store._vm;
  const computed = {};
  store.getters = {};
  const wrappedGetters = store._wrappedGetters;
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = () => {
      return fn(store.state);
    };
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    });
  });
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy());
  }
}
function getState(store, path) {
  let local = path.reduce((newState, current) => {
      return newState[current]; 
  }, store.state);
  return local
}
function installModule(store, rootState, path, module) {
  let namespace = store._modules.getNamespace(path);
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    Vue.set(parent, path[path.length - 1], module.state);
  }
  module.forEachMutation((mutation, key) => {
    store._mutations[namespace + key] = store._mutations[namespace + key] || [];
    store._mutations[namespace + key].push((payload) => {
      mutation.call(store, getState(store,path), payload);
    });
  });
  module.forEachAction((action, key) => {
    store._actions[namespace + key] = store._actions[namespace + key] || [];
    store._actions[namespace + key].push(function(payload) {
      action.call(store, this, payload);
    });
  });
  module.forEachGetter((getter, key) => {
    store._wrappedGetters[namespace + key] = function() {
      return getter(module.state);
    };
  });
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

export function install(_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
