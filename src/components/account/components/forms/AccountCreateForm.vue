<template>
  <el-form ref="form" :model="user" :rules="rules">

    <!-- email name input -->
    <el-form-item label="Email" prop="email">
      <span class="error-msg" v-if="apiFieldErrors.email">{{ apiFieldErrors.email }}</span>
      <el-input
        type="email"
        name="email"
        placeholder="Email"
        v-model="user.email"
        @blur="onEmailBlur">
      </el-input>
    </el-form-item>

    <!-- user name input -->
    <el-form-item label="Username" prop="username">
      <span class="error-msg" v-if="apiFieldErrors.username">{{ apiFieldErrors.username }}</span>
      <el-input
        type="text"
        name="username"
        placeholder="Username"
        v-model="user.username"
        @blur="onUsernameBlur">
      </el-input>
    </el-form-item>

    <!-- password input -->
    <el-form-item label="Password" prop="password">
      <span class="error-msg" v-if="apiFieldErrors.password">{{ apiFieldErrors.password }}</span>
      <el-input
        type="password"
        name="password"
        placeholder="Password"
        v-model="user.password"
        auto-complete="off">
      </el-input>
    </el-form-item>

    <!-- password input -->
    <el-form-item label="Confirm Password" prop="passwordConfirm">
      <span class="error-msg" v-if="apiFieldErrors.passwordConfirm">{{ apiFieldErrors.passwordConfirm }}</span>
      <el-input
        type="password"
        name="passwordConfirm"
        placeholder="Confirm Password"
        v-model="user.passwordConfirm"
        auto-complete="off">
      </el-input>
    </el-form-item>

    <el-form-item>
      <!-- submit button -->
      <el-button
        type="primary"
        native-type="submit"
        :disabled="working"
        @click.prevent="onSubmit">
        Submit
      </el-button>

      <!-- cancel button -->
      <el-button
        type="default"
        style="float: right;"
        :disabled="working"
        @click="onCancel">
        Cancel
      </el-button>
    </el-form-item>

  </el-form>
</template>


<script>
  export default {
    props: {
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },

      apiFieldErrors: {
        type: Object,
        required: true
      }
    },


    data() {
      let passwordConfirmValidator = (rule, value, callback) => {
        if (value !== this.user.password) {
          callback(new Error('Passwords do not match.'));
        } else {
          callback();
        }
      };

      return {
        // the current data entered into the form
        user: {
          email: '',
          username: '',
          password: '',
          passwordConfirm: ''
        },

        // validation rules
        rules: {
          email: [
            { required: true, message: 'Email is required.', trigger: 'blur' },
            { type: 'email', message: 'Must be a valid email address.', trigger: 'blur' }
          ],
          username: [
            { required: true, message: 'Username is required.', trigger: 'blur' },
            { min: 2, max: 24, message: 'Must be between 2 and 24 characters long.', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Password is required.', trigger: 'blur' },
            { min: 8, max: 50, message: 'Must be at least 8 characters long.', trigger: 'blur' }
          ],
          passwordConfirm: [
            { required: true, message: 'Please re-renter your password.', trigger: 'blur' },
            { validator: passwordConfirmValidator, trigger: 'blur,change' },
          ]
        }
      };
    },


    methods: {
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('submitted', this.user);
          }
        });
      },

      onCancel() {
        this.$emit('cancelled');
      },

      onEmailBlur() {
        this.$emit('emailBlur', this.user.email);
      },

      onUsernameBlur() {
        this.$emit('usernameBlur', this.user.username);
      }
    }
  };
</script>
