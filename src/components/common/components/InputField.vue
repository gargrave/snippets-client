<template>
  <div class="form-group">
    <label :for="name">{{ label }}:</label>

    <!-- error message disiplay -->
    <span class="error-msg" v-if="error">{{ error }}</span>

    <!-- 'password' type input field -->
    <div v-if="inputType === 'password'">
      <input
        class="form-control"
        type="password"
        :id="name"
        :name="name"
        :placeholder="placeholder"
        v-model="value"
        @input.prevent="inputEvent"
      >
    </div>

    <!-- use simple 'text' type as fallback -->
    <div v-else>
      <input
        class="form-control"
        type="text"
        :id="name"
        :name="name"
        :placeholder="placeholder"
        v-model="value"
        @input.prevent="inputEvent"
      >
    </div>
  </div>
</template>


<script>
  export default {
    props: {
      // the type of input field (e.g. 'text' 'passowrd' etc.)
      // optional, defaults to 'text'
      inputType: {
        type: String,
        required: false,
        default: 'text'
      },
      // value for input field's label
      label: {
        type: String,
        required: true
      },
      // name/id for the input field
      name: {
        type: String,
        required: true
      },
      // placeholder text for input field (optional)
      placeholder: {
        type: String,
        required: false,
        default: ''
      },
      // validation error message (if any)
      error: {
        type: String,
        required: false,
        default: ''
      }
    },


    data() {
      return {
        // the current value of this field; used for v-model
        value: ''
      };
    },


    methods: {
      /**
       * Handler for @input events on the input field. Simply emits
       * the event upward with the current value.
       */
      inputEvent() {
        this.$emit('valueChanged', this.value);
      }
    }
  };
</script>


<style>
</style>
