<template>
  <el-card
    class="box-card alert-card snippet-card search-results"
    v-if="hasCurrentSearch">


    <!-- search card header -->
    <div slot="header" class="search-results-header clearfix">
      <!-- search header display; (e.g. "Showing 5 Matches)") -->
      <span class="search-results-title">{{ resultString }}</span>
      <!-- clear/reset search button -->
      <el-button
        class="reset-search-button"
        style="float: right;"
        size="small"
        type="primary"
        @click="onResetClick">
        Clear
      </el-button>
    </div>


    <!-- display current 'search by title' (if any) -->
    <div
      id="current-search-title"
      class="text item"
      v-if="currentSearch.title">
      Title includes: <strong><em>{{ currentSearch.title }}</em></strong>
    </div>


    <!-- display current 'search by tags' (if any) -->
    <div
      id="current-search-tags"
      class="text item"
      v-if="currentSearch.tags">
      Tags include:
      <span
        class="el-tag-wrapper"
        v-for="tag in currentSearchTags">
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
      /**
       * String to display in card header (e.g. "Showing 5 Matches")
       */
      resultString() {
        const len = this.snippets.length;
        const resultsWord = len === 1 ? 'Match' : 'Matches';
        return `Showing ${len} ${resultsWord}`;
      },

      /* *
       * Whether any search data is currently active
       */
      hasCurrentSearch() {
        return !!this.currentSearch.title || !!this.currentSearch.tags;
      },

      /**
       * List of Tags in use (if any) in the current search
       */
      currentSearchTags() {
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
      /**
       * Handler for clicking on clear/reset search button; simply emit event upwards.
       */
      onResetClick() {
        this.$emit('clearSearch');
      }
    }
  };
</script>


<style>
  .el-card.search-results > div {
    /* reduce excessive space inside search results card */
    padding: 12px 20px 8px 20px;
    border: 0;
  }

  .el-card.search-results > div.search-results-header {
    /* reduce excessive space inside search results card header */
    padding: 0;
  }

  .el-card.search-results > div.el-card__body {
    /* reduce excessive space inside search results card body */
    padding: 0 20px 4px 20px;
    line-height: .5em;
  }

  .search-results-title {
    /* make search card header text more prominent */
    font-size: 1.1em;
    line-height: 2em;
    font-weight: bold;
  }
</style>
