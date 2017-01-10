<template>
  <form @submit.prevent="onSubmit" novalidate>

    <!-- email input -->
    <app-input-field
      inputType="text"
      label="Email"
      name="email"
      placeholder="Email"
      :error="errors.email"
      @valueChanged="onEmailChange"
    ></app-input-field>

    <!-- user name input -->
    <app-input-field
      inputType="text"
      label="Username"
      name="username"
      placeholder="Username"
      :error="errors.username"
      @valueChanged="onUsernameChange"
    ></app-input-field>

    <!-- password input -->
    <app-input-field
      inputType="password"
      label="Password"
      name="password"
      placeholder="Password"
      :error="errors.password"
      @valueChanged="onPasswordChange"
    ></app-input-field>

    <!-- password confirm input -->
    <app-input-field
      inputType="password"
      label="Re-enter Password"
      name="passwordConfirm"
      placeholder="Re-enter Password"
      :error="errors.passwordConfirm"
      @valueChanged="onPasswordConfirmChange"
    ></app-input-field>


    <!-- submit button -->
    <input
      class="btn btn-primary"
      type="submit"
      value="Submit"
      :disabled="working"
    >

    <!-- cancel button -->
    <button
      class="btn btn-default pull-right"
      type="button"
      @click.prevent="onCancel"
    >Cancel</button>

  </form>
</template>


<script>
  import TextInput from '../../common/components/InputField.vue';

  export default {
    components: {
      appInputField: TextInput
    },


    props: {
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },
      // callback for form's "submit" event
      onSubmit: {
        type: Function,
        required: true
      },
      // callback for clicking cancel button
      onCancel: {
        type: Function,
        required: true
      },
      // any validation error messages
      errors: {
        type: Object,
        required: true
      }
    },


    data() {
      return {
        // the current data entered into the form
        loginUser: {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        }
      };
    },


    methods: {
      /**
       * Handler for 'email' input field being edited.
       */
      onEmailChange(value, event) {
        this.loginUser.email = value;
        this.$emit('formDataChanged', this.loginUser);
      },

      /**
       * Handler for 'user name' input field being edited.
       */
      onUsernameChange(value, event) {
        this.loginUser.username = value;
        this.$emit('formDataChanged', this.loginUser);
      },

      /**
       * Handler for 'password' input field being edited.
       */
      onPasswordChange(value, event) {
        this.loginUser.password = value;
        this.$emit('formDataChanged', this.loginUser);
      },

      /**
       * Handler for 'confirm password' input field being edited.
       */
      onPasswordConfirmChange(value, event) {
        this.loginUser.passwordConfirm = value;
        this.$emit('formDataChanged', this.loginUser);
      }
    }
  };
</script>


<style>
</style>
