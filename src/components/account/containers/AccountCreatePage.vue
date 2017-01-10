<template>
  <div>
    <h2 class="page-title">New Account</h2>

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
  import {localUrls} from '../../../appData/urls';
  import AccountCreateForm from '../components/AccountCreateForm.vue';

  export default {
    components: {
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
        credentials: {
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
        console.log('TODO: implement onFormChanged()');
//        this.credentials = {
//          username: value.username,
//          password: value.password
//        };
      },

      /**
       * Attempts to submit the current user data to the API to login.
       * Note that if it does not validate, no request is sent.
       */
      onSubmit() {
        if (this.isValid()) {
          console.log('TODO: implement onSubmit()');
//          this.working = true;
//
//          this.login(this.credentials)
//            .then(() => {
//              this.$router.push(localUrls.snippetsList);
//              this.working = false;
//            }, (err) => {
//              this.apiError = err;
//              this.working = false;
//            });
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
        console.log('TODO: implement isValid()');
        console.log('TODO: check that email is valid');
        console.log('TODO: check that email does not exist');
        console.log('TODO: check that username is valid');
        console.log('TODO: check that username does not exist');
        console.log('TODO: check that passwords are valid');
        console.log('TODO: check that passwords match');
        return true;
//        let valid = true;
//        let params;
//
//        this.errors = {
//          username: '',
//          password: ''
//        };
//
//        // validate username
//        params = {required: true, minLength: 2};
//        const userVal = validate(this.credentials.username, params);
//        if (!userVal.valid) {
//          this.errors.username = userVal.error;
//          valid = false;
//        }
//
//        // validate password
//        params = {required: true, minLength: 8};
//        const passVal = validate(this.credentials.password, params);
//        if (!passVal.valid) {
//          this.errors.password = passVal.error;
//          valid = false;
//        }
//
//        return valid;
      },
    }
  };
</script>


<style>
</style>
