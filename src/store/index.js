import Vue from 'vue' 
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate' 
import state from './state' 
import getters from './getters' 
import mutations from './mutations' 
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store(
    {  
        plugins: [persistedState({
            storage: window.sessionStorage,
            paths:['user']
        })],
        state: {
            ...state,
          },
          getters,
          mutations: {
            ...mutations
          },
          actions
    }
) 