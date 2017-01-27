import request from 'superagent';

import { apiUrls } from '../../app-data/urls';
import { SNIPPETS } from '../mutation-types';
import apiHelper from '../../utils/apiHelper';
import snippetsSorter, { DEFAULT_SORT, SORT } from '../../utils/snippets-sorter';


export default {
  state: {
    snippetsRefreshing: false,
    snippets: [],
    currentSearch: '',
    sortBy: DEFAULT_SORT,
    sortAsc: false
  },


  getters: {
    snippetsRefreshing(state) {
      return state.snippetsRefreshing;
    },

    snippets(state) {
      return snippetsSorter.sort(state.snippets, state.sortBy, state.sortAsc);
    },

    currentSearch(state) {
      return state.currentSearch;
    },

    sortBy(state) {
      return state.sortBy;
    },

    sortAsc(state) {
      return state.sortAsc;
    }
  },


  mutations: {
    [SNIPPETS.CLEAR_ALL](state, snippets) {
      state.snippets = [];
      state.currentSearch = '';
    },

    /*=============================================
     = Snippets fetching
     =============================================*/
    [SNIPPETS.FETCH_BEGIN](state) {
      state.snippetsRefreshing = true;
    },

    [SNIPPETS.FETCH_END](state) {
      state.snippetsRefreshing = false;
    },

    [SNIPPETS.FETCH_ALL](state, snippets) {
      state.snippets = snippets;
      state.currentSearch = '';
    },

    [SNIPPETS.FETCH_BY_SEARCH](state, { snippets, search }) {
      state.snippets = snippets;
      state.currentSearch = search;
    },

    /*=============================================
     = Snippets creating/editing
     =============================================*/
    [SNIPPETS.CREATE](state, snippet) {
      state.snippets.push(snippet);
    },

    [SNIPPETS.UPDATE](state, { snippet, removeAfterUpdate }) {
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

    /*=============================================
     = Snippets sorting
     =============================================*/
    [SNIPPETS.SORT_BY](state, { sortBy, sortAsc }) {
      state.sortBy = sortBy;
      state.sortAsc = sortAsc;
    },
  },


  actions: {
    /**
     * Fetches the full list of user's Snippets from the API.
     */
    fetchSnippets({ getters, commit }, alternateUrl) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }
        commit(SNIPPETS.CLEAR_ALL);
        commit(SNIPPETS.FETCH_BEGIN);

        const url = alternateUrl || apiUrls.snippets;
        request
          .get(url)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              commit(SNIPPETS.FETCH_END);
              reject('There was an error loading your Snippets.');
            } else {
              commit(SNIPPETS.FETCH_ALL, res.body);
              commit(SNIPPETS.FETCH_END);
              resolve(res.body);
            }
          });
      });
    },

    fetchStarredSnippets({ dispatch, commit }) {
      return dispatch('fetchSnippets', apiUrls.starredSnippets);
    },

    fetchArchivedSnippets({ dispatch, commit }) {
      return dispatch('fetchSnippets', apiUrls.archivedSnippets);
    },

    fetchSnippetsBySearch({ getters, commit }, searchString) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }
        commit(SNIPPETS.CLEAR_ALL);
        commit(SNIPPETS.FETCH_BEGIN);

        const url = apiUrls.snippets;
        request
          .get(url)
          .query({ search: searchString })
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              commit(SNIPPETS.FETCH_END);
              reject('There was an error loading your Snippets.');
            } else {
              commit(SNIPPETS.FETCH_BY_SEARCH, {
                snippets: res.body,
                search: searchString
              });
              commit(SNIPPETS.FETCH_END);
              resolve(res.body);
            }
          });
      });
    },

    /**
     * Returns the list of user's Snippets. If the Snippets have already loaded,
     * this cached version will be returned. Otherwise, a chained call will be
     * made to the API.
     *
     * This is useful for operations that need to make sure the Snippets have been
     * loaded before proceeding (e.g. 'find by ID').
     */
    getCachedOrFetchSnippets({ state, dispatch, commit }) {
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
     * Reqeusts an individual Snippet with the specified ID from the API.
     */
    fetchSnippetById({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        const url = `${apiUrls.snippets}${id}`;
        request
          .get(url)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              reject(`No Snippet found with id: ${id}.`);
            } else {
              resolve(res.body);
            }
          });
      });
    },

    /**
     * Finds and returns an individual Snippet based on the specified ID.
     * Note that if the Snippet cannot be found in the local list, a call to
     * the API will be made requesting the single Snippet instance.
     */
    findSnippet({ state, dispatch, commit }, snippetId) {
      return new Promise((resolve, reject) => {
        dispatch('getCachedOrFetchSnippets')
          .then((res) => {
            // check for a copy of this Snippet in our local data
            let snippet = apiHelper.findRecordById(state.snippets, snippetId);
            if (snippet) {
              resolve(snippet);
            } else {
              // if the Snippet is not stored locally, make a call to the API
              dispatch('fetchSnippetById', snippetId)
                .then((snippet) => {
                  resolve(snippet);
                }, (err2) => {
                  reject(err2);
                });
            }
          }, (err) => {
            reject('There was an error loading your Snippets.');
          });
      });
    },

    createSnippet({ getters, commit }, snippet) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .post(apiUrls.snippets)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
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

    updateSnippet({ getters, commit }, { snippet, removeAfterUpdate }) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .put(apiUrls.snippets + `${snippet.id}/`)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .send(snippet)
          .end((err, res) => {
            if (err) {
              reject('There was an error updating the Snippet.');
            } else {
              const snippet = res.body;
              commit(SNIPPETS.UPDATE, { snippet, removeAfterUpdate });
              resolve(snippet);
            }
          });
      });
    },

    deleteSnippet({ getters, commit }, snippetId) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request
          .delete(apiUrls.snippets + `${snippetId}/`)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              reject('There was an error deleting the Snippet.');
            } else {
              commit(SNIPPETS.DELETE, snippetId);
              resolve(res.body);
            }
          });
      });
    },

    /** Simply clears the local list of Snippets; should be called when logging out */
    clearLocalSnippets({ commit }) {
      commit(SNIPPETS.CLEAR_ALL);
    },

    setSort({ commit }, { sortBy, sortAsc }) {
      commit(SNIPPETS.SORT_BY, { sortBy, sortAsc });
    }
  }
};
