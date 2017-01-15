<template>
  <el-menu
  default-active="1"
  class="el-menu-demo"
  mode="horizontal">

    <!-- title/brand display -->
    <el-menu-item index="1">
      <router-link class="navbar-brand-link" to="/">
        {{ appTitle }}
      </router-link>
      <span
        class="unlinked-navbar-brand"
        v-if="appBreadcrumbTitle">
        | {{ appBreadcrumbTitle }}
      </span>
    </el-menu-item>

    <el-submenu index="2">
      <template slot="title">Workspace</template>
      <el-menu-item index="2-1">
        item one
      </el-menu-item>
      <el-menu-item index="2-2">
        item two
      </el-menu-item>
      <el-menu-item index="2-3">
        item three
      </el-menu-item>
    </el-submenu>


    <!-- logged in; user/profile dropdown -->
    <el-submenu index="4" style="float: right;">
      <template slot="title">
        {{ userData.username }}
      </template>

      <!-- link to profile page -->
      <el-menu-item index="4-1">
        <router-link to="/account">
          <span class="fa fa-user fa-lg"></span>&nbsp; &nbsp;
          Profile
        </router-link>
      </el-menu-item>

      <!-- logout link -->
      <el-menu-item index="4-2">
        <a href="" @click.prevent="onLogout">
          <span class="fa fa-sign-out fa-lg"></span>&nbsp; &nbsp;
          Logout
        </a>
      </el-menu-item>
    </el-submenu><!-- user/profile dropdown -->

  </el-menu>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import toastr from 'toastr';

  export default {
    computed: {
      ...mapGetters([
        'appTitle',
        'appBreadcrumbTitle',
        'userData',
        'isLoggedIn'
      ])
    },


    methods: {
      onLogout() {
        this.logout().then((res) => {
          toastr.success('Logged out');
          this.$router.push('/account/login');
        });
      },

      ...mapActions([
        'logout'
      ])
    }
  };
</script>


<style scoped>
  .el-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1030;
    min-height: 50px;
    border: 1px solid #dedede;
    background-color: #f8f8f8;
  }

  .navbar-brand-link {
    padding-right: 5px;
  }

  .navbar-brand.unlinked-navbar-brand,
  .navbar-brand.unlinked-navbar-brand:hover {
    color: #777;
    margin-left: -15px;
  }
</style>
