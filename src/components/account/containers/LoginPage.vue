<template>
  <div>
    <h2 class="page-title">Login</h2>

    <div class="panel panel-primary snippet-panel">

      <div class="panel-heading">
        <h3 class="panel-title">User Details</h3>
      </div><!-- /panel-heading -->

      <div class="panel-body">
        <!-- API error message -->
        <!-- TODO: pull this into a separate component -->
        <div
          class="alert alert-danger alert-dismissible"
          v-if="apiError"
          role="alert">
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          {{ apiError }}
        </div>

        <!-- login form -->
        <app-login-form
          :working="working"
          :onSubmit="onSubmit"
          :errors="errors"
          @formDataChanged="onFormChanged"
        ></app-login-form>
      </div><!-- /panel-body -->

    </div>
  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import request from 'superagent';
  import toastr from 'toastr';

  import {apiUrls, localUrls} from '../../../appData/urls';
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
        credentials: {
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
      onFormChanged(value) {
        this.credentials = {
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
          this.working = true;

          this.login(this.credentials)
            .then(() => {
              this.$router.push(localUrls.snippetsList);
              this.working = false;
            }, (err) => {
              this.apiError = err;
              this.working = false;
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
        const userVal = validate(this.credentials.username, params);
        if (!userVal.valid) {
          this.errors.username = userVal.error;
          valid = false;
        }

        // validate password
        params = {required: true, minLength: 8};
        const passVal = validate(this.credentials.password, params);
        if (!passVal.valid) {
          this.errors.password = passVal.error;
          valid = false;
        }

        return valid;
      },

      ...mapActions([
        'login'
      ])
    },


    created() {
      // if we already logged in, redirect to account/profile page
      if (this.isLoggedIn) {
        this.$router.push(localUrls.account);
      }
    }
  };
</script>


<style>
</style>
