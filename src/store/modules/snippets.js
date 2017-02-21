import env from '../../app-data/env';
import { SNIPPETS } from '../mutation-types';
import apiHelper from '../../utils/apiHelper';
import snippetsSorter, { DEFAULT_SORT, SORT } from '../../utils/snippets-sorter';

import actions from '../actions/snippets-actions';
import mockActions from '../actions/snippets-actions-mock';


export default {
  state: {
    snippetsRefreshing: false,
    snippets: [],
    currentSearch: {
      title: '',
      tags: ''
    },
    sortBy: DEFAULT_SORT,
    sortAsc: false
  },


  getters: {
    snippetsRefreshing(state) {
      return state.snippetsRefreshing;
    },

    snippets(state) {
      return state.snippets;
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
      state.currentSearch = {
        title: '',
        tags: ''
      };
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
      state.snippets = snippetsSorter.sort(snippets, state.sortBy, state.sortAsc);
      state.currentSearch = {
        title: '',
        tags: ''
      };
    },

    [SNIPPETS.FETCH_BY_SEARCH](state, { snippets, search }) {
      state.currentSearch = search;
      state.snippets = snippetsSorter.sort(snippets, state.sortBy, state.sortAsc);
    },

    /*=============================================
     = Snippets creating/editing
     =============================================*/
    [SNIPPETS.CREATE](state, snippet) {
      state.snippets.push(snippet);
      state.snippets = snippetsSorter.sort(state.snippets, state.sortBy, state.sortAsc);
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
      state.snippets = snippetsSorter.sort(state.snippets, state.sortBy, state.sortAsc);
    },

    [SNIPPETS.DELETE](state, snippetId) {
      state.snippets = state.snippets.filter(
        s => s.id !== snippetId
      );
      state.snippets = snippetsSorter.sort(state.snippets, state.sortBy, state.sortAsc);
    },

    /*=============================================
     = Snippets sorting
     =============================================*/
    [SNIPPETS.SORT_BY](state, { sortBy, sortAsc }) {
      state.sortBy = sortBy;
      state.sortAsc = sortAsc;
      state.snippets = snippetsSorter.sort(state.snippets, state.sortBy, state.sortAsc);
    },

    /*=============================================
     = Tag manipulation
     =============================================*/
    [SNIPPETS.ADD_TAG](state, { snippetId, tag }) {
      const snippet = apiHelper.findRecordById(state.snippets, snippetId);
      if (snippet) {
        // check if this Snippet already has the specified Tag on it; if so, do nothing
        const newTagId = tag._tag.id;
        snippet.tags.forEach((t) => {
          if (t.id === newTagId) {
            return;
          }
        });
        snippet.tags.push(tag);
        snippetsSorter.sortTagsOnSnippet(snippet);
      }
    },

    [SNIPPETS.REMOVE_TAG](state, { snippetId, tagId }) {
      const snippet = apiHelper.findRecordById(state.snippets, snippetId);
      if (snippet) {
        snippet.tags = snippet.tags.filter((tag) => {
          return tag._tag.id !== tagId;
        });
      }
    }
  },


  actions: env.isTesting() ? mockActions : actions
};
