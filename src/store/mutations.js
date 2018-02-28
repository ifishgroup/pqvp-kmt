export default {
  loginUser(state,payload) {
    //payload.headers['x-auth']
    state.user = {isLoggedIn:true,info:payload};
  },
  logoffUser(state) {
    state.user = null;
  },
  menuToggle(state) {
    state.config.wideMenu = !state.config.wideMenu
  },
  setError(state,error) {
    state.app.error = error
  },
  resetApplication(state) {
    state.config.wideMenu = false;
    state.app.error = null;
  }
}