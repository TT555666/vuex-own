import Vue from "vue";
import Vuex from './vuex'
// import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    a: {
      modules: {
        b: {
          state: {
            age: 520,
          },
          getters: {
            myAges(state) {
              return state.age + 10;
            },
          },
          mutations: {
            synChange1(state, payload) {
              state.age += payload;
            },
          },
          actions: {
            asynChange({ commit }, payload) {
              setTimeout(() => {
                commit("synChange", payload);
              }, 500);
            },
          },
          namespaced: true,
        },
      },
      state: {
        age: 150,
      },
      getters: {
        myAgez(state) {
          return state.age + 10;
        },
      },
      namespaced: true,

      mutations: {
        synChange(state, payload) {
          state.age += payload;
        },
      },
      actions: {
        asynChange({ commit }, payload) {
          setTimeout(() => {
            commit("synChange", payload);
          }, 500);
        },
      },
    },
  },
  state: {
    age: 10,
  },
  getters: {
    myAge(state) {
      return state.age + 10;
    },
  },
  mutations: {
    synChange(state, payload) {
      state.age += payload;
    },
  },
  actions: {
    asynChange({ commit }, payload) {
      setTimeout(() => {
        commit("synChange", payload);
      }, 500);
    },
  },
  namespaced: true,
});
