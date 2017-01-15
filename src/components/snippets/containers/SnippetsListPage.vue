<template>
  <div>
    <h2 class="page-title">{{ pageTitle }}</h2>

    <!-- loading spinner -->
    <div
      class="snippets-list-working-spinner"
      v-loading="refreshing"
      element-loading-text="Working..."
      style="width: 100%; height: 160px;"
      v-if="refreshing">
    </div><!-- loading spinner -->

    <!-- snippets list, shown when not refreshing -->
    <div v-else>
      <app-new-snippet-panel v-if="isMainListView"></app-new-snippet-panel>

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
            @quickUpdate="onQuickUpdate">
          </app-snippet-list-detail>
          <hr class="snippets-hr">
        </div><!-- /pinned Snippets list -->

        <!-- unpinned Snippets list -->
        <app-snippet-list-detail
          v-for="snippet in unpinnedSnippets"
          :hidePinButton="!isMainListView"
          :snippet="snippet"
          :working="working"
          @quickUpdate="onQuickUpdate">
        </app-snippet-list-detail>
      </div>
    </div><!-- /snippets list -->

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import toastr from 'toastr';

  import { localUrls } from '../../../appData/urls';
  import errors from '../../../appData/errors';
  import snippetData from '../helpers/snippetData';
  import NewSnippetPanel from '../components/NewSnippetPanel.vue';
  import SnippetListDetail from '../components/SnippetListDetail.vue';

  export default {
    components: {
      appNewSnippetPanel: NewSnippetPanel,
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
      // the title of the current page
      pageTitle() {
        if (this.isArchivedView) {
          return 'Archived Snippets';
        } else if (this.isStarredView) {
          return 'Starred Snippets';
        }
        return 'My Snippets';
      },

      pinnedSnippets() {
        return this.snippets.filter(s => s.pinned === true);
      },

      unpinnedSnippets() {
        return this.snippets.filter(s => s.pinned === false);
      },

      isMainListView() {
        return this.filterBy === '' || !this.filterBy;
      },

      isArchivedView() {
        return this.filterBy === 'archived';
      },

      isStarredView() {
        return this.filterBy === 'starred';
      },

      ...mapGetters([
        'authToken',
        'isLoggedIn',
        'snippets'
      ])
    },


    watch: {
      '$route'(newValue, oldValue) {
        this.rebuildSnippetsList();
      }
    },


    methods: {
      rebuildSnippetsList() {
        let fetchCall = this.fetchSnippets;
        this.setBreadcrumbTitle('');

        // check if we need to request a filtered list
        this.filterBy = this.$route.params.filterBy;
        if (this.filterBy) {
          if (this.isArchivedView) {
            this.setBreadcrumbTitle('Archived');
            fetchCall = this.fetchArchivedSnippets;
          } else if (this.isStarredView) {
            this.setBreadcrumbTitle('Starred');
            fetchCall = this.fetchStarredSnippets;
          }
        }

        this.apiError = '';
        this.working = true;
        this.refreshing = true;
        setTimeout(() => {
        fetchCall()
          .then((res) => {
            this.working = false;
            this.refreshing = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
            this.refreshing = false;
          });
        }, 1000);
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
                  toastr.success(toast);
                }
                this.working = false;
              }, (err) => {
                this.apiError = err;
                this.working = false;
              });
          }
        }
      },

      ...mapActions([
        'setBreadcrumbTitle',
        'fetchSnippets',
        'fetchStarredSnippets',
        'fetchArchivedSnippets',
        'updateSnippet',
        'checkForStoredLogin'
      ])
    },


    created() {
      this.checkForStoredLogin()
        .then((res) => {
          this.rebuildSnippetsList();
        }, (err) => {
          if (err === errors.INVALID_TOKEN) {
            toastr.info('Please login again.', 'Invalid auth token');
          }
          this.$router.push(localUrls.login);
        });
    }
  };
</script>
