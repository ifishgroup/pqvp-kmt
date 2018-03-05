/* eslint-disable */
export default {

  menuToggle({ commit, state }) {
    commit('menuToggle');
  },
  loginUser({ commit, state }, payload) {
    commit('loginUser', payload);
    commit('menuToggle');
  },
  logoffUser({ commit, state }) {
    commit('logoffUser');
    commit('resetApplication');
  },
  setError({ commit, state }, error) {
    commit('setError', error);
  },
};
