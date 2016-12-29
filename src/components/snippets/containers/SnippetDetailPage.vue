<template>
  <div>
    <!-- Snippet detail panel -->
    <div :class="panelClass">
      <div class="panel-heading">
        <h4 class="panel-title">
          {{ originalSnippet.title }}
        </h4>
      </div>

      <div class="panel-body">
        <!-- API error display -->
        <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

        <app-snippet-form
          :snippet="snippet"
          :working="working"
          :errors="errors"
          :onSubmit="onSubmit"
          :onCancel="onCancel"
          @formDataChanged="onFormChanged"
        >
        </app-snippet-form>
      </div>
    </div>


    <!-- delete Snippet link -->
    <a href="" @click.prevent="onDelete">Delete this Snippet</a>
    <br/>
  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import toastr from 'toastr';

  import {localUrls} from '../../../appData/urls';
  import validate from '../../../utils/validate';
  import snippetData from '../helpers/snippetData';
  import snippetStyles from '../helpers/snippetStyles';
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

        snippet: {},
        originalSnippet: {},
      };
    },


    computed: {
      panelClass() {
        return snippetStyles.snippetPanel(this.snippet);
      },

      ...mapGetters([
        'isLoggedIn'
      ])
    },


    methods: {
      /**
       * Handler for input fields being changed on login form.
       */
      onFormChanged(value) {
        this.snippet.title = value.title;
        this.snippet.url = value.url;
      },

      /**
       * Attempts to send the current Snippet data to the API to be saved.
       */
      onSubmit() {
        toastr.warning('Check if Snippet is dirty before validation.', 'TODO');
        if (this.isValid()) {
          this.working = true;
          this.updateSnippet(snippetData.buildRecordData(this.snippet))
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
        const titleVal = validate(this.snippet.title, params);
        if (!titleVal.valid) {
          this.errors.title = titleVal.error;
          valid = false;
        }

        // validate password
        params = {required: true, format: 'url'};
        const urlVal = validate(this.snippet.url, params);
        if (!urlVal.valid) {
          this.errors.url = urlVal.error;
          valid = false;
        }

        return valid;
      },

      onDelete() {
        console.log('on delete click');
      },

      ...mapActions([
        'findSnippet',
        'updateSnippet'
      ])
    },


    /*
     * Search in route params for a Snippet ID. If none is found, redirect
     * to List page. If it is found, use it. Otherwise, redirect to List page.
     */
    created() {
      if (!this.isLoggedIn) {
        this.$router.push(localUrls.login);
      } else {
        const snippetId = this.$route.params.id;
        if (!snippetId) {
          this.$router.push(localUrls.snippetsList);
        } else {
          this.working = true;
          this.findSnippet(snippetId)
            .then((res) => {
              this.snippet = Object.assign({}, res);
              this.originalSnippet = Object.assign({}, res);
              this.working = false;
            }, (err) => {
              this.working = false;
              this.$router.push(localUrls.snippetsList);
            });
        }
      }
    }
  };
</script>


<style>
</style>
