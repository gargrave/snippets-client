import env from '../../app-data/env';
import { TAGS } from '../mutation-types';

import actions from '../actions/tags-actions';
import mockActions from '../actions/tags-actions-mock';


export default {
  state: {
    tagsAjaxPending: false,
    tags: []
  },


  getters: {
    tagsAjaxPending(state) {
      return state.tagsAjaxPending;
    },

    /** Returns the list of Tags sorted alphabetically */
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

    /*=============================================
     = Tags creating/editing
     =============================================*/
    [TAGS.CREATE_SUCCESS](state, payload) {
      // check if the store already has the specified Tag on it; if so, do nothing
      const newTagId = payload.tag._tag.id;
      state.tags.forEach((tag) => {
        if (tag.id === newTagId) {
          return;
        }
      });
      state.tags.push(payload.tag._tag);
    },

    [TAGS.DELETE_SUCCESS](state, tagId) {
      state.tags = state.tags.filter(
        t => t.id !== tagId
      );
      state.tags.sort();
    },
  },


  actions: env.isTesting() ? mockActions : actions
};
