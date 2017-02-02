<template>
  <el-dialog
    custom-class="snippets-dialog"
    title="Update Tags"
    v-model="isShowing"
    @open="onOpen"
    @close="onClose">

    <div
      class="el-checkbox-wrapper"
      v-for="tag in tags">
      <el-checkbox
        v-model="tagStates[tag.title]"
        @change="onTagSelected(tag)">
        {{ tag.title }}
      </el-checkbox>
    </div>

    <br>

  </el-dialog>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
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
        const currentTagTitles = [];
        this.snippet.tags.forEach((tag) => {
          currentTagTitles.push(tag._tag);
        });

        this.tagStates = {};
        this.tags.forEach((tag) => {
          this.tagStates[tag.title] = currentTagTitles.includes(tag.title);
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
          return tag._tag == clickedTag.title;
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

      ...mapActions([
        'addTagToSnippet',
        'removeTagFromSnippet',
      ])
    }
  };
</script>
