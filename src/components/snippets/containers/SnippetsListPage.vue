<template>
  <div>

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

  export default {
    data() {
      return {
        // whether any operations are currently running
        working: false
      };
    },


    computed: {
      ...mapGetters([
        'authToken',
        'snippets'
      ])
    },


    methods: {
      ...mapActions([
        'fetchSnippets'
      ])
    },


    created() {
      if (this.authToken) {
        this.working = true;
        this.fetchSnippets(this.authToken)
          .then((res) => {
            this.working = false;
          }, (err) => {
            // TODO: show error message
            this.working = false;
          });
      } else {
        // TODO: use URL constants
        this.$router.push('/account/login')
      }
    }
  };
</script>


<style>
</style>
