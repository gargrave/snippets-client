<template>
  <el-dialog
    custom-class="snippets-dialog"
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
      class="el-checkbox-wrapper"
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
      snippet: {
        type: Object,
        required: true
      },

      showing: {
        type: Boolean,
        required: true,
        default: false
      }
    },


    data() {
      return {
        working: false,
        tagStates: {}
      };
    },


    computed: {
      isShowing() {
        return this.showing;
      },

      ...mapGetters([
        'tags',
        'tagsAjaxPending'
      ])
    },


    methods: {
      forceFocusToInputField() {
        // const el = document.querySelector('#search-input > input');
        // if (el) {
        //   el.focus();
        // } else {
        //   setTimeout(this.forceFocusToInputField, 2);
        // }
      },

      updateTagStates() {
        const currentTags = [];
        // TODO: this can probably be cleaned up (i.e. only stored active ids, not all)
        this.snippet.tags.forEach((tagOnSnippet) => {
          currentTags.push(tagOnSnippet._tag.id);
        });

        this.tagStates = {};
        this.tags.forEach((tagInStore) => {
          this.tagStates[tagInStore.id] = currentTags.includes(tagInStore.id);
        });
      },

      onSubmit() {
        this.$emit('close');
      },

      onOpen() {
        this.updateTagStates();
        // setTimeout(this.forceFocusToInputField, 2);
      },

      onClose() {
        this.$emit('close');
      },

      onTagSelected(clickedTag, event) {
        const existingTag = this.snippet.tags.find((tag) => {
          return tag._tag.id === clickedTag.id;
        });

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
                // TODO: determine how to handle errors
              });
          } else {
            // if the tag is already on this Snippet, remove it!
            this.removeTagFromSnippet(payload)
              .then((res) => {
                this.updateTagStates();
              }, (err) => {
                // TODO: determine how to handle errors
              });
          }
        }
      },

      onFormSubmitted(value) {
        const payload = {
          snippetId: this.snippet.id,
          tagTitle: value
        };

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
