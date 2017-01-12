<template>
  <div>
    <h2 class="page-title">Login</h2>

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
          @submitted="onFormSubmitted">
        </app-login-form>

      </div><!-- /.text item -->
    </el-card>

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import request from 'superagent';
  import toastr from 'toastr';

  import { apiUrls, localUrls } from '../../../appData/urls';
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
        apiError: ''
      };
    },


    computed: {
      ...mapGetters([
        'isLoggedIn'
      ])
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
        this.login(user)
          .then(() => {
            this.$router.push(localUrls.snippetsList);
            this.working = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
          });
      },

      ...mapActions([
        'login',
        'checkForStoredLogin'
      ])
    },


    created() {
      // if we already logged in, redirect to account/profile page
      this.checkForStoredLogin()
        .then((res) => {
          this.$router.push(localUrls.account);
        }, (err) => {
          this.apiError = err;
        });
    }
  };
</script>
