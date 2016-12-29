<template>
  <div>
    <!-- 'New Snippet' panel -->
    <div class="panel panel-default snippet-panel snippet-color-white new-snippet-form-panel">
      <div class="panel-heading">
        <h3 class="panel-title">New Snippet</h3>
      </div>

      <div class="panel-body">
        <!-- API error display -->
        <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

        <app-snippet-form
          :snippet="newSnippet"
          :working="working"
          :errors="errors"
          :onSubmit="onSubmit"
          :onCancel="onCancel"
          @formDataChanged="onFormChanged"
        >
        </app-snippet-form>
      </div><!-- /panel-body -->
    </div><!-- /panel -->
  </div>
</template>


<script>
  import {mapActions} from 'vuex';

  import {localUrls} from '../../../appData/urls';
  import validate from '../../../utils/validate';
  import snippetData from '../helpers/snippetData';
  import SnippetForm from '../components/SnippetForm.vue';

  export default {
    components: {
      appSnippetForm: SnippetForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // local validation errors (e.g. missing field)
        errors: {
          title: '',
          url: ''
        },

        // models for new snippet
        newSnippet: {
          title: '',
          url: ''
        }
      };
    },


    methods: {
      /**
       * Handler for input fields being changed on login form.
       */
      onFormChanged(value) {
        this.newSnippet = {
          title: value.title,
          url: value.url
        };
      },

      /**
       * Attempts to send the current Snippet data to the API to be saved.
       */
      onSubmit() {
        if (this.isValid()) {
          const snippet = {
            title: this.newSnippet.title.trim() || snippetData.DEFAULT_TITLE,
            url: this.newSnippet.url.trim()
          };

          this.working = true;
          this.createSnippet(snippet)
            .then((res) => {
              this.working = false;
              this.$router.push(localUrls.snippetsList);
            }, (err) => {
              this.apiError = err;
              this.working = false;
            });
        }
      },

      /**
       * Callback for 'cancel' button; rereoute to Snippets list page.
       */
      onCancel() {
        this.$router.push(localUrls.snippetsList);
      },

      /**
       * Validates the user data currently entered into the form.
       *
       * @returns {boolean} Whether the data validates correctly.
       */
      isValid() {
        let valid = true;
        let params;

        this.errors = {
          title: '',
          url: ''
        };

        // validate username
        params = {minLength: 3};
        const titleVal = validate(this.newSnippet.title, params);
        if (!titleVal.valid) {
          this.errors.title = titleVal.error;
          valid = false;
        }

        // validate password
        params = {required: true, format: 'url'};
        const urlVal = validate(this.newSnippet.url, params);
        if (!urlVal.valid) {
          this.errors.url = urlVal.error;
          valid = false;
        }

        return valid;
      },

      ...mapActions([
        'createSnippet'
      ])
    }
  };
</script>


<style>
</style>
