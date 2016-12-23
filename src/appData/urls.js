const ROOT = 'http://localhost:8000';
const API_ROOT = `${ROOT}/api/v1`;

// URLs for AJAX calls to the API
export const apiUrls = {
  login: `${ROOT}/api-token-auth/`,
  snippets: `${API_ROOT}/snippets/`,
};

// URLs for local routing (i.e. react-router)
export const localUrls = {
  account: '/account',
  login: '/account/login',
  snippetsList: '/snippets',
  snippetsCreate: '/snippets/new'
};
