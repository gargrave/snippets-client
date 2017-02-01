import request from 'superagent';

import { apiUrls } from '../../app-data/urls';
import { TAGS } from '../mutation-types';


export default {
  state: {
    tagsAjaxPending: false,
    tags: []
  },


  getters: {
    tags(state) {
      return state.tags;
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
  }
};
