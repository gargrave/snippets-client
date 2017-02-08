export default {
  /**
   * Returns a new search object with all fields at default values
   */
  emptySearch() {
    return {
      title: '',
      tags: ''
    };
  },

  /**
   * Compares two search objects and returns whether they are identical.
   */
  isIdentical(a, b) {
    return a.title.trim() === b.title.trim() &&
      a.tags.trim() === b.tags.trim();
  },

  /**
   * Returns an object with the data to send a search request to the API
   */
  buildRequestPayload(data) {
    return {
      title: data.title ? data.title.trim() : '',
      tags: data.tags ? data.tags.trim() : ''
    };
  }
};
