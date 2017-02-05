<template>
  <el-dialog
    custom-class="snippets-dialog tags-dialog"
    title="Update Tags"
    v-model="isShowing"
    @open="onOpen"
    @close="onClose">

    <!-- new tag entry form -->
    <app-tag-form
      :working="working"
      :showing="showing"
      @submitted="onFormSubmitted">
    </app-tag-form>

    <div
      class="el-checkbox-wrapper tag-checkbox-wrapper"
      v-for="tag in tags">
      <el-checkbox
        v-model="tagStates[tag.id]"
        @change="onTagSelected(tag)">
        {{ tag.title }}
      </el-checkbox>
    </div>

    <br>

  </el-dialog>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import TagForm from '../forms/TagForm';

  export default {
    components: {
      appTagForm: TagForm
    },


    props: {
      // the currently-selected Snippet
      snippet: {
        type: Object,
        required: true
      },

      // whether the dialog is currently showing
      showing: {
        type: Boolean,
        required: true,
        default: false
      }
    },


    data() {
      return {
        working: false,

        // a collection of Boolean values for the state of each Tag
        // (i.e. does this Snippet currently have this Tag?)
        // these are used for the v-model state of each checkbox
        tagStates: {}
      };
    },


    computed: {
      // a simple wrapper for 'showing' state
      // this is used to prevent Vue errors about 'mutating props directly'
      isShowing() {
        return this.showing;
      },

      ...mapGetters([
        'tags',
        'tagsAjaxPending'
      ])
    },


    methods: {
      updateTagStates() {
        // make a list of IDs for the Tags currently tied to this Snippet
        const currentTags = [];
        this.snippet.tags.forEach((tagOnSnippet) => {
          currentTags.push(tagOnSnippet._tag.id);
        });

        // set a flag for each of these Tags, so the associated checkboxes will be pre-checked
        this.tagStates = {};
        this.tags.forEach((tagInStore) => {
          this.tagStates[tagInStore.id] = currentTags.includes(tagInStore.id);
        });
      },

      /** Callback for 'open' event; update the selected Tags for the current Snippet */
      onOpen() {
        this.updateTagStates();
      },

      /** Callback for 'close' event; simply emit upwards */
      onClose() {
        this.$emit('close');
      },

      onTagSelected(clickedTag, event) {
        const existingTag = this.snippet.tags.find((tag) => {
          return tag._tag.id === clickedTag.id;
        });

        // build the appropriate request payload for using an existing Tag
        const payload = {
          snippetId: this.snippet.id,
          tagId: clickedTag.id
        };

        if (!this.tagsAjaxPending) {
          // if the selected Tag is not on this Snippet yet, add it!
          if (!existingTag) {
            this.addTagToSnippet(payload)
              .then((res) => {
                this.updateTagStates();
              }, (err) => {
              });
          } else {
            // if the tag is already on this Snippet, remove it!
            this.removeTagFromSnippet(payload)
              .then((res) => {
                this.updateTagStates();
              }, (err) => {
              });
          }
        }
      },

      onFormSubmitted(value) {
        const tagTitle = value;
        // check the store for an existing Tag with this title
        // if we find one, simply add that Tag to this Snippet;
        // if not, we will create a new Tag
        const existingTag = this.tags.find((t) => {
          return t.title === tagTitle;
        });

        // build the request payload based on whether we found an existing tag
        const payload = existingTag ? {
          snippetId: this.snippet.id,
          tagId: existingTag.id,
        } : {
          snippetId: this.snippet.id,
          tagTitle
        };

        // now submit the request
        this.working = true;
        this.addTagToSnippet(payload)
          .then((res) => {
            this.updateTagStates();
            this.working = false;
          }, (err) => {
            this.working = false;
          });
      },

      ...mapActions([
        'addTagToSnippet',
        'removeTagFromSnippet'
      ])
    }
  };
</script>


<style>
  .el-dialog.tags-dialog {
    /* add restraints to dialog size, as lots of tags will mean a very long list */
    max-height: 70%;
    max-width: 350px;
    overflow: scroll;
  }

  .tag-checkbox-wrapper label span {
    /* make the checkboxes a bit larger and spread them a bit, for easier user on mobile */
    font-size: 1.1em;
    line-height: 1.9em;
  }
</style>
