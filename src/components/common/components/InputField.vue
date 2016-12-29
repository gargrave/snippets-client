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
        :value="value"
        @input="inputEvent"
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
        :value="value"
        @input="inputEvent"
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
      value: {
        type: String,
        required: false,
        default: ''
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


    methods: {
      /**
       * Handler for @input events on the input field. Simply emits
       * the event upward with the current value.
       */
      inputEvent(event) {
        this.$emit('valueChanged', event.target.value);
      }
    }
  };
</script>


<style>
</style>
