import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {USER} from '../mutation-types';


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
      localStorage.setItem('user', JSON.stringify(userData));
    },

    /*
     login authenticated user with data from localStorage
     */
    [USER.LOGIN_FROM_LOCALSTORAGE](state, user) {
      state.user = {
        pk: user.pk,
        authToken: user.authToken,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateJoined: user.dateJoined,
        lastLogin: user.lastLogin
      };
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
    login({dispatch, commit}, credentials) {
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

    loadUserDataFromToken({commit}, authToken) {
      return new Promise((resolve, reject) => {
        request.get(apiUrls.user)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              reject('Unable to log in with provided credentials.');
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
    logout({getters, commit}) {
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
     * Attempts to "re-login" from credentials stored in localStorage. Should be
     * called first upon re-loading the app.
     */
    checkForStoredLogin({commit}) {
      let storedLogin = localStorage.getItem('user');
      if (storedLogin) {
        commit(USER.LOGIN_FROM_LOCALSTORAGE, JSON.parse(storedLogin));
      }
    }
  }
};
