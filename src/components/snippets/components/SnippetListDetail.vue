<template>
  <div :class="panelClass">

    <div class="panel-heading">
      <h3 class="panel-title">{{ snippet.title }}</h3>
    </div><!-- /panel-heading -->


    <div class="panel-body">
      {{ snippet.url }}
    </div><!-- /panel-body -->


    <div class="panel-footer snippet-controls">
      <!-- pin/unpin button -->
      <app-snippet-pin-button
        :snippet="snippet"
        @pinClicked="onPinClick"
      ></app-snippet-pin-button>

      <!-- star/unstar button -->
      <app-snippet-star-button
        :snippet="snippet"
        @starClicked="onStarClick"
      ></app-snippet-star-button>

      <!-- color picker dropdown menu -->
      <app-snippet-color-picker
        @colorSelected="onColorSelected"
      ></app-snippet-color-picker>

      <!-- archive/unarchive button -->
      <app-snippet-archive-button
        :snippet="snippet"
        @archiveClicked="onArchiveClick"
      ></app-snippet-archive-button>

      <!-- goto detail view button -->
      <span
        aria-hidden="true"
        class="fa fa-cog fa-pull-right pointer snippet-control"
        @click.prevent="onDetailClick">
      </span>
    </div><!-- /panel-footer -->

  </div><!-- /panel -->
</template>


<script>
  import {localUrls} from '../../../appData/urls';
  import snippetStyles from '../helpers/snippetStyles';
  import SnippetArchiveButton from '../components/panel-controls/SnippetArchiveButton.vue';
  import SnippetColorPicker from '../components/panel-controls/SnippetColorPicker.vue';
  import SnippetPinButton from '../components/panel-controls/SnippetPinButton.vue';
  import SnippetStarButton from '../components/panel-controls/SnippetStarButton.vue';

  export default {
    components: {
      appSnippetPinButton: SnippetPinButton,
      appSnippetColorPicker: SnippetColorPicker,
      appSnippetStarButton: SnippetStarButton,
      appSnippetArchiveButton: SnippetArchiveButton,
    },


    props: {
      snippet: {
        type: Object,
        required: true
      }
    },


    computed: {
      panelClass() {
        return snippetStyles.snippetPanel(this.snippet);
      },

      starButtonClass() {
        return snippetStyles.snippetStarButton(this.snippet);
      }
    },


    methods: {
      // TODO: make sure we are not currently working before running any of these
      /**
       * Handler for changing a Snippet's 'pinned' state;
       * toggle the 'pinned' value and emit an event.
       */
      onPinClick() {
        this.$emit('quickUpdate', {
          id: this.snippet.id,
          pinned: !this.snippet.pinned
        });
      },

      /**
       * Handler for changing a Snippet's 'starred' state;
       * toggle the 'starred' value and emit an event.
       */
      onStarClick() {
        this.$emit('quickUpdate', {
          id: this.snippet.id,
          starred: !this.snippet.starred
        });
      },

      /**
       * Handler for changing a Snippet's color;
       * change the color value and emit an event.
       */
      onColorSelected(value) {
        this.$emit('quickUpdate', {
          id: this.snippet.id,
          color: value
        });
      },

      /**
       * Handler for changing a Snippet's 'archived' state;
       * toggle the 'archived' value and emit an event.
       */
      onArchiveClick() {
        this.$emit('quickUpdate', {
          id: this.snippet.id,
          archived: !this.snippet.archived
        });
      },

      onDetailClick() {
        this.$router.push(`${localUrls.snippetsList}/${this.snippet.id}`);
      }
    }
  };
</script>


<style>
</style>
