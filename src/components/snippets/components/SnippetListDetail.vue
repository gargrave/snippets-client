<template>
  <el-card class="box-card" body-style="padding: 0;" :class="panelClass">

    <div class="snippet-card-header">
      <a
        :href="snippet.url"
        target="_blank"
        rel="noopener noreferrer">
        {{ snippet.title }}
      </a>
    </div><!-- /snippet-card-header -->


    <div class="text item snippet-card-body">
      <a
        :href="snippet.url"
        target="_blank"
        rel="noopener noreferrer">
        {{ snippet.url }}
      </a>
    </div><!-- /snippet-card-body -->


    <div class="snippet-card-footer snippet-controls">
      <!-- pin/unpin button -->
      <app-snippet-pin-button
        v-if="!hidePinButton"
        :snippet="snippet"
        @pinClicked="onPinClick">
      </app-snippet-pin-button>

      <!-- star/unstar button -->
      <app-snippet-star-button
        :snippet="snippet"
        @starClicked="onStarClick">
      </app-snippet-star-button>

      <!-- color picker dropdown menu -->
      <app-snippet-color-picker
        @colorSelected="onColorSelected">
      </app-snippet-color-picker>

      <!-- archive/unarchive button -->
      <app-snippet-archive-button
        :snippet="snippet"
        @archiveClicked="onArchiveClick">
      </app-snippet-archive-button>

      <!-- goto detail view button -->
      <span
        aria-hidden="true"
        class="fa fa-cog fa-pull-right pointer snippet-control"
        @click.prevent="onDetailClick">
      </span>
    </div><!-- /snippet-card-footer -->

  </el-card>
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
      // the Snippet being displayed on this panel
      snippet: {
        type: Object,
        required: true
      },
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },
      // whether we are viewing the archived list
      // we will show fewer options if this is the case
      hidePinButton: {
        type: Boolean,
        required: false,
        default: false
      }
    },


    computed: {
      /*
       * The class for the top-level BS panel component; will change
       * based on the Snippet's 'color' property.
       */
      panelClass() {
        return snippetStyles.snippetPanel(this.snippet);
      },
    },


    methods: {
      /**
       * Handler for changing a Snippet's 'pinned' state;
       * toggle the 'pinned' value and emit an event.
       */
      onPinClick() {
        if (!this.working) {
          this.$emit('quickUpdate', {
            id: this.snippet.id,
            pinned: !this.snippet.pinned
          });
        }
      },

      /**
       * Handler for changing a Snippet's 'starred' state;
       * toggle the 'starred' value and emit an event.
       */
      onStarClick() {
        if (!this.working) {
          this.$emit('quickUpdate', {
            id: this.snippet.id,
            starred: !this.snippet.starred
          });
        }
      },

      /**
       * Handler for changing a Snippet's color;
       * change the color value and emit an event.
       */
      onColorSelected(value) {
        if (!this.working) {
          this.$emit('quickUpdate', {
            id: this.snippet.id,
            color: value
          });
        }
      },

      /**
       * Handler for changing a Snippet's 'archived' state;
       * toggle the 'archived' value and emit an event.
       */
      onArchiveClick() {
        if (!this.working) {
          this.$emit('quickUpdate', {
            id: this.snippet.id,
            archived: !this.snippet.archived
          });
        }
      },

      /**
       * Handler for clicking on the 'go to detail' button;
       * routes the view to the selected Snippet's 'detail' page
       */
      onDetailClick() {
        if (!this.working) {
          this.$router.push(`${localUrls.snippetsList}/${this.snippet.id}`);
        }
      }
    }
  };
</script>
