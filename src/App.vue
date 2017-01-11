<template>
  <div id="app">
    <app-sidenav></app-sidenav>
    <app-navbar></app-navbar>

    <div class="container-fluid">
      <main class="row">
        <div class="col-xs-12 main-content-area">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  import Navbar from './components/layout/Navbar.vue';
  import SideNav from './components/layout/SideNav.vue';

  export default {
    name: 'app',


    components: {
      appNavbar: Navbar,
      appSidenav: SideNav
    },


    methods: {
      ...mapActions([
        'checkForStoredLogin'
      ])
    }
  };
</script>
