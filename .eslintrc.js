module.exports = {
  root: true,

  parser: 'babel-eslint',

  parserOptions: {
    "ecmaVersion": 6,
    sourceType: 'module'
  },

  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'eslint:recommended',

  // required to lint *.vue files
  plugins: [
    'html'
  ],

  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'eol-last': 0,
    'no-alert': 1,
    'no-console': 1,
    'no-empty': 1,
    'no-lone-blocks': 0,
    'no-trailing-spaces': 0,
    'no-undef': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'no-var': 1,
    'quotes': [1, 'single', { 'allowTemplateLiterals': true }],
    'semi': [1, 'always'],
  }
};
