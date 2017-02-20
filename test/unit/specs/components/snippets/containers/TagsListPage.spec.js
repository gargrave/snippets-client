import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import { store } from 'src/store/store';
import { TAGS } from 'src/store/mutation-types';
import tagsMock from 'src/store/mock-data/tags-mock';

import TestComponent from 'src/components/snippets/containers/TagsListPage';

Vue.use(VueRouter);
Vue.use(ElementUI);


function getComponent() {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ store }).$mount();
}


describe('TagsListPage.vue', () => {
  it('should display the correct number of tags', () => {
    store.commit(TAGS.FETCH_SUCCESS, tagsMock.tags);

    const vm = getComponent();
    const tagsList = vm.$el.querySelectorAll('.taglist-tag');
    const expectedLength = tagsMock.tags.length;

    expect(tagsList.length).to.equal(expectedLength);
  });
});
