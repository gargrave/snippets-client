import { APP } from '../mutation-types';


export default {
  state: {
    title: 'Snippets',
    breadcrumbTitle: ''
  },


  getters: {
    appTitle(state) {
      return state.title;
    },

    appBreadcrumbTitle(state) {
      return state.breadcrumbTitle;
    }
  },


  mutations: {
    [APP.SET_BREADCRUMB_TITLE](state, breadcrumbTitle) {
      state.breadcrumbTitle = breadcrumbTitle;
    }
  },


  actions: {
    setBreadcrumbTitle({ commit }, breadcrumbTitle) {
      commit(APP.SET_BREADCRUMB_TITLE, breadcrumbTitle);
    }
  }
};
