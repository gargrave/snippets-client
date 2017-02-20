<template>
  <el-card class="box-card taglist-tag">

    <div class="text item">
      <!-- tag title display -->
      <span class="taglist-tag-title">{{ tag.title }}</span>
      <!-- 'delete tag' button -->
      <i
        class="taglist-tag-icon taglist-tag-icon-delete el-icon-delete2"
        :class="{ 'taglist-tag-icon-disabled': working }"
        @click="onDeleteClick(tag)">
      </i>
    </div>

  </el-card>
</template>


<script>
  export default {
    props: {
      working: {
        type: Boolean,
        required: true,
      },

      tag: {
        type: Object,
        required: true
      },

      onDeleteClick: {
        type: Function,
        required: true
      }
    }
  };
</script>


<style scoped>
  .taglist-tag {
    max-width: 400px;
  }

  .taglist-tag * {
    line-height: 23px;
    font-size: 1.2em;
  }

  .taglist-tag-icon {
    float: right;
    cursor: pointer;
    color: #2c3e50;
  }

  .taglist-tag-icon-disabled {
    cursor: auto;
    color: #abb3b9;
  }

  .taglist-tag-title {
    font-weight: 500;
  }
</style>
