import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import { routes } from 'src/routes';
import { store } from 'src/store/store';
import { SNIPPETS } from 'src/store/mutation-types';
import snippetsMock from 'src/store/mock-data/snippets-mock';
import { localUrls } from 'src/app-data/urls';

import TestComponent from 'src/components/snippets/components/SearchResultsDisplay';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({ routes });


function getComponent() {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ router, store }).$mount();
}


describe('SearchResultsDisplay.vue', () => {

  describe('Reset Method', () => {
    it('should be a funciton named "onResetClick"', () => {
      const vm = getComponent();
      expect(vm.onResetClick).to.be.a('function');
    });

    it('should emit a "clearSearch" event when button is clicked', () => {
      // update store with full mock Snippets list
      // (search data does not matter here, but at least one field must not be blank)
      store.commit(SNIPPETS.FETCH_BY_SEARCH, {
        snippets: snippetsMock.snippets,
        search: {
          title: '-',
          tags: ''
        }
      });

      const vm = getComponent();
      let eventOccurred = false;

      vm.$on('clearSearch', () => {
        eventOccurred = true;
      });

      const btn = vm.$el.querySelector('.reset-search-button');
      btn.click();
      expect(eventOccurred).to.equal(true);
    });
  });


  describe('Results Display', () => {
    it('should display the correct count of results', () => {
      // update store with full mock Snippets list
      // (search data does not matter here, but at least one field must not be blank)
      store.commit(SNIPPETS.FETCH_BY_SEARCH, {
        snippets: snippetsMock.snippets,
        search: {
          title: '-',
          tags: ''
        }
      });

      const vm = getComponent();
      const titleStr = vm.$el.querySelector('.search-results-title').textContent.toLowerCase().trim();
      const expectedCount = snippetsMock.snippets.length;
      const expectedStr = `Showing ${expectedCount} Matches`.toLowerCase();

      expect(titleStr).to.equal(expectedStr);
    });

    it('should display title query when searching by title', () => {
      const searchTitle = 'css';

      store.commit(SNIPPETS.FETCH_BY_SEARCH, {
        snippets: snippetsMock.snippets,
        search: {
          title: searchTitle,
          tags: ''
        }
      });

      const vm = getComponent();
      const searchByTitleStr = vm.$el.querySelector('#current-search-title').textContent.toLowerCase().trim();
      const expectedStr = `Title includes: ${searchTitle}`.toLowerCase();

      expect(searchByTitleStr.toLowerCase()).to.equal(expectedStr);
    });

    it('should display tags list when searching by tags', () => {
      const testSearchTags = ['css', 'dev'];

      store.commit(SNIPPETS.FETCH_BY_SEARCH, {
        snippets: snippetsMock.snippets,
        search: {
          title: '',
          tags: testSearchTags.join(',')
        }
      });

      const vm = getComponent();
      const searchByTagsList = vm.$el.querySelectorAll('#current-search-tags > span.el-tag-wrapper');

      expect(searchByTagsList.length).to.equal(testSearchTags.length);
    });
  });
});
