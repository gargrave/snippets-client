<template>
  <aside>
    <el-menu
      id="nav-side"
      class="sidenav"
      default-active="1"
      mode="vertical">

      <app-side-nav-logged-in
        v-if="isLoggedIn"
        @logout="onLogout">
      </app-side-nav-logged-in>

      <app-side-nav-not-logged-in v-else>
      </app-side-nav-not-logged-in>

    </el-menu>
  </aside>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import toastr from 'toastr';

  import SideNavLoggedIn from './components/SideNavLoggedIn.vue';
  import SideNavNotLoggedIn from './components/SideNavNotLoggedIn.vue';

  export default {
    components: {
      appSideNavLoggedIn: SideNavLoggedIn,
      appSideNavNotLoggedIn: SideNavNotLoggedIn,
    },


    computed: {
      ...mapGetters({
        user: 'userData',
        isLoggedIn: 'isLoggedIn'
      })
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
