<template>
  <div>
    <div class="panel panel-default snippet-panel">

      <div class="panel-heading">
        <h3 class="panel-title">Login</h3>
      </div>

      <div class="panel-body">
        <!-- API error message -->
        <div class="alert alert-danger" v-if="apiError">{{ apiError }}</div>

        <!-- login form -->
        <app-login-form
          :working="working"
          :onSubmit="onSubmit"
          :userData="userData"
        ></app-login-form>
      </div>

    </div>
  </div>
</template>


<script>
  import {mapActions} from 'vuex';
  import request from 'superagent';
  import LoginForm from '../components/LoginForm.vue';

  export default {
    components: {
      appLoginForm: LoginForm
    },

    data() {
      return {
        working: false,
        apiError: '',
        userData: {
          username: '',
          password: ''
        }
      };
    },

    methods: {
      onSubmit(event) {
        this.apiError = '';
        // TODO use the URL constants
        request.post('http://localhost:8000/api-token-auth/')
          .send(this.userData)
          .end((err, res) => {
            if (err) {
              this.apiError = 'Unable to log in with provided credentials.';
            } else {
              this.storeLogin(res.body);
              // TODO use the URL constants
              this.$router.push('/snippets');
            }
          })
      },

      ...mapActions({
        storeLogin: 'login'
      })
    }
  };
</script>


<style>
</style>
