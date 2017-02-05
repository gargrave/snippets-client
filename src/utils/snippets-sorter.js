// valid sorting options
export const SORT = {
  TITLE: 'title',
  URL: 'url',
  COLOR: 'color',
  CREATED: 'created',
  MODIFIED: 'modified'
};

export const SORT_LABELS = {
  TITLE: 'Title',
  URL: 'Url',
  COLOR: 'Color',
  CREATED: 'Date Created',
  MODIFIED: 'Date Modified'
};

export const DEFAULT_SORT = SORT.CREATED;

export default {
  sort(snippets, sortBy, asc = true) {
    // sort by title
    if (sortBy === SORT.TITLE) {
      snippets.sort(
        (a, b) => a.title < b.title ? -1 : 1
      );
    }

    // sort by url
    if (sortBy === SORT.URL) {
      snippets.sort(
        (a, b) => a.url < b.url ? -1 : 1
      );
    }

    // sort by color
    if (sortBy === SORT.COLOR) {
      snippets.sort(
        (a, b) => a.color < b.color ? -1 : 1
      );
    }

    // sort by created
    if (sortBy === SORT.CREATED) {
      snippets.sort(
        (a, b) => a.created < b.created ? -1 : 1
      );
    }

    // sort by modified
    if (sortBy === SORT.MODIFIED) {
      snippets.sort(
        (a, b) => a.modified < b.modified ? -1 : 1
      );
    }

    // reverse for asc. order
    if (!asc) {
      snippets.reverse();
    }

    // finally, sort the tags on each snippet
    snippets.forEach((snippet) => {
      this.sortTagsOnSnippet(snippet);
    });

    return snippets;
  },

  sortTagsOnSnippet(snippet) {
    snippet.tags.sort((a, b) => {
      return a._tag.title > b._tag.title ? 1 : -1;
    });
  }
};
