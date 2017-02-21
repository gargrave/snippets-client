import Vue from 'vue';
import ElementUI from 'element-ui';

import { store } from 'src/store/store';
import { PROFILE } from 'src/store/mutation-types';

import snippetData from 'src/components/snippets/helpers/snippetData';
import TestComponent from 'src/components/snippets/components/panel-controls/SnippetColorPicker';

Vue.use(ElementUI);


function getComponent() {
  const Ctor = Vue.extend(TestComponent);
  return new Ctor({ store }).$mount();
}


describe('SnippetColorPicker.vue', () => {
  it('should contain a selector for each color', () => {
    const vm = getComponent();
    const list = vm.$el.querySelectorAll('.color-picker-item');
    const expectedCount = snippetData.VALID_COLORS.length;

    expect(list.length).to.equal(expectedCount);
  });

  it('should emit an event with color data when a color is clicked', () => {
    const vm = getComponent();
    const blueClick = vm.$el.querySelector('.color-picker-click-blue');

    let hasBeenClicked = false;
    let colorValue = '';

    vm.$on('colorSelected', (color) => {
      hasBeenClicked = true;
      colorValue = color;
    });
    blueClick.click();

    expect(hasBeenClicked).to.equal(true);
    expect(colorValue).to.equal('blue');
  });

  it('should display category names when they are defined', () => {
    // set up mock categories
    const RED_CATEGORY = 'RED_CATEGORY';
    const GREEN_CATEGORY = 'GREEN_CATEGORY';
    store.commit(PROFILE.FETCH_SUCCESS, {
      categories: {
        white: '',
        red: RED_CATEGORY,
        green: GREEN_CATEGORY,
        blue: '',
        yellow: '',
        orange: '',
        teal: '',
        gray: '',
      }
    });

    const vm = getComponent();
    const tealText = vm.$el.querySelector('.color-picker-click-teal').textContent;
    const redText = vm.$el.querySelector('.color-picker-click-red').textContent;
    const greenText = vm.$el.querySelector('.color-picker-click-green').textContent;

    expect(tealText).to.equal('');
    expect(redText).to.equal(RED_CATEGORY);
    expect(greenText).to.equal(GREEN_CATEGORY);
  });
});
