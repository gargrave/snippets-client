export default {
  state: {
    title: 'Snippets'
  },

  getters: {
    appTitle(state) {
      return state.title;
    }
  }
};
