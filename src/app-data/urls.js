import env from './env';

const DEV_API_ROOT_URL = 'http://localhost:8000';
const STAGING_API_ROOT_URL = 'https://snippets-dev.herokuapp.com';
const PROD_API_ROOT_URL = 'https://snippets-prod.herokuapp.com';

let apiRoot;
let restApiRoot;

(function setUrls() {
  if (env.isProd()) {
    apiRoot = PROD_API_ROOT_URL;
    restApiRoot = `${apiRoot}/api/v1`;
  } else if (env.isStaging()) {
    apiRoot = STAGING_API_ROOT_URL;
    restApiRoot = `${apiRoot}/api/v1`;
  } else {
    apiRoot = DEV_API_ROOT_URL;
    restApiRoot = `${apiRoot}/api/v1`;
  }
})();


// URLs for AJAX calls to the API
export let apiUrls = {
  login: `${apiRoot}/rest-auth/login/`,
  logout: `${apiRoot}/rest-auth/logout/`,
  user: `${apiRoot}/rest-auth/user/`,
  profile: `${apiRoot}/rest-auth/user/profile/`,
  register: `${apiRoot}/rest-auth/registration/`,
  snippets: `${restApiRoot}/snippets/`,
  starredSnippets: `${restApiRoot}/snippets/starred/`,
  archivedSnippets: `${restApiRoot}/snippets/archived/`,
};

// URLs for local routing (i.e. vue-router)
export let localUrls = {
  account: '/account',
  accountCreate: '/account/new',
  login: '/account/login',
  snippetsList: '/snippets',
  snippetsFilteredList: '/snippets/filter/:filterBy',
  snippetCreate: '/snippets/new',
  snippetDetail: '/snippets/:id',
};
