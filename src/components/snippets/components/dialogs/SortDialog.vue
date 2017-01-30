<template>
  <el-dialog
    custom-class="snippets-dialog"
    title="Sort"
    v-model="isShowing"
    @close="onClose">

    <!-- snippet form -->
    <app-sort-form
      :currentSort="currentSort"
      @sortSelected="onSortSelected"
      @cancelled="onClose">
    </app-sort-form>

  </el-dialog>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { DEFAULT_SORT, SORT } from '../../../../utils/snippets-sorter';
  import SortForm from '../forms/SortForm';

  export default {
    components: {
      appSortForm: SortForm
    },


    props: {
      showing: {
        type: Boolean,
        required: true,
        default: false
      }
    },


    computed: {
      isShowing() {
        return this.showing;
      },

      /**
       * The sort params currently in use (i.e. what is in the store)
       * Note that the child form has its own "working" set of sort params.
       */
      currentSort() {
        return {
          sortBy: this.sortBy,
          sortAsc: this.sortAsc
        };
      },

      ...mapGetters([
        'sortBy',
        'sortAsc',
      ])
    },


    methods: {
      /**
       * Callback for closing the dialog;
       * simply emit an event upwards.
       */
      onClose() {
        this.$emit('close');
      },

      /**
       * Callback for when a sorting option has changed;
       * call the action on the store.
       */
      onSortSelected(value, event) {
        const sort = {
          sortBy: value.sortBy || DEFAULT_SORT,
          sortAsc: value.sortAsc
        };
        this.setSort(sort);
      },

      ...mapActions([
        'setSort'
      ])
    }
  };
</script>
