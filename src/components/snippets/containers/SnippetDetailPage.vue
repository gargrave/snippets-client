<template>
  <div>
    <!-- loading icon -->
    <app-loading-icon v-if="refreshing"></app-loading-icon>

    <!-- Snippet detail panel -->
    <div :class="panelClass" v-else>
      <div class="panel-heading">
        <h4 class="panel-title">
          {{ originalSnippet.title }}
        </h4>
      </div>

      <div class="panel-body">
        <!-- API error display -->
        <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

        <app-snippet-form
          submitText="Update"
          :snippet="snippet"
          :working="working"
          :errors="errors"
          :onSubmit="onSubmit"
          :onCancel="onCancel"
          :snippetIsDirty="snippetIsDirty"
          @formDataChanged="onFormChanged">

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
  import LoadingIcon from '../../common/components/LoadingSpinner.vue';
  import SnippetForm from '../components/SnippetForm.vue';

  export default {
    components: {
      appLoadingIcon: LoadingIcon,
      appSnippetForm: SnippetForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // whether the Snippet data is currently being refreshed
        refreshing: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // local validation errors (e.g. missing field)
        errors: {
          title: '',
          url: ''
        },

        // whether the Snippet has unsaved edits
        snippetIsDirty: false,

        // the working copy of the Snippet
        snippet: {},
        // a copy of the Snippet, used for checking for changes
        originalSnippet: {},
      };
    },


    computed: {
      /*
       * The class for the top-level BS panel component; will change
       * based on the Snippet's 'color' property.
       */
      panelClass() {
        return snippetStyles.snippetPanel(this.snippet);
      },

      ...mapGetters([
        'isLoggedIn'
      ])
    },


    methods: {
      /**
       * Checks if the current Snippet has unsaved edits.
       */
      updateDirtyState() {
        this.snippetIsDirty = false;

        // compare snippet 'title' properties
        let titleOrig = this.originalSnippet.title;
        let titleNew = this.snippet.title.trim();
        if (titleNew !== titleOrig) {
          this.snippetIsDirty = true;
        }

        // compare urls
        let urlOrig = this.originalSnippet.url;
        let urlNew = this.snippet.url;
        if (urlNew && urlOrig !== urlNew) {
          this.snippetIsDirty = true;
        }
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

        // validate title
        params = {minLength: 3};
        const titleVal = validate(this.snippet.title, params);
        if (!titleVal.valid) {
          this.errors.title = titleVal.error;
          valid = false;
        }

        // validate url
        params = {required: true, format: 'url'};
        const urlVal = validate(this.snippet.url, params);
        if (!urlVal.valid) {
          this.errors.url = urlVal.error;
          valid = false;
        }

        return valid;
      },

      /**
       * Handler for input fields being changed on login form.
       */
      onFormChanged(value) {
        this.snippet.title = value.title;
        this.snippet.url = value.url;
        this.updateDirtyState();
      },

      /**
       * Attempts to send the current Snippet data to the API to be saved.
       */
      onSubmit() {
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
        this.$router.go(-1);
      },

      /**
       * Handler for click event on 'delete' button/link.
       */
      onDelete() {
        // TODO replace this alert
        if (confirm('Delete this Snippet?')) {
          this.working = true;
          this.deleteSnippet(this.snippet.id)
            .then((res) => {
              toastr.success('Snippet deleted');
              this.working = false;
              this.$router.push(localUrls.snippetsList);
            }, (err) => {
              this.apiError = err;
              this.working = false;
            });
        }
      },

      ...mapActions([
        'findSnippet',
        'updateSnippet',
        'deleteSnippet',
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
          this.refreshing = true;
          this.findSnippet(snippetId)
            .then((res) => {
              // if we get a valid Snippet, save two local copies
              this.snippet = Object.assign({}, res);
              this.originalSnippet = Object.assign({}, res);
              this.working = false;
              this.refreshing = false;
            }, (err) => {
              // if no valid Snippet, return to the List view
              this.working = false;
              this.refreshing = false;
              this.$router.push(localUrls.snippetsList);
            });
        }
      }
    }
  };
</script>


<style>
</style>
