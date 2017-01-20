const ENV = {
  DEV: 0,
  STAGING: 1,
  PROD: 2
};

const STAGING_SITE_URL_CHECK = 'gargrave-snippets-dev';
const PROD_SITE_URL_CHECK = 'snippets-app.com';

let appEnv = ENV.PROD;

(function setAppEnv() {
  let loc = window.location.href;
  if (loc.indexOf(STAGING_SITE_URL_CHECK) !== -1) {
    appEnv = ENV.STAGING;
  } else if (loc.indexOf(PROD_SITE_URL_CHECK) !== -1) {
    appEnv = ENV.PROD;
  } else {
    appEnv = ENV.DEV;
  }
})();


export default {
  isProd() {
    return appEnv === ENV.PROD;
  },

  isStaging() {
    return appEnv === ENV.STAGING;
  },

  isDev() {
    return appEnv === ENV.DEV;
  }
};
