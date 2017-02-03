<template>
  <el-form
    ref="form"
    :model="tag">

    <el-form-item label="">
      <el-input
        v-model="tag.title"
        placeholder="Enter Tag"
        @change="onTextChange">
      </el-input>
    </el-form-item>

  </el-form>
</template>


<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        tag: {
          title: '',
        }
      };
    },


    props: {
      working: {
        type: Boolean,
        required: true
      }
    },


    computed: {
      isWorking() {
        return this.working || this.tagsAjaxPending;
      },

      ...mapGetters([
        'tagsAjaxPending'
      ])
    },


    methods: {
      onTextChange() {
        console.log('onTextChange');
      },

      onSubmit(event) {
        event.preventDefault();
        // TODO add validation before submitting
        if (this.tag.title && !this.isWorking) {
          this.$emit('submitted', this.tag.title);
        }
      }
    },


    created() {
      let initStyles = () => {
        /*
        Dynamically bind the submit event to the form once it has been created;
        Element UI does not create the actual <form> element until runtime, so it may
        not be available immediately.
        */
        let formEle = document.querySelector('form.el-form');
        if (formEle) {
          formEle.addEventListener('submit', this.onSubmit);
        } else {
          setTimeout(initStyles, 2);
        }
      };
      initStyles();
    }
  };
</script>
