<template>
  <span class="dropdown">
    <el-dropdown trigger="click" @command="onColorSelect">

      <!-- show/hide color picker button -->
      <span :class="buttonClass"></span>

      <!-- color picker panel -->
      <el-dropdown-menu slot="dropdown" class="color-picker-list">
        <el-dropdown-item
          v-for="color in validColors"
          :class="colorPickerLiClass(color)"
          :command="color">
          <a :class="colorPickerAClass(color)"></a>
        </el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>
  </span>
</template>


<script>
  import snippetData from '../../helpers/snippetData';
  import snippetStyles from '../../helpers/snippetStyles';

  export default {
    computed: {
      buttonClass() {
        return 'el-dropdown-link fa fa-chevron-circle-down dropdown-toggle pointer snippet-control snippet-control-color';
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


<style scoped>
  .color-picker-item, .color-picker-list {
    padding: 0;
    margin: 0;
  }

  .color-picker-list {
    border: 1px solid #aaa;
  }

  .color-picker-item > a {
    display: block;
    min-width: 150px;
    min-height: 38px;
    text-decoration: none !important;
  }

  .color-picker-item:hover {
    background-color: black;
  }
</style>
