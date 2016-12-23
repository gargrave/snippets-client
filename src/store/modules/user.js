import request from 'superagent';

import {apiUrls} from '../../appData/urls';
import {USER} from '../mutation-types';


export default {
  state: {
    user: {
      uid: '',
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
    [USER.USER_LOGIN](state, newUserData) {
      state.user = {
        uid: newUserData.uid,
        authToken: newUserData.authToken,
        username: newUserData.username,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        dateJoined: newUserData.dateJoined,
        lastLogin: newUserData.lastLogin
      };
      localStorage.setItem('user', JSON.stringify(newUserData));
    },

    /*
     logout current user;
     simply clear existing user data
     */
    [USER.USER_LOGOUT](state) {
      state.user = {
        uid: '',
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
          .end((err, res) => {
            if (err) {
              // if error, reject with error message
              reject('Unable to log in with provided credentials.');
            } else {
              // if no error, login locally with returned user data
              commit(USER.USER_LOGIN, res.body);
              resolve();
            }
          });
      });
    },

    logout({commit}) {
      commit(USER.USER_LOGOUT);
    },

    checkForStoredLogin({commit}) {
      let storedLogin = localStorage.getItem('user');
      if (storedLogin) {
        commit(USER.USER_LOGIN, JSON.parse(storedLogin));
      }
    }
  }
};
