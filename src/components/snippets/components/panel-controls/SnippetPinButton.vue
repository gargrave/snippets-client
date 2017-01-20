<template>
  <span
    type="button"
    aria-hidden="true"
    :class="pinButtonClass"
    @click="onClick">
  </span>
</template>


<script>
  import snippetStyles from '../../helpers/snippetStyles';

  export default {
    props: {
      // the Snippet tied to this button
      // needed so the current 'pinned' state can be determined
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
