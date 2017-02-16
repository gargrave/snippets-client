import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import { routes } from 'src/routes';
import { localUrls } from 'src/app-data/urls';
import TestComponent from 'src/components/snippets/components/NewSnippetCard';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({ routes });


function getComponent(propsData) {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ router, propsData }).$mount();
}


describe('NewSnippetCard.vue', () => {
  describe('click handler', () => {

    it('should be a funciton named "onClick"', () => {
      const vm = getComponent({ working: true });

      expect(vm.onClick).to.be.a('function');
    });

    it('should do nothing if "working" state is true', () => {
      const vm = getComponent({ working: true });
      const originalUrl = vm.$route.path;

      vm.$el.click();
      expect(vm.$route.path).to.equal(originalUrl);
    });

    it('should route to "new snippet page" if "working" state is false', () => {
      const vm = getComponent({ working: false });
      const expectedUrl = localUrls.snippetCreate;

      vm.$el.click();
      expect(vm.$route.path).to.equal(expectedUrl);
    });

  });
});
