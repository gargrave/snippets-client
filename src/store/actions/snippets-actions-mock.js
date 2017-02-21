import { SNIPPETS } from '../mutation-types';
import apiHelper from '../../utils/apiHelper';
import searchHelper from '../../components/snippets/helpers/snippetSearchHelper';
import mockData from '../mock-data/snippets-mock';


export default {
  fetchSnippets({ getters, commit }, alternateUrl) {
    return new Promise((resolve, reject) => {
      commit(SNIPPETS.CLEAR_ALL);
      commit(SNIPPETS.FETCH_BEGIN);

      const snippets = mockData.snippets;
      commit(SNIPPETS.FETCH_ALL, snippets);
      commit(SNIPPETS.FETCH_END);
      resolve(snippets);
    });
  },

  fetchStarredSnippets({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      commit(SNIPPETS.CLEAR_ALL);
      commit(SNIPPETS.FETCH_BEGIN);

      const snippets = mockData.snippets.filter((s) => {
        return s.starred === true;
      });
      commit(SNIPPETS.FETCH_ALL, snippets);
      commit(SNIPPETS.FETCH_END);
      resolve(snippets);
    });
  },

  fetchArchivedSnippets({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      commit(SNIPPETS.CLEAR_ALL);
      commit(SNIPPETS.FETCH_BEGIN);

      const snippets = mockData.snippets.filter((s) => {
        return s.archived === true;
      });
      commit(SNIPPETS.FETCH_ALL, snippets);
      commit(SNIPPETS.FETCH_END);
      resolve(snippets);
    });
  },

  fetchSnippetsBySearch({ getters, commit }, payload) {
    return new Promise((resolve, reject) => {
      const requestPayload = searchHelper.buildRequestPayload(payload);
      commit(SNIPPETS.CLEAR_ALL);
      commit(SNIPPETS.FETCH_BEGIN);

      const foundSnippets = mockData.snippets.filter((s) => {
        return s.title.indexOf(requestPayload.title) !== -1;
      });

      commit(SNIPPETS.FETCH_BY_SEARCH, {
        snippets: foundSnippets,
        search: requestPayload
      });
      commit(SNIPPETS.FETCH_END);
      resolve(foundSnippets);
    });
  },

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

  fetchSnippetById({ state, getters, commit }, id) {
    return new Promise((resolve, reject) => {
      resolve(apiHelper.findRecordById(state.snippets, id));
    });
  },

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
      const newId = mockData.snippets[mockData.snippets.length - 1].id + 1;
      const newSnippet = snippetData.buildRecordData({
        id: newId,
        ...snippet
      });

      commit(SNIPPETS.CREATE, newSnippet);
      resolve(newSnippet);
    });
  },

  updateSnippet({ getters, commit }, { snippet, removeAfterUpdate }) {
    return new Promise((resolve, reject) => {
      commit(SNIPPETS.UPDATE, { snippet, removeAfterUpdate });
      resolve(snippet);
    });
  },

  deleteSnippet({ getters, commit }, snippetId) {
    return new Promise((resolve, reject) => {
      commit(SNIPPETS.DELETE, snippetId);
      resolve(snippetId);
    });
  },

  /** Simply clears the local list of Snippets; should be called when logging out */
  clearLocalSnippets({ commit }) {
    commit(SNIPPETS.CLEAR_ALL);
  },

  setSort({ commit }, { sortBy, sortAsc }) {
    commit(SNIPPETS.SORT_BY, { sortBy, sortAsc });
  },

  /*=============================================
   = Local state methods (i.e. no HTTP requests)
   =============================================*/
  addTagToLocalSnippet({ commit }, payload) {
    commit(SNIPPETS.ADD_TAG, payload);
  },

  removeTagFromLocalSnippet({ commit }, payload) {
    commit(SNIPPETS.REMOVE_TAG, payload);
  }
};
