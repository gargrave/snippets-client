import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {SNIPPETS} from '../mutation-types';
import apiHelper from '../../utils/apiHelper';


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

    [SNIPPETS.UPDATE](state, {snippet, removeAfterUpdate}) {
      if (removeAfterUpdate) {
        state.snippets = [...state.snippets.filter(
          s => s.id !== snippet.id
        )];
      } else {
        state.snippets = [...state.snippets.filter(
          s => s.id !== snippet.id
        ), snippet];
      }
    },

    [SNIPPETS.DELETE](state, snippetId) {
      state.snippets = state.snippets.filter(
        s => s.id !== snippetId
      );
    },
  },


  actions: {
    /**
     * Fetches the full list of user's Snippets from the API.
     */
    fetchSnippets({getters, commit}, alternateUrl) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        const url = alternateUrl || apiUrls.snippets;
        request
          .get(url)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              reject('There was an error loading your Snippets.');
            } else {
              commit(SNIPPETS.FETCH_ALL, res.body);
              resolve(res.body);
            }
          });
      });
    },

    fetchStarredSnippets({dispatch, commit}) {
      return dispatch('fetchSnippets', apiUrls.starredSnippets);
    },

    fetchArchivedSnippets({dispatch, commit}) {
      return dispatch('fetchSnippets', apiUrls.archivedSnippets);
    },

    /**
     * Returns the list of user's Snippets. If the Snippets have already loaded,
     * this cached version will be returned. Otherwise, a chained call will be
     * made to the API.
     *
     * This is useful for operations that need to make sure the Snippets have been
     * loaded before proceeding (e.g. 'find by ID').
     */
    getCachedOrFetchSnippets({state, dispatch, commit}) {
      return new Promise((resolve, reject) => {
        if (state.snippets.length) {
          resolve(state.snippets);
        } else {
          dispatch('fetchSnippets')
            .then((res) => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        }
      });
    },

    /**
     * Finds and returns an individual Snippet based on the specified ID.
     * Note that if the full Snippets list has not been loaded yet, a chained
     * API call will be made first to do so.
     */
    findSnippet({state, dispatch, commit}, snippetId) {
      return new Promise((resolve, reject) => {
        dispatch('getCachedOrFetchSnippets')
          .then((res) => {
            const snippet = apiHelper.findRecordById(state.snippets, snippetId);
            if (snippet) {
              resolve(snippet);
            } else {
              reject(`No Snippet found with id: ${snippetId}.`);
            }
          }, (err) => {
            reject('There was an error loading your Snippets.');
          });
      });
    },

    createSnippet({getters, commit}, snippet) {
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

    updateSnippet({getters, commit}, {snippet, removeAfterUpdate}) {
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
              const snippet = res.body;
              commit(SNIPPETS.UPDATE, {snippet, removeAfterUpdate});
              resolve(snippet);
            }
          });
      });
    },

    deleteSnippet({getters, commit}, snippetId) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .delete(apiUrls.snippets + `${snippetId}/`)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              reject('There was an error deleting the Snippet.');
            } else {
              commit(SNIPPETS.DELETE, snippetId);
              resolve(res.body);
            }
          });
      });
    }
  }
};
