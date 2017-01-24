<template>
  <section>
    <h3 class="page-title">New Account</h3>

    <el-card
      class="box-card"
      v-loading="working"
      element-loading-text="Working..."
      style="width: 100%">

      <div class="text item">

        <!-- error message display -->
        <el-alert
          title="Account Creation Error"
          type="error"
          v-if="apiError"
          :description="apiError"
          :closable="false">
        </el-alert>

        <!-- 'new account' form -->
        <app-account-create-form
          :working="working"
          :apiFieldErrors="apiFieldErrors"
          @submitted="onFormSubmitted"
          @cancelled="onFormCancelled">
        </app-account-create-form>

      </div><!-- /.text item -->
    </el-card>

  </section>
</template>


<script>
  import { mapActions } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
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

        // any field-specific error message returned from the API
        // e.g. "password is too common"
        apiFieldErrors: {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        }
      };
    },


    methods: {
      /**
       * Attempts to submit the current user data to the API to login.
       */
      onFormSubmitted(value, event) {
        const user = {
          email: value.email,
          username: value.username,
          password: value.password,
          passwordConfirm: value.passwordConfirm
        };

        // clear any existing API errors
        this.apiFieldErrors = {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        };

        this.working = true;
        this.createUser(user)
          .then(() => {
            // if successful, redirect to the 'account' page
            this.$router.push(localUrls.account);
            this.$notify({
              message: 'Account created',
              type: 'success'
            });
            this.working = false;
          }, (err) => {
            this.apiError = 'Unable to create account';
            // show any errors returned from the API
            // these will be errors that we cannot validate on the front-end,
            // like 'username already in use' or 'password is too simple'
            this.apiFieldErrors = {
              email: err.email ? err.email[0] : '',
              username: err.username ? err.username[0] : '',
              password: err.password1 ? err.password1[0] : '',
              passwordConfirm: err.password2 ? err.password2[0] : ''
            };
            this.working = false;
          });
      },

      /**
       * Handler for form's 'cancel' button; redirect to login page.
       */
      onFormCancelled() {
        this.$router.push(localUrls.login);
      },

      ...mapActions([
        'checkForStoredLogin',
        'createUser'
      ])
    },


    created() {
      // if we already logged in, redirect to account/profile page
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.$router.push(localUrls.account);
          this.working = false;
        }, (err) => {
          this.apiError = err;
          this.working = false;
        });
    }
  };
</script>
