<template>
  <el-form ref="form" :model="sort">

    <!-- 'sortBy' select -->
    <el-form-item label="Sort By">
      <el-select
        v-model="sort.sortBy"
        placeholder="Select"
        @change="onUpdated">

        <el-option
          v-for="item in sortOptions"
          :label="item.label"
          :value="item.value">
        </el-option>

      </el-select>
    </el-form-item><!-- /'sortBy' select -->

    <!-- 'sort in asc order' switch -->
    <el-form-item label="Ascending">
      <el-switch
        off-text=""
        on-text=""
        v-model="sort.sortAsc"
        @change="onUpdated">
      </el-switch>
    </el-form-item><!-- 'sort in asc order' switch -->


    <el-form-item>
      <!-- cancel button -->
      <el-button
        type="default"
        style="float: right;"
        @click="onCancel">
        Close
      </el-button>
    </el-form-item>

  </el-form>
</template>


<script>
  import { SORT, SORT_LABELS } from '../../../../utils/snippets-sorter';

  export default {
    props: {
      // current sorting data
      currentSort: {
        type: Object,
        required: true
      }
    },


    data() {
      return {
        /**
         * The local/working copy of sort options.
         * This is what will be used to update the store when a value is selected.
         */
        sort: {
          sortBy: this.currentSort.sortBy,
          sortAsc: this.currentSort.sortAsc
        }
      };
    },


    computed: {
      /** Sorting options to populate the select element */
      sortOptions() {
        return [{
            value: SORT.TITLE,
            label: SORT_LABELS.TITLE
          }, {
            value: SORT.URL,
            label: SORT_LABELS.URL
          }, {
            value: SORT.COLOR,
            label: SORT_LABELS.COLOR
          }, {
            value: SORT.CREATED,
            label: SORT_LABELS.CREATED
          }, {
            value: SORT.MODIFIED,
            label: SORT_LABELS.MODIFIED
          }
        ];
      }
    },


    methods: {
      /**
       * Callback for 'close' button;
       * Simply emit an event upwards.
       */
      onCancel() {
        this.$emit('cancelled');
      },

      /**
       * Callback for when a sorting param is selected;
       * Emit an event with the new sorting values.
       */
      onUpdated() {
        this.$emit('sortSelected', this.sort);
      }
    }
  };
</script>
