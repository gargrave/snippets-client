import { APP } from '../mutation-types';


export default {
  state: {
    title: 'Snippets',
    build: ''
  },


  getters: {
    appTitle(state) {
      return state.title;
    },

    appBuild(state) {
      return `(${state.build})`;
    }
  },


  mutations: {
    [APP.SET_BUILD](state, build) {
      state.build = build;
    }
  },


  actions: {
    setBuild({commit}, build) {
      commit(APP.SET_BUILD, build);
    }
  }
};
