<template>
  <div>
    <h2 class="page-title">New Account</h2>
    <!-- 'working' icon -->
    <app-loading-icon v-if="working"></app-loading-icon>

    <div class="panel panel-primary snippet-panel">

      <div class="panel-heading">
        <h3 class="panel-title">User Details</h3>
      </div><!-- /panel-heading -->

      <div class="panel-body">
        <app-account-create-form
          :working="working"
          :onSubmit="onSubmit"
          :onCancel="onCancel"
          :errors="errors"
          @formDataChanged="onFormChanged">
        </app-account-create-form>
      </div><!-- /panel-body -->
    </div><!-- /panel -->

  </div>
</template>


<script>
  import {mapActions} from 'vuex';
  import toastr from 'toastr';

  import {localUrls} from '../../../appData/urls';
  import validate from '../../../utils/validate';
  import LoadingIcon from '../../common/components/LoadingIcon';
  import AccountCreateForm from '../components/AccountCreateForm.vue';

  export default {
    components: {
      appLoadingIcon: LoadingIcon,
      appAccountCreateForm: AccountCreateForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // error messages returned from API (e.g. invalid login)
        apiError: '',

        // local validation errors (e.g. missing field)
        errors: {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        },

        // model for user login data
        userData: {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        }
      };
    },


    methods: {
      /**
       * Handler for input fields being changed on login form.
       */
      onFormChanged(value) {
        const previousUsername = this.userData.username;

        this.userData = {
          email: value.email,
          username: value.username,
          password: value.password,
          passwordConfirm: value.passwordConfirm
        };

        if (previousUsername !== value.username) {
          // TODO: check if username exists
        }
      },

      /**
       * Attempts to submit the current user data to the API to login.
       * Note that if it does not validate, no request is sent.
       */
      onSubmit() {
        if (this.isValid()) {
          this.working = true;
          this.errors = {
            email: '',
            username: '',
            password: '',
            passwordConfirm: ''
          };

          this.createUser(this.userData)
            .then(() => {
              this.$router.push(localUrls.account);
              toastr.success('Account created');
              this.working = false;
            }, (err) => {
              this.apiError = 'Unable to create account';
              // show any errors returned from the API
              // these will be errors that we cannot validate on the front-end,
              // like 'username already in use' or 'password is too simple'
              this.errors = {
                email: err.email ? err.email[0] : '',
                username: err.username ? err.username[0] : '',
                password: err.password1 ? err.password1[0] : '',
                passwordConfirm: err.password2 ? err.password2[0] : ''
              };
              this.working = false;
            });
        }
      },

      /**
       * Handler for form's 'cancel' button; redirect to login page.
       */
      onCancel() {
        this.$router.push(localUrls.login);
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
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        };

        // validate email
        params = {required: true, format: 'email'};
        const emailVal = validate(this.userData.email, params);
        if (!emailVal.valid) {
          this.errors.email = emailVal.error;
          valid = false;
        }

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

        // validate confirmation password (only check that they match)
        const p1 = this.userData.password;
        const p2 = this.userData.passwordConfirm;
        if (p1 !== p2 || p2 === '') {
          this.errors.passwordConfirm = 'Passwords do not match.';
          valid = false;
        }

        return valid;
      },

      ...mapActions([
        'createUser'
      ])
    }
  };
</script>


<style>
</style>
