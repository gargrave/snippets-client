<template>
  <el-card class="box-card" body-style="padding: 0;" :class="cardClass">

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

      <app-snippet-tags-list
        :snippet="snippet"
        @tagClicked="onTagClicked">
      </app-snippet-tags-list>
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

      <!-- tags dialog launcher -->
      <app-snippet-tags-button
        @clicked="$emit('tagButtonClicked', snippet)">
      </app-snippet-tags-button>

      <!-- archive/unarchive button -->
      <app-snippet-archive-button
        :snippet="snippet"
        @archiveClicked="onArchiveClick">
      </app-snippet-archive-button>

      <!-- archive/unarchive button -->
      <app-snippet-delete-button
        @clicked="onDeleteClick">
      </app-snippet-delete-button>

      <!-- goto detail view button -->
      <span
        aria-hidden="true"
        class="fa fa-pencil fa-pull-right pointer snippet-control"
        @click.prevent="onDetailClick">
      </span>
    </div><!-- /snippet-card-footer -->

  </el-card>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import searchHelper from '../helpers/snippetSearchHelper';
  import snippetStyles from '../helpers/snippetStyles';
  import SnippetArchiveButton from '../components/panel-controls/SnippetArchiveButton.vue';
  import SnippetColorPicker from '../components/panel-controls/SnippetColorPicker.vue';
  import SnippetDeleteButton from '../components/panel-controls/SnippetDeleteButton.vue';
  import SnippetPinButton from '../components/panel-controls/SnippetPinButton.vue';
  import SnippetStarButton from '../components/panel-controls/SnippetStarButton.vue';
  import SnippetTagsButton from '../components/panel-controls/SnippetTagsButton.vue';
  import SnippetTagsList from './SnippetTagsList';

  export default {
    components: {
      appSnippetPinButton: SnippetPinButton,
      appSnippetColorPicker: SnippetColorPicker,
      appSnippetDeleteButton: SnippetDeleteButton,
      appSnippetStarButton: SnippetStarButton,
      appSnippetTagsButton: SnippetTagsButton,
      appSnippetArchiveButton: SnippetArchiveButton,
      appSnippetTagsList: SnippetTagsList
    },


    props: {
      // the Snippet being displayed on this card
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
       * The class for the top-level BS card component; will change
       * based on the Snippet's 'color' property.
       */
      cardClass() {
        return snippetStyles.snippetCard(this.snippet);
      },

      ...mapGetters([
        'currentSearch'
      ])
    },


    methods: {
      /**
       * Callback for 'tag clicked' event.
       * When a user clicks on a Tag, do a search by that Tag
       */
      onTagClicked(tag) {
        const payload = searchHelper.buildRequestPayload({ tags: tag.title });
        if (!searchHelper.isIdentical(payload, this.currentSearch)) {
          this.fetchSnippetsBySearch(payload)
            .then((res) => {
              // succesful search; no action needed
            }, (err) => {
              // TODO handle errors
            });
        }
      },

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
       * Triggers the event to delete this Snippet.
       */
      onDeleteClick() {
        if (!this.working) {
          this.$emit('deleteSnippet', this.snippet.id);
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
      },

      ...mapActions([
        'fetchSnippetsBySearch'
      ])
    }
  };
</script>
