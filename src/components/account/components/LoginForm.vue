<template>
  <form @submit.prevent="onSubmit" novalidate>

    <!-- user name input -->
    <app-input-field
      inputType="text"
      label="Username"
      name="username"
      placeholder="Username"
      :value="loginUser.username"
      :error="errors.username"
      @valueChanged="onUsernameChange">
    </app-input-field>

    <!-- password input -->
    <app-input-field
      inputType="password"
      label="Password"
      name="password"
      placeholder="Password"
      :value="loginUser.password"
      :error="errors.password"
      @valueChanged="onPasswordChange">
    </app-input-field>

    <input
      class="btn btn-primary"
      type="submit"
      value="Submit"
      :disabled="working">

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
          username: '',
          password: ''
        }
      };
    },


    methods: {
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
      }
    }
  };
</script>
