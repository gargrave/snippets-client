<template>
  <div>
    <h2 class="page-title">{{ pageTitle }}</h2>

    <section v-if="refreshing">
      <!-- loading spinner -->
      <div
        class="snippets-list-working-spinner"
        v-loading="refreshing"
        element-loading-text="Working..."
        style="width: 100%; height: 160px;">
      </div><!-- loading spinner -->
    </section>

    <!-- snippets list, shown when not refreshing -->
    <section v-else>
      <app-new-snippet-card v-if="isMainListView"></app-new-snippet-card>

      <!-- API error display -->
      <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

      <div v-if="!refreshing">
        <!-- pinned Snippets list -->
        <div v-if="pinnedSnippets.length">
          <app-snippet-list-detail
            v-for="snippet in pinnedSnippets"
            :hidePinButton="!isMainListView"
            :snippet="snippet"
            :working="working"
            @quickUpdate="onQuickUpdate"
            @deleteSnippet="onDeleteSnippet">
          </app-snippet-list-detail>
          <hr class="snippets-hr">
        </div><!-- /pinned Snippets list -->

        <!-- unpinned Snippets list -->
        <app-snippet-list-detail
          v-for="snippet in unpinnedSnippets"
          :hidePinButton="!isMainListView"
          :snippet="snippet"
          :working="working"
          @quickUpdate="onQuickUpdate"
          @deleteSnippet="onDeleteSnippet">
        </app-snippet-list-detail>
      </div>
    </section><!-- /snippets list -->

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';
  import snippetData from '../helpers/snippetData';
  import NewSnippetCard from '../components/NewSnippetCard.vue';
  import SnippetListDetail from '../components/SnippetListDetail.vue';

  export default {
    components: {
      appNewSnippetCard: NewSnippetCard,
      appSnippetListDetail: SnippetListDetail
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // whether the list of Snippets is currently being refreshed
        refreshing: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // the filter (if any) for the current list view
        filterBy: ''
      };
    },


    computed: {
      // the title of the current page; differs based on filter settings
      pageTitle() {
        if (this.isArchivedView) {
          return 'Archived Snippets';
        } else if (this.isStarredView) {
          return 'Starred Snippets';
        }
        return 'My Snippets';
      },

      /** Returns a list of Snippets with 'pinned' status of true. */
      pinnedSnippets() {
        return this.snippets.filter(s => s.pinned === true);
      },

      /** Returns a list of Snippets with 'pinned' status of false. */
      unpinnedSnippets() {
        return this.snippets.filter(s => s.pinned === false);
      },

      /** Returns whether we are currently viewing the 'full' Snippets list (i.e. not filtered) */
      isMainListView() {
        return this.filterBy === '' || !this.filterBy;
      },

      /** Returns whether we are currently viewing the 'Archived Snippets' list. */
      isArchivedView() {
        return this.filterBy === 'archived';
      },

      /** Returns whether we are currently viewing the 'Starred Snippets' list. */
      isStarredView() {
        return this.filterBy === 'starred';
      },

      ...mapGetters([
        'snippets'
      ])
    },


    watch: {
      // watch for changes in the routes, and update the Snippets list when necessary
      // vue-router does not rebuild routes with the same base path, so we need to do
      // this to watch for changes in the 'filter' type
      '$route'(newValue, oldValue) {
        this.rebuildSnippetsList();
      }
    },


    methods: {
      rebuildSnippetsList() {
        let fetchCall = this.fetchSnippets;

        // check if we need to request a filtered list
        this.filterBy = this.$route.params.filterBy;
        if (this.filterBy) {
          if (this.isArchivedView) {
            fetchCall = this.fetchArchivedSnippets;
          } else if (this.isStarredView) {
            fetchCall = this.fetchStarredSnippets;
          }
        }

        this.apiError = '';
        this.working = true;
        this.refreshing = true;

        fetchCall()
          .then((res) => {
            this.working = false;
            this.refreshing = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
            this.refreshing = false;
          });
      },

      onQuickUpdate(value) {
        if (!this.working) {
          const foundSnippet = this.snippets.find(s => s.id === value.id);
          if (foundSnippet) {
            let removeAfterUpdate = false;
            let toast = '';
            // create a new object and set its 'id' property
            let snippet = Object.assign({}, snippetData.buildRecordData(foundSnippet));
            snippet.id = foundSnippet.id;

            // update any properties that were changed
            if (value.pinned !== undefined) {
              snippet.pinned = value.pinned;
            }

            if (value.color !== undefined) {
              snippet.color = value.color;
            }

            // for updating 'starred' status
            // Snippet will need to be removed from current view-list IF
            // we are currently viewing the starred list and the Snippet is being un-starred
            if (value.starred !== undefined) {
              snippet.starred = value.starred;
              removeAfterUpdate = !value.starred && this.isStarredView;
            }

            // for update 'archived' status
            // Snippet will need to be removed from current view-list UNLESS we are viewing the 'starred' list
            // show a toast to confirm completion
            if (value.archived !== undefined) {
              if (value.archived) {
                snippet.pinned = false;
                toast = 'Snippet archived';
              } else {
                toast = 'Snippet restored';
              }
              snippet.archived = value.archived;
              removeAfterUpdate = !this.isStarredView;
            }

            // call the action to save changes to the API
            this.apiError = '';
            this.working = true;
            this.updateSnippet({ snippet, removeAfterUpdate })
              .then((res) => {
                if (toast) {
                  this.$notify({
                    message: toast,
                    type: 'success'
                  });
                }
                this.working = false;
              }, (err) => {
                this.apiError = err;
                this.working = false;
              });
          }
        }
      },

      /**
       * Attempts to delete the specified Snippet (after user confirms)
       */
      onDeleteSnippet(snippetId) {
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
            this.deleteSnippet(snippetId)
              .then((res) => {
                this.$notify(msgNotify);
                this.working = false;
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
        'fetchSnippets',
        'fetchStarredSnippets',
        'fetchArchivedSnippets',
        'updateSnippet',
        'deleteSnippet',
      ])
    },


    created() {
      this.working = true;
      this.refreshing = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.rebuildSnippetsList();
          this.working = false;
          this.refreshing = false;
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
          this.refreshing = false;
        });
    }
  };
</script>
