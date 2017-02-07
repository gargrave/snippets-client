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

  import snippetSearchHelper from '../../../snippets/helpers/snippetSearchHelper';

  export default {
    props: {
      showing: {
        type: Boolean,
        required: true,
        default: false
      }
    },


    data() {
      return {
        search: snippetSearchHelper.emptySearch()
      };
    },


    computed: {
      isShowing() {
        return this.showing;
      },

      ...mapGetters([
        'currentSearch'
      ])
    },


    methods: {
      forceFocusToInputField() {
        const el = document.querySelector('#search-input > input');
        if (el) {
          el.focus();
        } else {
          setTimeout(this.forceFocusToInputField, 2);
        }
      },

      onSubmit() {
        this.$emit('submitSearch', this.search);
        this.$emit('close');
      },

      onOpen() {
        this.search = Object.assign({}, this.currentSearch);
        setTimeout(this.forceFocusToInputField, 2);
      },

      onClose() {
        this.search = snippetSearchHelper.emptySearch();
        this.$emit('close');
      }
    }
  };
</script>
