<template>
  <section>

    <app-snippet-list-detail
      v-for="snippet in snippets"
      :hidePinButton="true"
      :snippet="snippet"
      :working="working"
      @quickUpdate="onQuickUpdate"
      @deleteSnippet="onDeleteSnippet"
      @tagButtonClicked="onTagButtonClicked">
    </app-snippet-list-detail>

  </section>
</template>


<script>
  import SnippetListDetail from '../SnippetListDetail.vue';

  export default {
    components: {
      appSnippetListDetail: SnippetListDetail
    },


    props: {
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },

      // the filtered list of Snippets
      snippets: {
        type: Array,
        required: true
      },
    },


    methods: {
      // simply re-emit the event for the parent to handle
      onQuickUpdate(data, event) {
        this.$emit('quickUpdate', data);
      },

      // simply re-emit the event for the parent to handle
      onDeleteSnippet(snippet, event) {
        this.$emit('deleteSnippet', snippet);
      },

      // simply re-emit the event for the parent to handle
      onTagButtonClicked(snippet, event) {
        this.$emit('onTagButtonClicked', snippet);
      }
    }
  };
</script>
