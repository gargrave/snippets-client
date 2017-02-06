<template>
  <div>
    <!-- page title display -->
    <h3 class="page-title">
      <span v-if="currentSearch">Search Results</span>
      <span v-else>{{ pageTitle }}</span>
      <!-- working icon for background tasks -->
      <i class="fa fa-spinner fa-spin" v-if="backgroundWorking"></i>
    </h3><!-- /page title display -->


    <!-- loading spinner -->
    <div
      class="snippets-list-working-spinner"
      v-loading="snippetsRefreshing || initializing"
      v-if="snippetsRefreshing || initializing"
      element-loading-text="Working..."
      style="width: 100%; height: 160px;">
    </div><!-- loading spinner -->


    <!-- snippets list, shown when not snippetsRefreshing -->
    <transition name="fade">
      <section v-if="!initializing && !snippetsRefreshing">
        <!-- search results display (when applicable) -->
        <el-alert
          id="search-alert"
          v-if="currentSearch"
          type="info"
          title=""
          close-text="Reset"
          @close="onClearSearch">
          {{ snippets.length }} matching: <strong>{{ currentSearch }}</strong>
        </el-alert>


        <!-- 'add a new snippet' link -->
        <app-new-snippet-card
          v-if="isMainListView && !currentSearch"
          :working="working">
        </app-new-snippet-card>


        <!-- API error display -->
        <el-alert
          type="error"
          v-if="apiError"
          :description="apiError">
        </el-alert>


        <!-- full Snippets list -->
        <app-full-snippets-list
          v-if="isMainListView"
          :working="working"
          :snippets="snippets"
          @quickUpdate="onQuickUpdate"
          @deleteSnippet="onDeleteSnippet"
          @onTagButtonClicked="onTagButtonClicked">
        </app-full-snippets-list>

        <!-- filtered Snippets list -->
        <app-filtered-snippets-list
          v-else
          :working="working"
          :snippets="snippets"
          @quickUpdate="onQuickUpdate"
          @deleteSnippet="onDeleteSnippet"
          @onTagButtonClicked="onTagButtonClicked">
        </app-filtered-snippets-list>

      </section><!-- /snippets list -->
    </transition>

    <app-tag-editor
      :snippet="activeSnippet"
      :showing="tagEditorShowing"
      @close="onTagEditorClose">
    </app-tag-editor>

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';
  import snippetData from '../helpers/snippetData';
  import FullSnippetsList from '../components/list-views/FullSnippetsList';
  import NewSnippetCard from '../components/NewSnippetCard.vue';
  import FilteredSnippetsList from '../components/list-views/FilteredSnippetsList';
  import TagEditor from '../components/dialogs/TagEditor';

  export default {
    components: {
      appFullSnippetsList: FullSnippetsList,
      appNewSnippetCard: NewSnippetCard,
      appFilteredSnippetsList: FilteredSnippetsList,
      appTagEditor: TagEditor,
    },


    data() {
      return {
        initializing: true,

        // whether any operations are currently running
        working: false,

        // whether any background operations (e.g. 'quick update') are running
        backgroundWorking: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // the filter (if any) for the current list view
        filterBy: '',

        activeSnippet: {},

        tagEditorShowing: false
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
        'snippetsRefreshing',
        'snippets',
        'currentSearch'
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

        fetchCall()
          .then((res) => {
            this.working = false;
            this.initializing = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
            this.initializing = false;
          });

        // make sure the tags list gets initialized (no need to handle the promise here)
        this.initTags();
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

            // set the 'backgroundWorking' flag after a short timeout
            // this will make it so that the working icon will only show up
            // if the request takes a bit longer
            setTimeout(() => {
              if (this.working) {
                this.backgroundWorking = true;
              }
            }, 400);

            this.updateSnippet({ snippet, removeAfterUpdate })
              .then((res) => {
                if (toast) {
                  this.$notify({
                    message: toast,
                    type: 'success'
                  });
                }
                this.working = false;
                this.backgroundWorking = false;
              }, (err) => {
                this.apiError = err;
                this.working = false;
                this.backgroundWorking = false;
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

      onClearSearch() {
        if (this.isMainListView) {
          this.rebuildSnippetsList();
        } else {
          this.$router.push({ name: 'snippets-list' });
        }
      },

      /*=============================================
       = Snippet tagging methods
       =============================================*/
      onTagButtonClicked(snippet, event) {
        this.activeSnippet = snippet;
        this.tagEditorShowing = true;
      },

      onTagEditorClose() {
        this.tagEditorShowing = false;
        this.activeSnippet = {};
      },

      ...mapActions([
        'checkForStoredLogin',
        'fetchSnippets',
        'fetchStarredSnippets',
        'fetchArchivedSnippets',
        'updateSnippet',
        'deleteSnippet',
        'initTags',
      ])
    },


    created() {
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.rebuildSnippetsList();
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


<style scoped>
  .fa-spinner {
    display: block;
    margin-top: 14px;
  }
</style>
