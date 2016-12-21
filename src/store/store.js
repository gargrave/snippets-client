import Vue from 'vue';
import Vuex from 'vuex';

import appData from './modules/app-data';
import user from './modules/user';


Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    appData,
    user
  }
});
