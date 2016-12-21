export default {
  state: {
    appTitle: 'Snippets'
  },

  getters: {
    appTitle(state) {
      return state.appTitle;
    }
  }
};
