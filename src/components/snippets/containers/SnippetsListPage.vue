<template>
  <div>
    <app-new-snippet-panel></app-new-snippet-panel>

    <!-- API error display -->
    <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

    <!-- pinned Snippets list -->
    <div v-if="pinnedSnippets.length">
      <app-snippet-list-detail
        v-for="snippet in pinnedSnippets"
        :snippet="snippet"
        :working="working"
        @quickUpdate="onQuickUpdate">
      </app-snippet-list-detail>
      <hr class="snippets-hr">
    </div>

    <!-- unpinned Snippets list -->
    <app-snippet-list-detail
      v-for="snippet in unpinnedSnippets"
      :snippet="snippet"
      :working="working"
      @quickUpdate="onQuickUpdate">
    </app-snippet-list-detail>

  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';

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

        // error messages returned from API (e.g. invalid data)
        apiError: '',
      };
    },


    computed: {
      pinnedSnippets() {
        return this.snippets.filter(s => s.pinned === true);
      },

      unpinnedSnippets() {
        return this.snippets.filter(s => s.pinned === false);
      },

      ...mapGetters([
        'authToken',
        'isLoggedIn',
        'snippets'
      ])
    },


    watch: {
      '$route'(newValue, oldValue) {
        this.rebuildSnippetsListForRoute();
      }
    },


    methods: {
      rebuildSnippetsListForRoute() {
        let fetchCall = this.fetchSnippets;
        // check if we need to request a filtered list
        const filterBy = this.$route.params.filterBy;
        if (filterBy) {
          if (filterBy === 'archived') {
            fetchCall = this.fetchArchivedSnippets;
          }
        }

        this.working = true;
        fetchCall()
          .then((res) => {
            this.working = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
          });
      },

      onQuickUpdate(value) {
        if (!this.working) {
          const foundSnippet = this.snippets.find(s => s.id === value.id);
          if (foundSnippet) {
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
              snippet.archived = value.archived;
            }

            // call the action to save changes to the API
            this.working = true;
            this.updateSnippet(snippet)
              .then((res) => {
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
        this.rebuildSnippetsListForRoute();
      } else {
        this.$router.push(localUrls.login);
      }
    }
  };
</script>


<style>
</style>
