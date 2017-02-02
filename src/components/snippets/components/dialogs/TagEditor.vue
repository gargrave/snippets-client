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
        @change="onTagSelected(tag.title)">
        {{ tag.title }}
      </el-checkbox>
    </div>

  </el-dialog>
</template>


<script>
  import { mapGetters } from 'vuex';

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
        'tags'
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

      onSubmit() {
        this.$emit('close');
      },

      onOpen() {
        const currentTagTitles = [];
        this.snippet.tags.forEach((tag) => {
          currentTagTitles.push(tag._tag);
        });

        this.tagStates = {};
        this.tags.forEach((tag) => {
          this.tagStates[tag.title] = currentTagTitles.includes(tag.title);
        });
        // setTimeout(this.forceFocusToInputField, 2);
      },

      onClose() {
        this.$emit('close');
      },

      onTagSelected(tagTitle) {
        console.log('onTagSelected: ' + tagTitle);
      }
    }
  };
</script>
