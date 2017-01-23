<template>
  <el-dialog
    custom-class="search-dialog"
    title="Search"
    v-model="isShowing"
    @open="onOpen"
    @close="onClose">

    <el-form :model="search">
      <el-form-item label="">
        <el-input
          id="search-input"
          placeholder="Search"
          v-model="search.text"
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
        search: {
          text: ''
        }
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
        this.$emit('submitSearch', this.search.text);
        this.$emit('close');
      },

      onOpen() {
        this.search.text = this.currentSearch;
        setTimeout(this.forceFocusToInputField, 2);
      },

      onClose() {
        this.search.text = '';
        this.$emit('close');
      }
    }
  };
</script>
