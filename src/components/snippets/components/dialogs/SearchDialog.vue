<template>
  <el-dialog
    custom-class="snippets-dialog"
    title="Search"
    v-model="isShowing"
    @open="onOpen"
    @close="onClose">

    <el-form :model="search">

      <!-- 'search by title' field -->
      <el-form-item label="">
        <el-input
          id="search-input"
          placeholder="Search by title"
          v-model="search.title"
          auto-complete="off">
        </el-input>
      </el-form-item>


      <!-- 'search by tags' field -->
      <el-form-item label="">
        <el-input
          id="search-input"
          placeholder="Search by tags (comma-separated)"
          v-model="search.tags"
          auto-complete="off">
        </el-input>
      </el-form-item>


      <!-- submit button -->
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          style="float: right;"
          @click.prevent="onSubmit">
          Submit
        </el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>


<script>
  import { mapGetters } from 'vuex';

  import searchHelper from '../../../snippets/helpers/snippetSearchHelper';

  export default {
    props: {
      /** Whether the dialog is currently showing */
      showing: {
        type: Boolean,
        required: true,
        default: false
      }
    },


    data() {
      return {
        /**
         * Current search data
         * (starts empty, but is populated by existing search data (if any) on open)
         */
        search: searchHelper.emptySearch()
      };
    },


    computed: {
      /**
       * Whether the dialog is currently showing
       */
      isShowing() {
        return this.showing;
      },

      ...mapGetters([
        'currentSearch'
      ])
    },


    methods: {
      /**
       * Sets focus to the title search input field.
       * Note that because Element's dialogs are not created immediately at runtime,
       * we are using a short timeout here to make sure the field has been created first.
       */
      forceFocusToInputField() {
        const el = document.querySelector('#search-input > input');
        if (el) {
          el.focus();
        } else {
          setTimeout(this.forceFocusToInputField, 2);
        }
      },

      /**
       * Handler for 'submit' event; emit event upwards with search data and close dialog.
       */
      onSubmit() {
        this.$emit('submitSearch', this.search);
        this.$emit('close');
      },

      /**
       * Callback for 'open' event; create new search data object and force focus to input field.
       */
      onOpen() {
        this.search = Object.assign({}, this.currentSearch);
        setTimeout(this.forceFocusToInputField, 2);
      },

      /**
       * Callback for 'close' event; clear the search data and emit event upwards.
       */
      onClose() {
        this.search = snippetSearchHelper.emptySearch();
        this.$emit('close');
      }
    }
  };
</script>
