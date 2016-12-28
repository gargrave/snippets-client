<template>
  <div :class="panelClass" @click="onClick">
    <div class="panel-body">
      <h4 class="text-muted">Add a Snippet...</h4>
    </div>
  </div>
</template>


<script>
  import {localUrls} from '../../../appData/urls';

  export default {
    data() {
      return {
        panelClass: 'panel panel-default snippet-panel new-snippet-link-panel snippet-color-white'
      }
    },


    methods: {
      onClick() {
        this.$router.push(localUrls.snippetCreate);
      }
    }
  };
</script>


<style>
</style>
