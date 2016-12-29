<template>
  <span class="dropdown">

    <!-- show/hide color picker button -->
    <span
      type="button"
      data-toggle="dropdown"
      aria-hidden="true"
      :class="buttonClass"
    >
    </span>

    <!-- color picker panel -->
    <ul class="dropdown-menu color-picker-list">
      <li v-for="color in validColors"
          :class="colorPickerLiClass(color)">
        <a :class="colorPickerAClass(color)"
           @click.prevent="onColorSelect(color)">
        </a>
      </li>
    </ul>

  </span>
</template>


<script>
  import snippetData from '../../helpers/snippetData';
  import snippetStyles from '../../helpers/snippetStyles';

  export default {
    computed: {
      buttonClass() {
        return 'fa fa-chevron-circle-down dropdown-toggle pointer snippet-control snippet-control-color';
      },

      validColors() {
        return snippetData.VALID_COLORS;
      },
    },


    methods: {
      colorPickerLiClass(color) {
        return `color-picker-item snippet-color-${color}`;
      },

      colorPickerAClass(color) {
        return `color-picker-click-${color}`;
      },

      onColorSelect(color) {
        this.$emit('colorSelected', color);
      }
    }
  };
</script>


<style>
</style>
