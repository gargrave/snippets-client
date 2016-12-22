<template>
  <div class="form-group">
    <label :for="name">{{ label }}:</label>

    <!-- TODO: add error message display from parent -->

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
      inputType: {
        type: String,
        required: false,
        default: 'text'
      },
      label: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        required: false,
        default: ''
      }
    },


    data() {
      return {
        value: ''
      };
    },


    methods: {
      inputEvent() {
        this.$emit('valueChanged', this.value);
      }
    }
  };
</script>


<style>
</style>
