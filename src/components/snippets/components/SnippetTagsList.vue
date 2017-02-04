<template>
  <div
    class="tag-list"
    v-if="snippet.tags.length">

    <el-tag
      type="gray"
      v-for="tag in snippet.tags">
      {{ tag._tag.title }}
    </el-tag>

  </div>
</template>


<script>
  export default {
    props: {
      snippet: {
        type: Object,
        required: true
      }
    }
  };
</script>


<style scoped>
  .el-tag {
    color: #222;
    background-color: rgba(245, 245, 245, .5);
    border: 1px solid rgba(80, 80, 80, .5);
    margin-right: 2px;
  }

  .tag-list {
    margin-top: 6px;
  }
</style>
