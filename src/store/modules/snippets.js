import request from 'superagent';

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
      // TODO: use the URL constants
      return new Promise((resolve, reject) => {
        const URL = 'http://localhost:8000/api/v1/snippets/';

        request
          .get(URL)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              const error = err.response.body;
              // dispatch(fetchSnippetsError(error));
              reject(error);
            } else {
              // dispatch(fetchSnippetsSuccess(snippets));
              commit(SNIPPETS.SNIPPETS_FETCH_ALL, res.body);
              resolve(res.body);
            }
          });
      });
    }
  }
};
