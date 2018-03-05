import { createLocalVue, shallow } from 'vue-test-utils';
import Search from '@/components/Views/Common/Search';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import axios from './mocks/axios';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate);

describe('search.test.js', () => {
  let store;
  let getters;
  let cmp;

  beforeEach(() => {
    getters = {
      getConfig: () => [
        {
          searchUrl: '',
          featuredArticlesUrl: '',
          topArticlesUrl: '',
        },
      ],
    };

    store = new Vuex.Store({
      getters,
    });
    cmp = shallow(Search, { store, localVue });
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('Fetch featured articles', async () => {
    expect.assertions(2);
    const featuredMatch = {
      _id: '5a9703c391ae503de4b0b2b5',
      title: 'Axios Mock Featured Article',
    };
    const result = await axios.getfeatured();
    expect(result).toEqual(featuredMatch);
    expect(cmp.vm.featured_articles).toEqual(featuredMatch);
  });

  test('Fetch top articles', async () => {
    expect.assertions(1);

    const topMatch = {
      _id: '5a97288dff873843688ee775',
      title: 'Top Article Number 1',
      viewcount: 12,
    };
    const result = await axios.gettop();
    expect(result).toEqual(topMatch);
    expect(cmp.vm.result_articles).toEqual(topMatch);
  });
});
