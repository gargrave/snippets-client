<template>
  <form @submit.prevent="onSubmit" novalidate>

    <!-- snippet title input -->
    <app-input-field
      inputType="text"
      label="Title"
      name="title"
      placeholder="Snippet Title (optional)"
      :value="snippet.title"
      :error="errors.title"
      @valueChanged="onTitleChange"
    ></app-input-field>

    <!-- snippet url input -->
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


    methods: {
      onTitleChange(value, event) {
        const updatedSnippet = Object.assign({}, this.snippet);
        updatedSnippet.title = value;
        this.$emit('formDataChanged', updatedSnippet);
      },

      onUrlChange(value, event) {
        const updatedSnippet = Object.assign({}, this.snippet);
        updatedSnippet.url = value;
        this.$emit('formDataChanged', updatedSnippet);
      }
    }
  };
</script>


<style>
</style>
