<template>
  <div>

    <app-new-snippet-panel></app-new-snippet-panel>

    <!-- API error display -->
    <div class="alert alert-danger" v-if="apiError">Error: {{ apiError }}</div>

    <app-snippet-list-detail
      v-for="snippet in snippets"
      :snippet="snippet"
    ></app-snippet-list-detail>

  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';

  import {localUrls} from '../../../appData/urls';
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
      ...mapGetters([
        'authToken',
        'isLoggedIn',
        'snippets'
      ])
    },


    methods: {
      ...mapActions([
        'fetchSnippets'
      ])
    },


    created() {
      if (this.isLoggedIn) {
        this.working = true;
        this.fetchSnippets()
          .then((res) => {
            this.working = false;
          }, (err) => {
            this.apiError = err;
            this.working = false;
          });
      } else {
        this.$router.push(localUrls.login);
      }
    }
  };
</script>


<style>
</style>
