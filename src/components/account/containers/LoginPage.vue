<template>
  <div>
    <div class="panel panel-primary snippet-panel">

      <div class="panel-heading">
        <h3 class="panel-title">Login</h3>
      </div><!-- /panel-heading -->

      <div class="panel-body">
        <!-- API error message -->
        <div class="alert alert-danger" v-if="apiError">{{ apiError }}</div>

        <!-- login form -->
        <app-login-form
          :working="working"
          :onSubmit="onSubmit"
          :errors="errors"
          @formDataChanged="onLoginFormChanged"
        ></app-login-form>
      </div><!-- /panel-body -->

    </div>
  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import request from 'superagent';
  import toastr from 'toastr';

  import validate from '../../../utils/validate';
  import LoginForm from '../components/LoginForm.vue';

  export default {
    components: {
      appLoginForm: LoginForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // error messages returned from API (e.g. invalid login)
        apiError: '',

        // local validation errors (e.g. missing field)
        errors: {
          username: '',
          password: ''
        },

        // model for user login data
        userData: {
          username: '',
          password: ''
        }
      };
    },


    computed: {
      ...mapGetters([
        'isLoggedIn'
      ])
    },


    methods: {
      /**
       * Handler for input fields being changed on login form.
       */
      onLoginFormChanged(value) {
        this.userData = {
          username: value.username,
          password: value.password
        };
      },

      /**
       * Attempts to submit the current user data to the API to login.
       * Note that if it does not validate, no request is sent.
       */
      onSubmit() {
        if (this.isValid()) {
          this.apiError = '';
          this.working = true;
          // TODO use the URL constants
          request.post('http://localhost:8000/api-token-auth/')
            .send(this.userData)
            .end((err, res) => {
              this.working = false;
              if (err) {
                // if error, display the error message
                this.apiError = 'Unable to log in with provided credentials.';
              } else {
                // if no error, send user data to store and redirect
                this.storeLogin(res.body);
                // TODO use the URL constants
                this.$router.push('/snippets');
              }
            });
        }
      },

      /**
       * Validates the user data currently entered into the form.
       *
       * @returns {boolean} Whether the data validates correctly.
       */
      isValid() {
        let valid = true;
        let params;

        this.errors = {
          username: '',
          password: ''
        };

        // validate username
        params = {required: true, minLength: 2};
        const userVal = validate(this.userData.username, params);
        if (!userVal.valid) {
          this.errors.username = userVal.error;
          valid = false;
        }

        // validate password
        params = {required: true, minLength: 8};
        const passVal = validate(this.userData.password, params);
        if (!passVal.valid) {
          this.errors.password = passVal.error;
          valid = false;
        }

        return valid;
      },

      ...mapActions({
        storeLogin: 'login'
      })
    },


    created() {
      // if we already logged in, redirect to account/profile page
      if (this.isLoggedIn) {
        // TODO use the URL constants
        this.$router.push('/account');
      }
    }
  };
</script>


<style>
</style>
