<template>
  <div class="snippet-card-wrapper" @click="onClick">
    <el-card class="new-snippet-link-card" :body-style="bodyStyle">
      <div class="text item">
        <h4>Add a Snippet...</h4>
      </div>
    </el-card>
  </div>
</template>


<script>
  import { localUrls } from '../../../app-data/urls';

  export default {
    data() {
      return {
        bodyStyle: 'padding: 4px 12px;'
      };
    },


    methods: {
      onClick() {
        this.$router.push(localUrls.snippetCreate);
      }
    }
  };
</script>
