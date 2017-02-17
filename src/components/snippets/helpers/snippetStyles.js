import snippetData from './snippetData';


export default {
  icons: {
    pinned: 'fa-thumb-tack',
    unpinned: 'fa-thumb-tack-o',
    starred: 'fa-star',
    unstarred: 'fa-star-o',
    archived: 'fa-refresh',
    unarchived: 'fa-archive',
  },

  /**
   * Builds and returns the style string for the top-level element, including the color
   * of the Snippet card, based on the Snippet's 'color' property
   *
   * @param {object} snippet - The Snippet instance for the card
   * @returns {string} The style string for the top-level element
   */
  snippetCard(snippet) {
    const colorClass = snippetData.isValidColor(snippet.color) ?
      `snippet-color-${snippet.color}` :
      'snippet-color-white';
    return `snippet-card ${colorClass}`;
  },

  snippetCreateCard() {
    return 'snippet-card snippet-color-white new-snippet-form-card';
  },

  snippetStarButton(snippet) {
    return snippet.starred ?
      `fa ${this.icons.starred} pointer snippet-control snippet-control-star` :
      `fa ${this.icons.unstarred} pointer snippet-control snippet-control-star`;
  },

  snippetPinButton(snippet) {
    let iconClass = snippet.pinned ?
      `fa ${this.icons.pinned}` :
      `fa ${this.icons.pinned} ${this.icons.unpinned}`;
    return `${iconClass} pointer snippet-control snippet-control-pin`;
  },

  snippetArchiveButton(snippet) {
    let iconClass = snippet.archived ?
      `fa ${this.icons.archived}` :
      `fa ${this.icons.unarchived}`;
    return `${iconClass} pointer snippet-control snippet-control-archive`;
  },
};
