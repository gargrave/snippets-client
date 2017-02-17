import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import { routes } from 'src/routes';
import { store } from 'src/store/store';
import { SNIPPETS } from 'src/store/mutation-types';
import snippetsMock from 'src/store/mock-data/snippets-mock';
import { localUrls } from 'src/app-data/urls';

import TestComponent from 'src/components/snippets/components/SnippetListDetail';
import snippetStyles from 'src/components/snippets/helpers/snippetStyles';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({ routes });


function getComponent(propsData) {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ router, store, propsData }).$mount();
}


describe('SnippetListDetail.vue', () => {

  const testSnippet = snippetsMock.snippets[0];
  const props = {
    snippet: testSnippet,
    working: false
  };

  describe('Basic Display', () => {
    it('should correctly display the Snippet\'s title', () => {
      const vm = getComponent(props);
      const titleEl = vm.$el.querySelector('.snippet-card-header > .snippet-detail-title');
      const titleStr = titleEl.textContent.trim();

      expect(titleStr).to.equal(testSnippet.title);
    });

    it('should correctly display the Snippet\'s URL', () => {
      const vm = getComponent(props);
      const urlEl = vm.$el.querySelector('.snippet-card-body > .snippet-detail-url');
      const urlStr = urlEl.textContent.trim();

      expect(urlStr).to.equal(testSnippet.url);
    });

    it('should correctly display the Snippet\'s tags', () => {
      const vm = getComponent(props);
      const tagList = vm.$el.querySelectorAll('.el-tag-wrapper');

      expect(tagList.length).to.equal(testSnippet.tags.length);
    });

    it('should contain the correct classes for the Snippet\'s color', () => {
      const vm = getComponent(props);
      const classes = vm.$el.classList;
      const expectedClasses = snippetStyles.snippetCard(testSnippet).split(' ');

      expectedClasses.forEach((c) => {
        expect(classes.contains(c)).to.equal(true);
      });
    });
  });


  describe('Contols', () => {
    it('should correctly show the "non-pinned" status', () => {
      const vm = getComponent(props);
      const btn = vm.$el.querySelector('.snippet-control-pin');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.pinned);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unpinned);

      expect(hasActiveIconClass).to.equal(true);
      expect(hasInactiveIconClass).to.equal(true);
    });

    it('should correctly show the "pinned" status', () => {
      const updatedProps = {
        snippet: snippetsMock.pinnedSnippet,
        working: false
      };
      const vm = getComponent(updatedProps);
      const btn = vm.$el.querySelector('.snippet-control-pin');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.pinned);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unpinned);

      expect(hasActiveIconClass).to.equal(true);
      expect(hasInactiveIconClass).to.equal(false);
    });

    it('should correctly show the "non-starred" status', () => {
      const vm = getComponent(props);
      const btn = vm.$el.querySelector('.snippet-control-star');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.starred);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unstarred);

      expect(hasActiveIconClass).to.equal(false);
      expect(hasInactiveIconClass).to.equal(true);
    });

    it('should correctly show the "starred" status', () => {
      const updatedProps = {
        snippet: snippetsMock.starredSnippet,
        working: false
      };
      const vm = getComponent(updatedProps);
      const btn = vm.$el.querySelector('.snippet-control-star');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.starred);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unstarred);

      expect(hasActiveIconClass).to.equal(true);
      expect(hasInactiveIconClass).to.equal(false);
    });

    it('should correctly show the "non-archived" status', () => {
      const vm = getComponent(props);
      const btn = vm.$el.querySelector('.snippet-control-archive');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.archived);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unarchived);

      expect(hasActiveIconClass).to.equal(false);
      expect(hasInactiveIconClass).to.equal(true);
    });

    it('should correctly show the "archived" status', () => {
      const updatedProps = {
        snippet: snippetsMock.archivedSnippet,
        working: false
      };
      const vm = getComponent(updatedProps);
      const btn = vm.$el.querySelector('.snippet-control-archive');
      const hasActiveIconClass = btn.classList.contains(snippetStyles.icons.archived);
      const hasInactiveIconClass = btn.classList.contains(snippetStyles.icons.unarchived);

      expect(hasActiveIconClass).to.equal(true);
      expect(hasInactiveIconClass).to.equal(false);
    });
  });
});
