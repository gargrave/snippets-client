<template>
  <span
    type="button"
    aria-hidden="true"
    class="fa fa-trash pointer snippet-control"
    @click="onClick">
  </span>
</template>


<script>
  export default {
    methods: {
      onClick() {
        this.$emit('clicked');
      }
    }
  };
</script>
