<template>
  <el-form ref="loginForm" :model="user" :rules="rules">

    <!-- user name input -->
    <el-form-item label="Username" prop="username">
      <el-input
        type="text"
        name="username"
        placeholder="Username"
        v-model="user.username">
      </el-input>
    </el-form-item>

    <!-- password input -->
    <el-form-item label="Password" prop="password">
      <el-input
        type="password"
        name="password"
        placeholder="Password"
        v-model="user.password">
      </el-input>
    </el-form-item>

    <el-form-item>
      <!-- submit button -->
      <el-button
        type="primary"
        :disabled="working"
        @click="onSubmit">
        Login
      </el-button>

      <!-- cancel button -->
      <el-button
        :disabled="working">
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
      }
    },


    data() {
      return {
        // the current data entered into the form
        user: {
          username: '',
          password: ''
        },

        // validation rules
        rules: {
          username: [
            { required: true, message: 'Username is required.', trigger: 'blur' },
            { min: 2, max: 24, message: 'Must be between 2 and 24 characters long.', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Password is required.', trigger: 'blur' },
            { min: 8, max: 50, message: 'Must be at least 8 characters long.', trigger: 'blue' }
          ]
        }
      };
    },


    methods: {
      onSubmit() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.$emit('submitted', this.user);
          }
        });
      }
    }
  };
</script>
