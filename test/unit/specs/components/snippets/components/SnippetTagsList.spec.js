import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import { routes } from 'src/routes';
import { localUrls } from 'src/app-data/urls';
import TestComponent from 'src/components/snippets/components/SnippetTagsList';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({ routes });


function getComponent(propsData) {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ router, propsData }).$mount();
}

/*=============================================
 = mock data
 =============================================*/
const tag0 = { _tag: { id: 0, title: 'test-tag-0' } };
const tag1 = { _tag: { id: 1, title: 'test-tag-1' } };
const tag2 = { _tag: { id: 2, title: 'test-tag-2' } };

const snippetWithNoTags = { tags: [] };
const snippetWithSingleTag = { tags: [tag0] };
const snippetWithMultipleTags = { tags: [tag0, tag1, tag2] };


/*=============================================
 = unit tests
 =============================================*/
describe('SnippetTagsList.vue', () => {

  describe('Click Handler', () => {

    it('should be a funciton named "onTagClicked"', () => {
      const vm = getComponent({ snippet: snippetWithSingleTag });
      expect(vm.onTagClicked).to.be.a('function');
    });

    it('should emit event with tag data when a tag is clicked', () => {
      const vm = getComponent({ snippet: snippetWithMultipleTags });
      const tagsList = vm.$el.querySelectorAll('.el-tag-wrapper');
      const expectedTagId = tag1._tag.id;
      const expectedTagTitle = tag1._tag.title;

      vm.$on('tagClicked', (tag, event) => {
        expect(tag.id).to.equal(expectedTagId);
        expect(tag.title).to.equal(expectedTagTitle);
      });
      tagsList[1].click();
    });

  });


  describe('Tags List Display', () => {

    it('should have no elements if snippet has a no tags', () => {
      const vm = getComponent({ snippet: snippetWithNoTags });
      let expectedErrorOccurred = false;
      try {
        const tagsList = vm.$el.querySelectorAll('.el-tag-wrapper');
      } catch (e) {
        expectedErrorOccurred = true;
      }

      expect(expectedErrorOccurred).to.equal(true);
    });

    it('should have a single elements if snippet has a single tag', () => {
      const vm = getComponent({ snippet: snippetWithSingleTag });
      const tagsList = vm.$el.querySelectorAll('.el-tag-wrapper');

      expect(tagsList.length).to.equal(1);
    });

    it('should have multiple elements if snippet has multiple tags', () => {
      const vm = getComponent({ snippet: snippetWithMultipleTags });
      const tagsList = vm.$el.querySelectorAll('.el-tag-wrapper');
      const expectedLength = snippetWithMultipleTags.tags.length;

      expect(tagsList.length).to.equal(expectedLength);
    });

  });
});
