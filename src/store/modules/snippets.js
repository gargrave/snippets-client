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
    [SNIPPETS.FETCH_ALL](state, snippets) {
      state.snippets = snippets;
    },

    [SNIPPETS.CREATE](state, snippet) {
      state.snippets.push(snippet);
    }
  },

  actions: {
    fetchSnippets({commit, getters}) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .get(apiUrls.snippets)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              const error = err.response.body;
              reject('There was an error fetching Snippets.');
            } else {
              commit(SNIPPETS.FETCH_ALL, res.body);
              resolve(res.body);
            }
          });
      });
    },

    createSnippet({commit, getters}, snippet) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .post(apiUrls.snippets)
          .set('Authorization', `Token ${authToken}`)
          .send(snippet)
          .end((err, res) => {
            if (err) {
              const error = err.response.body;
              reject('There was an error saving the Snippet.');
            } else {
              commit(SNIPPETS.CREATE, res.body);
              resolve(res.body);
            }
          });
      });
    }
  }
};
