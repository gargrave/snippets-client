<template>
  <div class="btn-group btn-group-justified" role="group">

    <!-- 'submit' button -->
    <div class="btn-group" role="group">
      <input
        type="submit"
        class="btn btn-success"
        :disabled="submitIsDisabled"
        :value="submitText"
      />
    </div>

    <!-- 'cancel' button -->
    <span
      type="button"
      class="btn btn-default"
      :disabled="working"
      @click="onCancelClick"
    >{{ cancelText }}</span>

  </div>
</template>


<script>
  export default {
    props: {
      // whether any operations are currently running
      working: {
        type: Boolean,
        required: true
      },
      // whether submit button should be disabled
      disableSubmit: {
        type: Boolean,
        required: true
      },
      // text to display on submit button
      submitText: {
        type: String,
        required: false,
        default: 'Submit'
      },
      // text to display on cancel button
      cancelText: {
        type: String,
        required: false,
        default: 'Cancel'
      },
      // handler for clicking 'cancel' button
      onCancelClick: {
        type: Function,
        required: true
      }
    },


    computed: {
      submitIsDisabled() {
        return this.working || this.disableSubmit;
      }
    }
  };
</script>


<style>
</style>
