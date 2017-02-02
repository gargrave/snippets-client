import request from 'superagent';

import { apiUrls } from '../../app-data/urls';
import { TAGS } from '../mutation-types';


export default {
  state: {
    tagsAjaxPending: false,
    tags: []
  },


  getters: {
    tagsAjaxPending(state) {
      return state.tagsAjaxPending;
    },

    tags(state) {
      return state.tags.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
    },
  },


  mutations: {
    /*=============================================
     = Tags fetching
     =============================================*/
    [TAGS.AJAX_BEGIN](state) {
      state.tagsAjaxPending = true;
    },

    [TAGS.AJAX_END](state) {
      state.tagsAjaxPending = false;
    },

    [TAGS.FETCH_SUCCESS](state, tags) {
      state.tags = tags;
      state.tags.sort();
    },
  },


  actions: {
    initTags({ getters, dispatch }) {
      if (getters.tags.length) {
        return new Promise((resolve, reject) => {
          resolve(getters.tags);
        });
      } else {
        return dispatch('fetchTags');
      }
    },

    /**
     * Fetches the full list of user's Tags from the API.
     */
    fetchTags({ getters, commit }) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        commit(TAGS.AJAX_BEGIN);
        request
          .get(apiUrls.tags)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              commit(TAGS.AJAX_END);
              reject('There was an error loading your Tags.');
            } else {
              commit(TAGS.FETCH_SUCCESS, res.body);
              commit(TAGS.AJAX_END);
              resolve(res.body);
            }
          });
      });
    },

    addTagToSnippet({ getters, dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        const snippetId = payload.snippetId;
        const requestPayload = {
          _tag: payload.tagId,
          _snippet: snippetId
        };

        commit(TAGS.AJAX_BEGIN);
        request
          .post(apiUrls.tagsAdd)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .send(requestPayload)
          .end((err, res) => {
            if (err) {
              commit(TAGS.AJAX_END);
              reject('There was an error updating your Tags.');
            } else {
              const dispatchPayload = {
                snippetId,
                tag: res.body
              };
              dispatch('addTagToLocalSnippet', dispatchPayload);
              commit(TAGS.AJAX_END);
              resolve(res.body);
            }
          });
      });
    },

    removeTagFromSnippet({ getters, dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        const requestPayload = {
          tag_id: payload.tagId,
          snippet_id: payload.snippetId
        };

        commit(TAGS.AJAX_BEGIN);
        request
          .delete(apiUrls.tagsRemove)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .send(requestPayload)
          .end((err, res) => {
            if (err) {
              commit(TAGS.AJAX_END);
              reject('There was an error updating your Tags.');
            } else {
              dispatch('removeTagFromLocalSnippet', payload);
              commit(TAGS.AJAX_END);
              resolve(res.body);
            }
          });
      });
    }
  }
};
