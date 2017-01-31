<template>
  <div
    class="tag-list"
    v-if="snippet.tags.length">

    <el-tag
      type="gray"
      v-for="tag in snippet.tags"
      :closable="true"
      @close="onClose(tag.id)">
      {{ tag._tag }}
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
    },


    methods: {
      onClose(tagId) {
        console.log('remove tag #' + tagId);
      }
    }
  };
</script>


<style scoped>
  .el-tag {
    border: 1px solid #888;
    color: #333;
    margin-right: 2px;
  }

  .tag-list {
    margin-top: 6px;
  }
</style>
