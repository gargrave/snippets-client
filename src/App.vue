<template>
  <div id="app">
    <app-sidenav class="hide-on-xs"></app-sidenav>
    <app-navbar></app-navbar>

    <main class="container">
      <el-row>
        <el-col class="main-content-area" :span="24">
          <router-view></router-view>
        </el-col>
      </el-row>
    </main>

  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  import env from './app-data/env';
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
        'setBuild'
      ])
    },


    created() {
      if (env.isDev()) {
        this.setBuild('dev');
      } else if (env.isStaging()) {
        this.setBuild('staging');
      }
    }
  };
</script>
