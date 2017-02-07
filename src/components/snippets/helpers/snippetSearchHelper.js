export default {
  emptySearch() {
    return {
      title: '',
      tags: ''
    };
  },

  isIdentical(a, b) {
    console.dir(b);
    return a.title.trim() === b.title.trim() &&
      a.tags.trim() === b.tags.trim();
  },

  buildRequestPayload(data) {
    return {
      title: data.title.trim() || '',
      tags: data.tags.trim() || ''
    };
  }
};
