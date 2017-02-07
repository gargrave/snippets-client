<template>
  <div
    class="tag-list"
    v-if="snippet.tags.length">

    <span
      class="el-tag-wrapper"
      v-for="tag in snippet.tags"
      @click="onTagClicked(tag)">
      <el-tag
        class="snippets-tag"
        type="gray">
        {{ tag._tag.title }}
      </el-tag>
    </span>

  </div>
</template>


<script>
  export default {
    props: {
      snippet: {
        type: Object,
        required: true
      }
    },


    methods: {
      onTagClicked(tag) {
        this.$emit('tagClicked', tag._tag);
      }
    }
  };
</script>


<style scoped>
  .tag-list {
    margin-top: 6px;
  }
</style>
