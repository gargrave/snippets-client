<template>
  <div :class="panelClass">

    <div class="panel-heading">
      <h3 class="panel-title">{{ snippet.title }}</h3>
    </div><!-- /panel-heading -->


    <div class="panel-body">
      {{ snippet.url }}
    </div><!-- /panel-body -->


    <div class="panel-footer snippet-controls">
      <!-- star/unstar button -->
      <span
        :class="starButtonClass"
        aria-hidden="true"
        @click="onStarClick">
      </span>

      <!-- pin/unpin button -->
      <app-snippet-pin-button
        :snippet="snippet"
      ></app-snippet-pin-button>

      <!-- archive/unarchive button -->
      <app-snippet-archive-button
        :snippet="snippet"
      ></app-snippet-archive-button>
    </div><!-- /panel-footer -->

  </div><!-- /panel -->
</template>


<script>
  import snippetStyles from '../helpers/snippetStyles';
  import SnippetPinButton from '../components/SnippetPinButton.vue';
  import SnippetArchiveButton from '../components/SnippetArchiveButton.vue';

  export default {
    components: {
      appSnippetPinButton: SnippetPinButton,
      appSnippetArchiveButton: SnippetArchiveButton
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
      }
    }
  };
</script>


<style>
</style>
