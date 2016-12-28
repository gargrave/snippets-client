<template>
  <span
    type="button"
    aria-hidden="true"
    :class="archiveButtonClass"
    @click="onClick"
  >
  </span>
</template>


<script>
  import snippetStyles from '../helpers/snippetStyles';

  export default {
    props: {
      snippet: {
        type: Object,
        required: true
      }
    },


    computed: {
      archiveButtonClass() {
        return snippetStyles.snippetArchiveButton(this.snippet);
      }
    },


    methods: {
      onClick() {
        console.log('SnippetArchiveButton.onClick()');
      }
    }
  };
</script>


<style>
</style>
