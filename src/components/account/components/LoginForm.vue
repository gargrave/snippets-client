<template>
  <div>
    <form @submit.prevent="onSubmit">

      <app-input-field
        inputType="text"
        label="Username"
        name="username"
        placeholder="Username"
        @valueChanged="onUsernameChange"
      ></app-input-field>

      <app-input-field
        inputType="password"
        label="Password"
        name="password"
        placeholder="Password"
        @valueChanged="onPasswordChange"
      ></app-input-field>

      <input class="btn btn-primary" type="submit" value="Submit">
    </form>
  </div>
</template>


<script>
  import TextInput from '../../common/components/InputField.vue';

  export default {
    components: {
      appInputField: TextInput
    },


    props: {
      working: {
        type: Boolean,
        required: true
      },
      onSubmit: {
        type: Function,
        required: true
      }
    },


    data() {
      return {
        loginUser: {
          username: '',
          password: ''
        }
      }
    },


    methods: {
      onUsernameChange(value, event) {
        this.loginUser.username = value;
        this.$emit('formDataChanged', this.loginUser);
      },

      onPasswordChange(value, event) {
        this.loginUser.password = value;
        this.$emit('formDataChanged', this.loginUser);
      }
    }
  };
</script>


<style>
</style>
