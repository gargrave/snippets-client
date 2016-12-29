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
  import snippetStyles from '../../helpers/snippetStyles';

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
        this.$emit('archiveClicked');
      }
    }
  };
</script>


<style>
</style>
