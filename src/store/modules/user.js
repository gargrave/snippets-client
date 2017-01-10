import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {USER} from '../mutation-types';


export default {
  state: {
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
      const userData = {
        pk: user.pk,
        authToken: user.authToken,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateJoined: user.dateJoined,
        lastLogin: user.lastLogin
      };
      state.user = userData;
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
    login({commit}, credentials) {
      return new Promise((resolve, reject) => {
        request.post(apiUrls.login)
          .send(credentials)
          .end((err1, res1) => {
            if (err1) {
              // if error, reject with error message
              reject('Unable to log in with provided credentials.');
            } else {
              // if no error, login locally with returned user data
              const authToken = res1.body.key;
              if (authToken) {
                request.get(apiUrls.user)
                  .set('Authorization', `Token ${authToken}`)
                  .end((err2, res2) => {
                    if (err2) {
                      reject('Unable to log in with provided credentials.');
                    } else {
                      let user = res2.body;
                      user.authToken = authToken;
                      commit(USER.LOGIN, user);
                      resolve();
                    }
                  });
              } else {
                reject('Unable to log in with provided credentials.');
              }
            }
          });
      });
    },

    logout({getters, commit}) {
      return new Promise((resolve, reject) => {
        const authToken = getters.authToken;
        if (!authToken) {
          reject('Not authenticated');
        }

        request.post(apiUrls.logout)
          .set('Authorization', `Token ${authToken}`)
          .end((err, res) => {
            if (err) {
              commit(USER.LOGOUT);
              resolve();
            } else {
              commit(USER.LOGOUT);
              resolve();
            }
          });
      });
    },

    checkForStoredLogin({commit}) {
      let storedLogin = localStorage.getItem('user');
      if (storedLogin) {
        commit(USER.LOGIN_FROM_LOCALSTORAGE, JSON.parse(storedLogin));
      }
    }
  }
};
