<template>
  <form @submit.prevent="onSubmit" novalidate>

    <!-- snippet title input -->
    <app-input-field
      inputType="text"
      label="Title"
      name="title"
      placeholder="Snippet Title (optional)"
      :error="errors.title"
      @valueChanged="onTitleChange"
    ></app-input-field>

    <!-- snippet url input -->
    <app-input-field
      inputType="text"
      label="URL"
      name="url"
      placeholder="Snippet URL"
      :error="errors.url"
      @valueChanged="onUrlChange"
    ></app-input-field>

    <app-submit-cancel-btn-group
      :working="working"
      :disableSubmit="false"
      :onCancelClick="onCancel"
    ></app-submit-cancel-btn-group>

  </form>
</template>


<script>
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
      // any validation error messages
      errors: {
        type: Object,
        required: true
      },
      // handler for submission
      onSubmit: {
        type: Function,
        required: true
      },
      // handler for cancelling submission
      onCancel: {
        type: Function,
        required: true
      }
    },


    data() {
      return {
        newSnippetData: {
          title: '',
          url: ''
        }
      }
    },


    methods: {
      onTitleChange(value, event) {
        this.newSnippetData.title = value;
        this.$emit('formDataChanged', this.newSnippetData);
      },

      onUrlChange(value, event) {
        this.newSnippetData.url = value;
        this.$emit('formDataChanged', this.newSnippetData);
      }
    }
  };
</script>


<style>
</style>
