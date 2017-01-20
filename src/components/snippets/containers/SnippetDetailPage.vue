<template>
  <section>

    <h2 class="page-title">{{ originalSnippet.title }}</h2>

    <el-card
      class="box-card"
      v-loading="working"
      element-loading-text="Working..."
      style="width: 100%">

      <div class="text item">

        <!-- error message display -->
        <el-alert
          title="Snippet Creation Error"
          type="error"
          v-if="apiError"
          :description="apiError"
          :closable="false">
        </el-alert>

        <!-- snippet form -->
        <app-snippet-form
          submitText="Save"
          cancelText="Back"
          :working="working"
          :snippet="snippet"
          @submitted="onFormSubmitted"
          @cancelled="onFormCancelled">
        </app-snippet-form>

      </div><!-- /.text item -->
    </el-card>

    <hr class="snippets-hr">

    <el-card
      class="box-card"
      v-loading="working"
      element-loading-text="Working..."
      style="width: 100%">
      <div class="text item">

        <el-button
          type="danger"
          class="block-btn"
          @click="onDelete">
          Delete
        </el-button>

      </div><!-- /.text item -->
    </el-card>

  </section>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';
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

        // whether the Snippet data is currently being refreshed
        refreshing: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // the working copy of the Snippet
        snippet: {},

        // a copy of the Snippet, used for checking for changes
        originalSnippet: {},
      };
    },


    methods: {
      /**
       * Attempts to submit the current user data to the API to login.
       */
      onFormSubmitted(value, event) {
        const msgNotify = {
          type: 'info',
          title: 'Cannot Update',
          message: 'No changes to save.'
        };

        const updatedSnippet = snippetData.buildRecordData(this.snippet);
        updatedSnippet.title = value.title.trim() || snippetData.DEFAULT_TITLE;
        updatedSnippet.url = value.url.trim();

        if (updatedSnippet.title === this.originalSnippet.title &&
            updatedSnippet.url === this.originalSnippet.url) {
          // if the Snippet has not changed, show a message and do not submit the update
          this.$notify(msgNotify);
        } else {
          // otherwise, submit the update to the API
          this.working = true;
          this.apiError = '';

          this.updateSnippet({ snippet: updatedSnippet })
            .then(() => {
              this.$router.push(localUrls.snippetsList);
              this.working = false;
            }, (err) => {
              this.apiError = err;
              this.working = false;
            });
        }
      },

      onFormCancelled(value, event) {
        this.$router.go(-1);
      },

      /**
       * Handler for click event on 'delete' button/link.
       */
      onDelete() {
        const msgConfirm = {
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
          type: 'warning'
        };
        const msgNotify = {
          type: 'success',
          message: 'Snippet deleted'
        };

        this.$confirm('Delete this Snippet?', 'Confirm', msgConfirm)
          .then(() => {
            this.working = true;

            this.deleteSnippet(this.snippet.id)
              .then((res) => {
                this.$notify(msgNotify);
                this.working = false;
                this.$router.push(localUrls.snippetsList);
              }, (err) => {
                this.apiError = err;
                this.working = false;
              });
          })
          .catch(() => {
            // cancel deletion; no action needed
          });
      },

      ...mapActions([
        'checkForStoredLogin',
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
      this.working = true;
      this.refreshing = true;
      this.checkForStoredLogin()
        .then((res) => {
          const snippetId = this.$route.params.id;
          if (!snippetId) {
            this.$router.push(localUrls.snippetsList);
          } else {
            this.findSnippet(snippetId)
              .then((res) => {
                // if we get a valid Snippet, save two local copies
                this.snippet = Object.assign({}, res);
                this.originalSnippet = Object.assign({}, res);
                this.working = false;
                this.refreshing = false;
              }, (err) => {
                // if no valid Snippet, return to the List view
                this.$notify({
                  message: 'Invalid Snippet ID',
                  type: 'info'
                });
                this.working = false;
                this.refreshing = false;
                this.$router.push(localUrls.snippetsList);
              });
          }
        }, (err) => {
          // token error; logout and redirect to login page
          if (err === errors.INVALID_TOKEN) {
            this.$notify({
              title: 'Invalid auth token',
              message: 'Please login again.',
              type: 'warning'
            });
          }
          this.$router.push(localUrls.login);
          this.working = false;
          this.refreshing = false;
        });
    }
  };
</script>
