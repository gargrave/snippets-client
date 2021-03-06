<template>
  <section>
    <h3 class="page-title">
      New Snippet
      <i
        v-if="working"
        class="fa fa-cog fa-spin"
        aria-hidden="true">
      </i>
    </h3>

    <el-card class="box-card">
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
          :working="working"
          :snippet="newSnippet"
          @submitted="onFormSubmitted"
          @cancelled="onFormCancelled">
        </app-snippet-form>

      </div><!-- /.text item -->
    </el-card>

  </section>
</template>

<script>
  import { mapActions } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import snippetData from '../helpers/snippetData';
  import SnippetForm from '../components/forms/SnippetForm.vue';

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

        // models for new snippet
        newSnippet: {
          title: '',
          url: ''
        }
      };
    },


    methods: {
      /**
       * Attempts to submit the current user data to the API to login.
       */
      onFormSubmitted(value, event) {
        const snippet = {
          title: value.title.trim() || snippetData.DEFAULT_TITLE,
          url: value.url.trim()
        };

        this.working = true;
        this.apiError = '';
        this.createSnippet(snippet)
          .then(() => {
            this.$router.push(localUrls.snippetsList);
            this.working = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
          });
      },

      onFormCancelled(value, event) {
        this.$router.push(localUrls.snippetsList);
      },

      ...mapActions([
        'checkForStoredLogin',
        'createSnippet'
      ])
    },


    created() {
      // redirect to login page if not logged in
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.working = false;
        }, (err) => {
          if (err === errors.INVALID_TOKEN) {
            this.$notify({
              title: 'Invalid auth token',
              message: 'Please login again.',
              type: 'warning'
            });
          }
          this.$router.push(localUrls.login);
          this.working = false;
        });
    }
  };
</script>
