import request from 'superagent';

import { apiUrls } from '../../appData/urls';
import errors from '../../appData/errors';
import apiHelper from '../../utils/apiHelper';
import { USER } from '../mutation-types';


export default {
  state: {
    // full user data
    user: {
      pk: '',
      authToken: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      dateJoined: '',
      lastLogin: ''
    }
  },

  getters: {
    /**
     * Returns full user data for currently logged in user
     */
    userData(state) {
      return state.user;
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
    /*
     login authenticated user;
     save provided user details in the store
     */
    [USER.LOGIN](state, user) {
      const userData = {
        pk: user.pk,
        authToken: user.authToken,
        username: user.username,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
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
      state.user = {
        pk: '',
        authToken: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        dateJoined: '',
        lastLogin: ''
      };
      localStorage.clear();
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
        request.post(apiUrls.login)
          .send(credentials)
          .end((err, res) => {
            if (err) {
              // if error, reject with error message
              reject('Unable to log in with provided credentials.');
            } else {
              // if no error, login locally with returned user data
              const authToken = res.body.key;
              if (authToken) {
                dispatch('loadUserDataFromToken', authToken)
                  .then((res) => {
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
              } else {
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
    loadUserDataFromToken({ commit }, authToken) {
      return new Promise((resolve, reject) => {
        request.get(apiUrls.user)
          .set('Authorization', `Token ${authToken}`)
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
    logout({ getters, commit }) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request.post(apiUrls.logout)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
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

        request.post(apiUrls.register)
          .send(payload)
          .end((err, res) => {
            if (err) {
              // if error(s), reject with all error messages
              reject(err.response.body);
            } else {
              // if no error, the API should have sent us the token,
              // which we can now use to fetch the new user's data
              const authToken = res.body.key;
              if (authToken) {
                dispatch('loadUserDataFromToken', authToken)
                  .then((res) => {
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
              } else {
                reject('Unable to login to new account.');
              }
            }
          });
      });
    },

    /**
     * Attempts to "re-login" from credentials stored in localStorage. Should be
     * called first upon re-loading the app.
     */
    checkForStoredLogin({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        let storedToken = localStorage.getItem('token');
        if (storedToken) {
          dispatch('loadUserDataFromToken', storedToken)
            .then((res) => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        } else {
          reject();
        }
      });
    }
  }
};
