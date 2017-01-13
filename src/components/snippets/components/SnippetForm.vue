<template>
  <el-form ref="form" :model="snippet" :rules="rules">

    <!-- snippet title input -->
    <el-form-item label="Title" prop="title">
      <el-input
        type="text"
        name="title"
        placeholder="Snippet Title (optional)"
        v-model="snippet.title">
      </el-input>
    </el-form-item>

    <!-- snippet url input -->
    <el-form-item label="URL" prop="url">
      <el-input
        type="text"
        name="url"
        placeholder="Snippet URL"
        v-model="snippet.url">
      </el-input>
    </el-form-item>

    <el-form-item>
      <!-- submit button -->
      <el-button
        type="primary"
        :disabled="working"
        @click="onSubmit">
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
<!--
  <form @submit.prevent="onSubmit" novalidate>

    <app-input-field
      inputType="text"
      label="Title"
      name="title"
      placeholder="Snippet Title (optional)"
      :value="snippet.title"
      :error="errors.title"
      @valueChanged="onTitleChange"
    ></app-input-field>

    <app-input-field
      inputType="text"
      label="URL"
      name="url"
      placeholder="Snippet URL"
      :value="snippet.url"
      :error="errors.url"
      @valueChanged="onUrlChange"
    ></app-input-field>

    <app-submit-cancel-btn-group
      :submitText="submitText"
      :working="working"
      :disableSubmit="!snippetIsDirty"
      :onCancelClick="onCancel"
    ></app-submit-cancel-btn-group>

  </form>
-->
</template>


<script>
  import snippetData from '../helpers/snippetData';
  import InputField from '../../common/components/InputField.vue';
  import SubmitCancelBtnGroup from '../../common/components/SubmitCancelBtnGroup.vue';

  export default {
    components: {
      appInputField: InputField,
      appSubmitCancelBtnGroup: SubmitCancelBtnGroup
    },


    props: {
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },
      // snippet being created/edited (e.g. for detail/edit view)
      snippet: {
        type: Object,
        required: true
      },
      // text to display on submit button
      submitText: {
        type: String,
        required: false,
        default: 'Submit'
      },
      // whether the Snippet has unsaved changes (only necessary on 'edit' page)
      snippetIsDirty: {
        type: Boolean,
        required: false,
        default: true
      }
    },


    data() {
      return {
        // validation rules
        rules: {
          title: [
            { max: 255, message: 'Must be no more than 255 characters long.', trigger: 'blur' }
          ],
          url: [
            { required: true, message: 'URL is required.', trigger: 'blur' },
            { max: 200, message: 'Must be no more than 200 characters long.', trigger: 'blur' },
            { type: 'url', message: 'Must be a valid URL.', trigger: 'blur,change' }
          ]
        }
      }
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


<style>
</style>
