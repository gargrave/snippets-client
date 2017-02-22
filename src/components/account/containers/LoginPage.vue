<template>
  <section>
    <h3 class="page-title">
      Login
      <i
        v-if="working"
        class="fa fa-cog fa-spin"
        aria-hidden="true">
      </i>
    </h3>

    <el-card class="box-card">
      <div class="text item">

        <!-- error message display -->
        <el-alert
          title="Login Error"
          type="error"
          v-if="apiError"
          :description="apiError"
          :closable="false">
        </el-alert>

        <!-- login form -->
        <app-login-form
          :working="working"
          @submitted="onFormSubmitted"
          @cancelled="onFormCancelled">
        </app-login-form>

      </div><!-- /.text item -->
    </el-card>

  </section>
</template>


<script>
  import { mapActions } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import LoginForm from '../components/forms/LoginForm.vue';

  export default {
    components: {
      appLoginForm: LoginForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // error messages returned from API (e.g. invalid login)
        apiError: ''
      };
    },


    methods: {
      /**
       * Attempts to submit the current user data to the API to login.
       */
      onFormSubmitted(value, event) {
        const user = {
          username: value.username,
          password: value.password
        };

        this.working = true;
        this.apiError = '';
        this.login(user)
          .then(() => {
            this.$router.push(localUrls.snippetsList);
            this.working = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
          });
      },

      onFormCancelled(value, event) {
        this.$router.push(localUrls.accountCreate);
      },

      ...mapActions([
        'checkForStoredLogin',
        'login'
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
