const ROOT = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : 'https://snippets-dev.herokuapp.com';
const API_ROOT = `${ROOT}/api/v1`;

// URLs for AJAX calls to the API
export const apiUrls = {
  login: `${ROOT}/rest-auth/login/`,
  logout: `${ROOT}/rest-auth/logout/`,
  user: `${ROOT}/rest-auth/user/`,
  register: `${ROOT}/rest-auth/registration/`,
  snippets: `${API_ROOT}/snippets/`,
  starredSnippets: `${API_ROOT}/snippets/starred/`,
  archivedSnippets: `${API_ROOT}/snippets/archived/`,
};

// URLs for local routing (i.e. react-router)
export const localUrls = {
  account: '/account',
  accountCreate: '/account/new',
  login: '/account/login',
  snippetsList: '/snippets',
  snippetsFilteredList: '/snippets/filter/:filterBy',
  snippetCreate: '/snippets/new',
  snippetDetail: '/snippets/:id',
};
