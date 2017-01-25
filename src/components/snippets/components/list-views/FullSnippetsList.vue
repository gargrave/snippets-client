<template>
  <section>

    <!-- pinned Snippets list -->
    <div v-if="pinnedSnippets.length">
      <app-snippet-list-detail
        v-for="snippet in pinnedSnippets"
        :hidePinButton="false"
        :snippet="snippet"
        :working="working"
        @quickUpdate="onQuickUpdate"
        @deleteSnippet="onDeleteSnippet">
      </app-snippet-list-detail>
      <hr class="snippets-hr" v-if="unpinnedSnippets.length">
    </div><!-- /pinned Snippets list -->

    <!-- unpinned Snippets list -->
    <div v-if="unpinnedSnippets.length">
      <app-snippet-list-detail
        v-for="snippet in unpinnedSnippets"
        :hidePinButton="false"
        :snippet="snippet"
        :working="working"
        @quickUpdate="onQuickUpdate"
        @deleteSnippet="onDeleteSnippet">
      </app-snippet-list-detail>
    </div><!-- /unpinned Snippets list -->

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

      // the full list of Snippets
      snippets: {
        type: Array,
        required: true
      },
    },


    computed: {
      /** Returns a list of Snippets with 'pinned' status of true. */
      pinnedSnippets() {
        return this.snippets.filter(s => s.pinned === true);
      },

      /** Returns a list of Snippets with 'pinned' status of false. */
      unpinnedSnippets() {
        return this.snippets.filter(s => s.pinned === false);
      }
    },


    methods: {
      // simply re-emit the event for the parent to handle
      onQuickUpdate(data, event) {
        this.$emit('quickUpdate', data);
      },

      // simply re-emit the event for the parent to handle
      onDeleteSnippet(snippetId, event) {
        this.$emit('deleteSnippet', snippetId);
      }
    }
  };
</script>
