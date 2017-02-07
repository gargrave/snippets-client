<template>
  <el-card
    class="box-card alert-card snippet-card search-results"
    v-if="hasCurrentSearch">

    <div slot="header" class="search-results-header clearfix">
      <span class="search-results-title">{{ resultString }}</span>
      <el-button
        style="float: right;"
        size="small"
        type="primary"
        @click="onResetClick">
        Clear
      </el-button>
    </div>

    <div
      class="text item"
      v-if="currentSearch.title">
      Title includes: <strong><em>{{ currentSearch.title }}</em></strong>
    </div>

    <div
      class="text item"
      v-if="currentSearch.tags">
      Tags include:
      <span
        class="el-tag-wrapper"
        v-for="tag in searchTags">
        <el-tag
          class="snippets-tag"
          type="gray">
          {{ tag }}
        </el-tag>
      </span>
    </div>
  </el-card>
</template>


<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      resultString() {
        const len = this.snippets.length;
        const resultsWord = len === 1 ? 'Match' : 'Matches';
        return `Showing ${len} ${resultsWord}`;
      },

      hasCurrentSearch() {
        return !!this.currentSearch.title || !!this.currentSearch.tags;
      },

      searchTags() {
        const tags = this.currentSearch.tags.split(',');
        tags.forEach((t) => {
          return t.trim();
        });
        return tags;
      },

      ...mapGetters([
        'snippets',
        'currentSearch'
      ])
    },


    methods: {
      onResetClick() {
        this.$emit('clearSearch');
      }
    }
  };
</script>


<style>
  .el-card.search-results > div {
    padding: 12px 20px 8px 20px;
    border: 0;
  }

  .el-card.search-results > div.search-results-header {
    padding: 0;
  }

  .el-card.search-results > div.el-card__body {
    padding: 0 20px 4px 20px;
    line-height: .5em;
  }

  .search-results-title {
    font-size: 1.1em;
    line-height: 2em;
    font-weight: bold;
  }
</style>
