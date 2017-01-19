import snippetData from './snippetData';


export default {
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
      'fa fa-star pointer snippet-control snippet-control-star' :
      'fa fa-star-o pointer snippet-control snippet-control-star';
  },

  snippetPinButton(snippet) {
    let iconClass = snippet.pinned ? 'fa fa-bookmark' : 'fa fa-bookmark-o';
    return `${iconClass} pointer snippet-control snippet-control-pin`;
  },

  snippetArchiveButton(snippet) {
    let iconClass = snippet.archived ? 'fa fa-refresh' : 'fa fa-archive';
    return `${iconClass} pointer snippet-control snippet-control-archive`;
  },
};
