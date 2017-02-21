import { TAGS } from '../mutation-types';
import mockData from '../mock-data/tags-mock';


export default {
  initTags({ getters, dispatch }) {
    if (getters.tags.length) {
      return new Promise((resolve, reject) => {
        resolve(getters.tags);
      });
    } else {
      return dispatch('fetchTags');
    }
  },

  fetchTags({ getters, commit }) {
    return new Promise((resolve, reject) => {
      commit(TAGS.AJAX_BEGIN);
      const tags = mockData.tags;
      commit(TAGS.FETCH_SUCCESS, tags);
      commit(TAGS.AJAX_END);
      resolve(tags);
    });
  },

  addTagToSnippet({ getters, dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      // a 'tagTitle' prop shows that we are creating Tag, rather than using existing
      const creatingNewtag = payload.tagTitle !== undefined;

      const tag = creatingNewtag ? {
        id: mockData.tags[mockData.tags.length - 1].id + 1,
        title: payload.tagTitle
      } : mockData.tags.find((t) => {
        return t.id === payload.tagId;
      });

      const tagData = {
        snippetId: payload.snippetId,
        tag: {
          id: 0,
          _tag: tag
        }
      };

      commit(TAGS.AJAX_BEGIN);
      if (creatingNewtag) {
        commit(TAGS.CREATE_SUCCESS, tagData);
      }
      dispatch('addTagToLocalSnippet', tagData);
      commit(TAGS.AJAX_END);
      resolve(tagData);
    });
  },

  removeTagFromSnippet({ getters, dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(TAGS.AJAX_BEGIN);
      dispatch('removeTagFromLocalSnippet', payload);
      commit(TAGS.AJAX_END);
      resolve(payload);
    });
  },

  deleteTag({ getters, commit }, tagId) {
    return new Promise((resolve, reject) => {
      commit(TAGS.AJAX_BEGIN);
      commit(TAGS.DELETE_SUCCESS, tagId);
      commit(TAGS.AJAX_END);
      resolve(tagId);
    });
  }
};
