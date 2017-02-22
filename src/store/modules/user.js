import request from 'superagent';

import { apiUrls } from '../../app-data/urls';
import errors from '../../app-data/errors';
import apiHelper from '../../utils/apiHelper';
import { PROFILE, USER } from '../mutation-types';


function getEmptyUser() {
  return {
    pk: '',
    authToken: '',
    username: '',
    email: '',
    dateJoined: '',
    lastLogin: ''
  };
}

function getEmptyProfile() {
  return {
    firstName: '',
    lastName: '',
    categories: {
      white: '',
      red: '',
      green: '',
      blue: '',
      yellow: '',
      orange: '',
      teal: '',
      gray: '',
    }
  };
}


export default {
  state: {
    // whether we have any open calls to the User API
    userAjaxPending: false,

    // whether we have any open calls to the Profile API
    profileAjaxPending: false,

    // whether we have already queried the profile API since load
    // this will prevent unnecessary multiple calls
    profileHasBeenLoaded: false,

    // full user data
    user: getEmptyUser(),

    profile: getEmptyProfile()
  },

  getters: {
    userAjaxPending(state) {
      return state.userAjaxPending;
    },

    profileAjaxPending(state) {
      return state.profileAjaxPending;
    },

    profileHasBeenLoaded(state) {
      return state.profileHasBeenLoaded;
    },

    /**
     * Returns full user data for currently logged in user
     */
    userData(state) {
      return state.user;
    },

    profile(state) {
      return state.profile;
    },

    /**
     * Returns just the current authToken for the user.
     */
    authToken(state) {
      return state.user.authToken;
    },

    /**
     * Returns whether the current user is logged in
     */
    isLoggedIn(state) {
      return !!state.user.authToken;
    }
  },


  mutations: {
    /*=============================================
     = User Mutations
     =============================================*/
    /* Staring AJAX call to the User API */
    [USER.AJAX_BEGIN](state) {
      state.userAjaxPending = true;
    },

    /* Finishing AJAX call to the User API */
    [USER.AJAX_END](state) {
      state.userAjaxPending = false;
    },

    /*
     login authenticated user;
     save provided user details in the store
     */
    [USER.LOGIN](state, user) {
      const userData = {
        pk: user.pk,
        authToken: user.authToken,
        username: user.username,
        email: user.email,
        dateJoined: user.date_joined || '',
        lastLogin: user.last_login || ''
      };
      state.user = userData;
      localStorage.setItem('token', user.authToken);
      // localStorage.setItem('user', JSON.stringify(userData));
    },

    /*
     logout current user;
     simply clear existing user data
     */
    [USER.LOGOUT](state) {
      state.user = getEmptyUser();
      state.profile = getEmptyProfile();
      state.profileHasBeenLoaded = false;
      localStorage.clear();
    },

    /*=============================================
     = Profile Mutations
     =============================================*/
    /* Staring AJAX call to the Profile API */
    [PROFILE.AJAX_BEGIN](state) {
      state.profileAjaxPending = true;
    },

    /* Finishing AJAX call to the Profile API */
    [PROFILE.AJAX_END](state) {
      state.profileAjaxPending = false;
    },

    [PROFILE.FETCH_SUCCESS](state, profile) {
      state.profile = {
        firstName: profile.first_name ? profile.first_name : '',
        lastName: profile.last_name ? profile.last_name : '',
        categories: {
          white: profile.categories ? profile.categories.white : '',
          red: profile.categories ? profile.categories.red : '',
          green: profile.categories ? profile.categories.green : '',
          blue: profile.categories ? profile.categories.blue : '',
          yellow: profile.categories ? profile.categories.yellow : '',
          orange: profile.categories ? profile.categories.orange : '',
          teal: profile.categories ? profile.categories.teal : '',
          gray: profile.categories ? profile.categories.gray : '',
        }
      };
      state.profileHasBeenLoaded = true;
    }
  },

  actions: {
    /**
     * Attempts to login the user with the provided details.
     *
     * Note that, upon successful login, an extra API call is made to fetch
     * the full user data.
     *
     * @param credentials - An object with 'username' and 'password' props
     * @returns {Promise}
     */
    login({ dispatch, commit }, credentials) {
      return new Promise((resolve, reject) => {
        commit(USER.AJAX_BEGIN);
        request
          .post(apiUrls.login)
          .set('Accept', 'application/json')
          .send(credentials)
          .end((err, res) => {
            if (err) {
              // if error, reject with error message
              commit(USER.AJAX_END);
              reject('Unable to log in with provided credentials.');
            } else {
              // if no error, login locally with returned user data
              const authToken = res.body.key;
              if (authToken) {
                dispatch('loadUserDataFromToken', authToken)
                  .then((res) => {
                    commit(USER.AJAX_END);
                    resolve();
                  }, (err) => {
                    commit(USER.AJAX_END);
                    reject(err);
                  });
              } else {
                commit(USER.AJAX_END);
                reject('Unable to log in with provided credentials.');
              }
            }
          });
      });
    },

    /**
     * Attempts to fetch user data from the API with the supplied auth token.
     * If the attempt is successful, the returned data is committed to localStorage.
     */
    loadUserDataFromToken({ getters, dispatch, commit }, authToken) {
      return new Promise((resolve, reject) => {
        commit(USER.AJAX_BEGIN);
        request
          .get(apiUrls.user)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              // check if the error has a 'detail' property we can use
              const errorFromApi = apiHelper.getErrorObject(err);
              if (errorFromApi) {
                // if so, check what it is and respond accordingly
                const error = err.response.body.detail;
                if (error.indexOf(errors.API_INVALID_TOKEN) !== -1) {
                  commit(USER.LOGOUT);
                  reject(errors.INVALID_TOKEN);
                }
              } else {
                reject('Unable to log in with provided credentials.');
              }
            } else {
              let user = res.body;
              user.authToken = authToken;
              commit(USER.LOGIN, user);

              if (getters.profileHasBeenLoaded) {
                commit(USER.AJAX_END);
                resolve();
              } else {
                dispatch('loadUserProfile', authToken)
                  .then((res) => {
                    // TODO: probably need better error-handling here
                    commit(USER.AJAX_END);
                    resolve();
                  }, (err) => {
                    // TODO: probably need better error-handling here
                    commit(USER.AJAX_END);
                    resolve();
                  });
              }
            }
          });
      });
    },

    loadUserProfile({ commit }, authToken) {
      return new Promise((resolve, reject) => {
        commit(PROFILE.AJAX_BEGIN);
        request
          .get(apiUrls.profile)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              commit(PROFILE.AJAX_END);
              reject('Unable to fetch profile information.');
            } else {
              commit(PROFILE.FETCH_SUCCESS, res.body);
              commit(PROFILE.AJAX_END);
              resolve();
            }
          });
      });
    },

    /**
     * Attempts to log out the current user. A request will be sent to the API
     * to logout, but the local data will be cleared and the Promise will resolve
     * no matter what response the API sends.
     */
    logout({ getters, dispatch, commit }) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        commit(USER.AJAX_BEGIN);
        request
          .post(apiUrls.logout)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            dispatch('clearLocalSnippets');
            commit(USER.AJAX_END);
            commit(USER.LOGOUT);
            resolve();
          });
      });
    },

    /**
     * Attempts to create a new user with the supplied data. If a new user
     * is successfully created, the user is automatically logged in.
     */
    createUser({ dispatch, commit }, userData) {
      return new Promise((resolve, reject) => {
        const payload = {
          email: userData.email,
          username: userData.username,
          password1: userData.password,
          password2: userData.passwordConfirm
        };

        commit(USER.AJAX_BEGIN);
        request
          .post(apiUrls.register)
          .set('Accept', 'application/json')
          .send(payload)
          .end((err, res) => {
            if (err) {
              // if error(s), reject with all error messages
              commit(USER.AJAX_END);
              reject(err.response.body);
            } else {
              // if no error, the API should have sent us the token,
              // which we can now use to fetch the new user's data
              const authToken = res.body.key;
              if (authToken) {
                dispatch('loadUserDataFromToken', authToken)
                  .then((res) => {
                    commit(USER.AJAX_END);
                    resolve();
                  }, (err) => {
                    commit(USER.AJAX_END);
                    reject(err);
                  });
              } else {
                commit(USER.AJAX_END);
                reject('Unable to login to new account.');
              }
            }
          });
      });
    },

    /** Sends a request to the server to see if the specified email address is already in use. */
    checkForExistingEmail({ commit }, email) {
      return new Promise((resolve, reject) => {
        request
          .post(apiUrls.emailCheck)
          .send({ email })
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res.body);
            }
          });
      });
    },

    /** Sends a request to the server to see if the specified username address is already in use. */
    checkForExistingUser({ commit }, username) {
      return new Promise((resolve, reject) => {
        request
          .post(apiUrls.userCheck)
          .send({ username })
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res.body);
            }
          });
      });
    },

    /**
     * Attempts to "re-login" from credentials stored in localStorage. Should be
     * called first upon re-loading the app.
     */
    checkForStoredLogin({ getters, dispatch, commit }) {
      return new Promise((resolve, reject) => {
        let storedToken = localStorage.getItem('token');
        if (storedToken) {
          if (getters.userData.pk) {
            resolve(getters.userData);
          } else {
            dispatch('loadUserDataFromToken', storedToken)
              .then((res) => {
                resolve(res);
              }, (err) => {
                reject(err);
              });
          }
        } else {
          reject();
        }
      });
    },

    /** Sends a request to update the user's profile with the provided details */
    updateProfile({ getters, commit }, profile) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        commit(PROFILE.AJAX_BEGIN);
        request
          .put(apiUrls.profile)
          .set('Authorization', `Token ${authToken}`)
          .set('Accept', 'application/json')
          .send(profile)
          .end((err, res) => {
            if (err) {
              commit(PROFILE.AJAX_END);
              reject('There was an error updating your profile.');
            } else {
              const snippet = res.body;
              commit(PROFILE.FETCH_SUCCESS, profile);
              commit(PROFILE.AJAX_END);
              resolve(snippet);
            }
          });
      });
    },
  }
};
