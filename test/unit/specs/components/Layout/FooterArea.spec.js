import Vue from 'vue';
import FooterArea from '@/components/Layout/FooterArea';

describe('FooterArea.vue', () => {
  it('should render computed copyright contents', () => {
    const Constructor = Vue.extend(FooterArea);
    const vm = new Constructor().$mount();
    const year = new Date().getFullYear();
    expect(vm.$el.querySelector('.text-right p').textContent)
      .toEqual(`\u00A9 iFish Group ${year}`);
  });
});
