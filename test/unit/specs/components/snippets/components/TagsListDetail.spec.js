import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import tagsMock from 'src/store/mock-data/tags-mock';

import TestComponent from 'src/components/snippets/components/TagsListDetail';

Vue.use(VueRouter);
Vue.use(ElementUI);


function getComponent(propsData) {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ propsData }).$mount();
}


describe('TagsListDetail.vue', () => {
  const testTag = tagsMock.tags[0];
  const props = {
    working: false,
    tag: testTag,
    onDeleteClick: () => {}
  };

  it('should display the correct tag title', () => {
    const vm = getComponent(props);
    const expectedTitle = testTag.title;
    const actualTitle = vm.$el.querySelector('.taglist-tag-title').textContent;

    expect(actualTitle).to.equal(expectedTitle);
  });

  it('should have a functional "delete" button that sends tag data', () => {
    let callbackCalled = false;
    const updatedProps = Object.assign({}, props);
    updatedProps.onDeleteClick = (tag) => {
      if (tag.title) {
        callbackCalled = true;
      }
    };

    const vm = getComponent(updatedProps);
    const button = vm.$el.querySelector('.taglist-tag-icon.taglist-tag-icon-delete');

    expect(button).to.not.equal(undefined);
    button.click();
    expect(callbackCalled).to.equal(true);
  });

  it ('should contain the "disabled" CSS class on buttons when working', () => {
    const updatedProps = Object.assign({}, props);
    updatedProps.working = true;

    const vm = getComponent(updatedProps);
    const button = vm.$el.querySelector('.taglist-tag-icon.taglist-tag-icon-delete');
    const containsClass = button.classList.contains('taglist-tag-icon-disabled');

    expect(containsClass).to.equal(true);
  });

  it ('should not contain the "disabled" CSS class on buttons when not working', () => {
    const vm = getComponent(props);
    const button = vm.$el.querySelector('.taglist-tag-icon.taglist-tag-icon-delete');
    const containsClass = button.classList.contains('taglist-tag-icon-disabled');

    expect(containsClass).to.equal(false);
  });
});
