<template>
  <div id="app">
    <app-sidenav></app-sidenav>
    <app-navbar></app-navbar>

    <img src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
  import Navbar from './components/layout/Navbar.vue'
  import SideNav from './components/layout/SideNav.vue'

  export default {
    name: 'app',

    components: {
      appNavbar: Navbar,
      appSidenav: SideNav
    }
  };
</script>
