import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {SNIPPETS} from '../mutation-types';


export default {
  state: {
    snippets: []
  },

  getters: {
    snippets(state) {
      return state.snippets;
    }
  },


  mutations: {
    [SNIPPETS.SNIPPETS_FETCH_ALL](state, snippets) {
      state.snippets = snippets;
    }
  },

  actions: {
    fetchSnippets({commit}, authToken) {
      return new Promise((resolve, reject) => {
        request
          .get(apiUrls.snippets)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              const error = err.response.body;
              reject(error);
            } else {
              commit(SNIPPETS.SNIPPETS_FETCH_ALL, res.body);
              resolve(res.body);
            }
          });
      });
    }
  }
};
