<template>
  <div>
    <app-new-snippet-panel v-if="isMainListView"></app-new-snippet-panel>

    <!-- API error display -->
    <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

    <div v-if="!refreshing">
      <!-- pinned Snippets list -->
      <div v-if="pinnedSnippets.length">
        <app-snippet-list-detail
          v-for="snippet in pinnedSnippets"
          :isArchivedView="isArchivedView"
          :snippet="snippet"
          :working="working"
          @quickUpdate="onQuickUpdate">
        </app-snippet-list-detail>
        <hr class="snippets-hr">
      </div><!-- /pinned Snippets list -->

      <!-- unpinned Snippets list -->
      <app-snippet-list-detail
        v-for="snippet in unpinnedSnippets"
        :isArchivedView="isArchivedView"
        :snippet="snippet"
        :working="working"
        @quickUpdate="onQuickUpdate">
      </app-snippet-list-detail>
    </div>

  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import toastr from 'toastr';

  import {localUrls} from '../../../appData/urls';
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
        filterBy: '',
      };
    },


    computed: {
      pinnedSnippets() {
        return this.snippets.filter(s => s.pinned === true);
      },

      unpinnedSnippets() {
        return this.snippets.filter(s => s.pinned === false);
      },

      isMainListView() {
        console.log('this.filterBy:');
        console.log(this.filterBy);
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

        // check if we need to request a filtered list
        this.filterBy = this.$route.params.filterBy;
        if (this.filterBy) {
          if (this.isArchivedView) {
            fetchCall = this.fetchArchivedSnippets;
          } else if (this.isStarredView) {
            toastr.warning('implement starred view', 'TODO');
          }
        }

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
            if (value.starred !== undefined) {
              snippet.starred = value.starred;
            }
            if (value.color !== undefined) {
              snippet.color = value.color;
            }
            if (value.archived !== undefined) {
              if (value.archived) {
                snippet.pinned = false;
                toast = 'Snippet archived';
              } else {
                toast = 'Snippet restored';
              }
              snippet.archived = value.archived;
              removeAfterUpdate = true;
            }

            // call the action to save changes to the API
            this.working = true;
            this.updateSnippet({snippet, removeAfterUpdate})
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
        'fetchSnippets',
        'fetchArchivedSnippets',
        'updateSnippet',
      ])
    },


    created() {
      if (this.isLoggedIn) {
        this.rebuildSnippetsList();
      } else {
        this.$router.push(localUrls.login);
      }
    }
  };
</script>


<style>
</style>
