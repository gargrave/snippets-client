import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {SNIPPETS} from '../mutation-types';


export default {
  state: {
    snippets: []
  },


  getters: {
    snippets(state) {
      // TODO: this is only a temporary sorting measure
      return state.snippets.sort(
        (a, b) => a.created > b.created ? -1 : 1
      );
    }
  },


  mutations: {
    [SNIPPETS.FETCH_ALL](state, snippets) {
      state.snippets = snippets;
    },

    [SNIPPETS.CREATE](state, snippet) {
      state.snippets.push(snippet);
    },

    [SNIPPETS.UPDATE](state, snippet) {
      // state.snippets.push(snippet);
      state.snippets = [...state.snippets.filter(
        s => s.id !== snippet.id
      ), snippet];
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
              reject('There was an error fetching your Snippets.');
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
              reject('There was an error saving the Snippet.');
            } else {
              commit(SNIPPETS.CREATE, res.body);
              resolve(res.body);
            }
          });
      });
    },

    updateSnippet({commit, getters}, snippet) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .put(apiUrls.snippets + `${snippet.id}/`)
          .set('Authorization', `Token ${authToken}`)
          .send(snippet)
          .end((err, res) => {
            if (err) {
              reject('There was an error updating the Snippet.');
            } else {
              commit(SNIPPETS.UPDATE, res.body);
              resolve(res.body);
            }
          });
      });
    }
  }
};
