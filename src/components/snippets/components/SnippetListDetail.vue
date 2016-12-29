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
      ></app-snippet-pin-button>

      <!-- star/unstar button -->
      <span
        aria-hidden="true"
        :class="starButtonClass"
        @click="onStarClick">
      </span>

      <!-- color picker dropdown menu -->
      <app-snippet-color-picker
        @colorSelected="onColorSelected"
      >
      </app-snippet-color-picker>

      <!-- archive/unarchive button -->
      <app-snippet-archive-button
        :snippet="snippet"
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
  import SnippetArchiveButton from '../components/SnippetArchiveButton.vue';
  import SnippetPinButton from '../components/SnippetPinButton.vue';
  import SnippetColorPicker from '../components/SnippetColorPicker.vue';

  export default {
    components: {
      appSnippetPinButton: SnippetPinButton,
      appSnippetArchiveButton: SnippetArchiveButton,
      appSnippetColorPicker: SnippetColorPicker,
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
      onStarClick() {
        console.log('onStarClick');
      },

      onColorSelected(value, event) {
        this.$emit('quickUpdate', {
          id: this.snippet.id,
          color: value
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
