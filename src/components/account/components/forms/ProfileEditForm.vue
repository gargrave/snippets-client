<template>
  <el-form ref="form" :model="profile" :rules="rules">

    <!-- first name title input -->
    <el-form-item label="First name" prop="firstName">
      <el-input
        type="text"
        name="firstName"
        placeholder="First name (optional)"
        v-model="profile.firstName">
      </el-input>
    </el-form-item>

    <!-- last name title input -->
    <el-form-item label="Last name" prop="lastName">
      <el-input
        type="text"
        name="lastName"
        placeholder="Last name (optional)"
        v-model="profile.lastName">
      </el-input>
    </el-form-item>

    <el-form-item>
      <!-- submit button -->
      <el-button
        type="primary"
        native-type="submit"
        :disabled="working"
        @click.prevent="onSubmit">
        Save
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
      // profile being created/edited (e.g. for detail/edit view)
      profile: {
        type: Object,
        required: true
      }
    },


    data() {
      return {
        // validation rules
        rules: {
          firstName: [
            { max: 100, message: 'Must be no more than 100 characters long.', trigger: 'blur' }
          ],
          lastName: [
            { max: 100, message: 'Must be no more than 100 characters long.', trigger: 'blur' }
          ]
        }
      };
    },


    methods: {
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('submitted', this.snippet);
          }
        });
      },

      onCancel() {
        this.$emit('cancelled');
      }
    }
  };
</script>
