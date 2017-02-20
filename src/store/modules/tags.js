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


  actions: {
    /**
     * Initializes the collection of User's Tags. If the list has already been populated,
     * this will simply return said list. Otherwise, a call the API will be made.
     *
     * We want to have the full list available to the User,
     * so this method should be called upon loading the app.
     */
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
        // make sure we have a valid auth token
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

    /**
     * Adds a tag to a Snippet, either by providing the ID of an existing Tag,
     * or by providing a 'tagTitle' property to create a new Tag.
     *
     *    tagId: (optional) The ID number of the existing tag to use
     *    snippetId: (required) The ID number of the Snippet
     *    tagTitle: (optional) The title to use for creating a new Tag
     */
    addTagToSnippet({ getters, dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        // make sure we have a valid auth token
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
          return;
        }

        // a 'tagTitle' prop shows that we are creating Tag, rather than using existing
        const creatingNewtag = payload.tagTitle !== undefined;
        // build the payload for the request
        // leave 'tag_title' empty if none was provided
        const requestPayload = {
          _tag: payload.tagId,
          _snippet: payload.snippetId,
          tag_title: payload.tagTitle || ''
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
              const tagData = {
                snippetId: payload.snippetId,
                tag: { ...res.body }
              };
              // if we created a new Tag with this request, add it to the local store
              if (creatingNewtag) {
                commit(TAGS.CREATE_SUCCESS, tagData);
              }
              dispatch('addTagToLocalSnippet', tagData);
              commit(TAGS.AJAX_END);
              resolve(res.body);
            }
          });
      });
    },

    /**
     * Removes an existing Tag to an existing Snippet (but does not delete the Snippet).
     * Payload should be an object with the following props:
     *    tagId: The ID number of the tag
     *    snippetId: The ID number of the Snippet
     */
    removeTagFromSnippet({ getters, dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        // make sure we have a valid auth token
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
    },

    deleteTag({ getters, commit }, tagId) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        commit(TAGS.AJAX_BEGIN);
        request
          .delete(apiUrls.tagsDelete + `${tagId}/`)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              commit(TAGS.AJAX_END);
              reject('There was an error deleting the Tag.');
            } else {
              commit(TAGS.DELETE_SUCCESS, tagId);
              commit(TAGS.AJAX_END);
              resolve(res.body);
            }
          });
      });
    }
  }
};
