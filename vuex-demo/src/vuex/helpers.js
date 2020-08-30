const mapState = (arrList) => {
  let obj = {};
  for (let i = 0; i < arrList.length; i++) {
    let stateName = arrList[i];
    obj[stateName] = function() {
      return this.$store.state[stateName];
    };
  }
  return obj;
};

const mapGetters = (arrList) => {
  let obj = {};
  for (let i = 0; i < arrList.length; i++) {
    let getterName = arrList[i];
    obj[getterName] = function() {
      return this.$store.getters[getterName];
    };
  }
  return obj;
};

// #3.mapMutations实现
const mapMutations = mutationList=>{
    let obj = {};
    for (let i = 0; i < mutationList.length; i++) {
        let type = mutationList[i]
        obj[type] = function(payload){
            this.$store.commit(type,payload);
        }
    }
    return obj
}

const mapActions = actionList=>{
    let obj = {};
    for (let i = 0; i < actionList.length; i++) {
        let type = actionList[i]
        obj[type] = function(payload){
            this.$store.dispatch(type,payload);
        }
    }
    return obj
}
// 六.区分mutation和action
this._committing = false;
 _withCommitting(fn) {
    let committing = this._committing;
    this._committing = true; // 在函数调用前 表示_committing为true
    fn();
    this._committing = committing;
}
if (store.strict) {
    // 只要状态一变化会立即执行,在状态变化后同步执行
    store._vm.$watch(() => store._vm._data.$$state, () => {
        console.assert(store._committing, '在mutation之外更改了状态')
    }, { deep: true, sync: true });
}
// 严格模式下增加同步watcher，监控状态变化

store._withCommitting(() => {
    mutation.call(store, getState(store, path), payload); // 这里更改状态
})
// 只有通过mutation更改状态，断言才能通过

replaceState(newState) { // 用最新的状态替换掉
    this._withCommitting(() => {
        this._vm._data.$$state = newState;
    })
}
store._withCommitting(() => {
    Vue.set(parent, path[path.length - 1], module.state);
})
// 内部更改状态属于正常更新,所以也需要用_withCommitting进行包裹