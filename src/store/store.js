import Vue from 'vue';
import Vuex from 'vuex';

import AppData from './modules/app-data';
import User from './modules/user';
import Snippets from './modules/snippets';


Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    AppData,
    User,
    Snippets
  }
});
