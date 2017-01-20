<template>
  <span
    type="button"
    aria-hidden="true"
    :class="starButtonClass"
    @click="onClick">
  </span>
</template>


<script>
  import snippetStyles from '../../helpers/snippetStyles';

  export default {
    props: {
      // the Snippet tied to this button
      // needed so the current 'starred' state can be determined
      snippet: {
        type: Object,
        required: true
      }
    },


    computed: {
      starButtonClass() {
        return snippetStyles.snippetStarButton(this.snippet);
      }
    },


    methods: {
      onClick() {
        this.$emit('starClicked');
      }
    }
  };
</script>
