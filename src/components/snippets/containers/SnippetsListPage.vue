<template>
  <div>

    <app-new-snippet-panel></app-new-snippet-panel>

    <div class="panel panel-default" v-for="snippet in snippets">
      <div class="panel-heading">
        <h3 class="panel-title">{{ snippet.title }}</h3>
      </div>

      <div class="panel-body">
        {{ snippet.url }}
      </div>
    </div>

  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';

  import {localUrls} from '../../../appData/urls';
  import NewSnippetPanel from '../components/NewSnippetPanel.vue';

  export default {
    components: {
      appNewSnippetPanel: NewSnippetPanel
    },


    data() {
      return {
        // whether any operations are currently running
        working: false
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
            // TODO: show error message
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
