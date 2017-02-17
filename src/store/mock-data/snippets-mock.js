const snippets = [{
  'id': 27,
  'title': '20 Great CSS Tricks',
  'url': 'http://webdesignerwall.com/tutorials/level-css-skills-20-pro-css-tips',
  'color': 'blue',
  'tags': [{
    'id': 28,
    '_tag': {
      'id': 6,
      'title': 'css'
    }
  }, {
    'id': 26,
    '_tag': {
      'id': 17,
      'title': 'dev'
    }
  }],
  'pinned': false,
  'starred': false,
  'archived': false,
  'created': '2017-02-06T21:35:27.267239Z',
  'modified': '2017-02-06T21:35:46.342719Z'
}, {
  'id': 19,
  'title': 'Shoutcraft Kings January 2017',
  'url': 'https://youtu.be/xLP-JMH7Gck?t=4607',
  'color': 'green',
  'tags': [{
    'id': 25,
    '_tag': {
      'id': 24,
      'title': 'esports'
    }
  }, {
    'id': 21,
    '_tag': {
      'id': 20,
      'title': 'starcraft'
    }
  }, {
    'id': 23,
    '_tag': {
      'id': 22,
      'title': 'vods'
    }
  }],
  'pinned': true,
  'starred': false,
  'archived': false,
  'created': '2017-02-06T21:34:32.854224Z',
  'modified': '2017-02-06T21:34:44.977868Z'
}, {
  'id': 2,
  'title': 'NodeJS Path @ Pluralsight',
  'url': 'https://app.pluralsight.com/paths/skill/node-js',
  'color': 'orange',
  'tags': [{
    'id': 26,
    '_tag': {
      'id': 17,
      'title': 'dev'
    }
  }, {
    'id': 10,
    '_tag': {
      'id': 9,
      'title': 'tutorial'
    }
  }],
  'pinned': false,
  'starred': true,
  'archived': false,
  'created': '2016-10-20T16:14:53.995472Z',
  'modified': '2017-02-06T17:47:05.497440Z'
}, {
  'id': 1,
  'title': 'Interesting JavaScript and CSS Libraries',
  'url': 'http://tutorialzine.com/2016/08/15-interesting-javascript-and-css-libraries-for-august-2016/',
  'color': 'blue',
  'tags': [{
    'id': 7,
    '_tag': {
      'id': 6,
      'title': 'css'
    }
  }, {
    'id': 18,
    '_tag': {
      'id': 17,
      'title': 'dev'
    }
  }],
  'pinned': false,
  'starred': false,
  'archived': true,
  'created': '2016-10-20T16:14:36.206252Z',
  'modified': '2017-02-06T17:46:42.221404Z'
}];

export default {
  snippets,
  pinnedSnippet: snippets[1],
  starredSnippet: snippets[2],
  archivedSnippet: snippets[3],
};
