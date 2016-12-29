<template>
  <span
    type="button"
    aria-hidden="true"
    :class="pinButtonClass"
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
      pinButtonClass() {
        return snippetStyles.snippetPinButton(this.snippet);
      }
    },


    methods: {
      onClick() {
        this.$emit('pinClicked');
      }
    }
  };
</script>


<style>
</style>
