<template>
  <div id="app">
    <app-sidenav class="hide-on-xs"></app-sidenav>
    <app-navbar></app-navbar>

    <main class="_container">
      <el-row>
        <el-col class="main-content-area" :span="24">
          <router-view></router-view>
        </el-col>
      </el-row>
    </main>

  </div>
</template>

<script>
  import Navbar from './components/layout/Navbar.vue';
  import SideNav from './components/layout/SideNav.vue';

  export default {
    name: 'app',


    components: {
      appNavbar: Navbar,
      appSidenav: SideNav
    }
  };
</script>
