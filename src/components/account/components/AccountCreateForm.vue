<template>
  <form @submit.prevent="onSubmit" novalidate>

    <!-- email input -->
    <app-input-field
      inputType="text"
      label="Email"
      name="email"
      placeholder="Email"
      :value="userData.email"
      :error="errors.email"
      @valueChanged="onEmailChange">
    </app-input-field>

    <!-- user name input -->
    <app-input-field
      inputType="text"
      label="Username"
      name="username"
      placeholder="Username"
      :value="userData.username"
      :error="errors.username"
      @valueChanged="onUsernameChange">
    </app-input-field>

    <!-- password input -->
    <app-input-field
      inputType="password"
      label="Password"
      name="password"
      placeholder="Password"
      :value="userData.password"
      :error="errors.password"
      @valueChanged="onPasswordChange">
    </app-input-field>

    <!-- password confirm input -->
    <app-input-field
      inputType="password"
      label="Confirm Password"
      name="passwordConfirm"
      placeholder="Confirm Password"
      :value="userData.passwordConfirm"
      :error="errors.passwordConfirm"
      @valueChanged="onPasswordConfirmChange">
    </app-input-field>


    <!-- submit button -->
    <input
      class="btn btn-primary"
      type="submit"
      value="Submit"
      :disabled="working">

    <!-- cancel button -->
    <button
      class="btn btn-default pull-right"
      type="button"
      @click.prevent="onCancel"
      :disabled="working">
      Cancel
    </button>

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
       * Handler for 'email' input field being edited.
       */
      onEmailChange(value, event) {
        this.userData.email = value;
        this.$emit('formDataChanged', this.userData);
      },

      /**
       * Handler for 'user name' input field being edited.
       */
      onUsernameChange(value, event) {
        this.userData.username = value;
        this.$emit('formDataChanged', this.userData);
      },

      /**
       * Handler for 'password' input field being edited.
       */
      onPasswordChange(value, event) {
        this.userData.password = value;
        this.$emit('formDataChanged', this.userData);
      },

      /**
       * Handler for 'confirm password' input field being edited.
       */
      onPasswordConfirmChange(value, event) {
        this.userData.passwordConfirm = value;
        this.$emit('formDataChanged', this.userData);
      }
    }
  };
</script>
