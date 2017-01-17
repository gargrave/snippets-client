<template>
  <aside>
    <el-menu
      id="nav-side"
      class="sidenav"
      default-active="1"
      mode="vertical">

      <ul class="sidenav-submenu">
        <li class="sidenav-submenu-header">Navigation</li>
        <li>
          <!-- link to Snippets page-->
          <router-link
            :to="{name: 'snippets-list'}"
            active-class="active"
            exact>
            My Snippets
          </router-link>
        </li>
        <li>
          <!-- link to starred Snippets page-->
          <router-link
            to="/snippets/filter/starred"
            active-class="active"
            exact>
            Starred
          </router-link>
        </li>
        <li>
          <!-- link to archived Snippets page-->
          <router-link
            to="/snippets/filter/archived"
            active-class="active"
            exact>
            Archived
          </router-link>
        </li>
      </ul>

      <ul class="sidenav-submenu">
        <li class="sidenav-submenu-header">Account</li>

        <li>
          <!-- link to profile page -->
          <router-link
            :to="{name: 'account'}"
            active-class="active"
            exact>
            <span class="fa fa-user fa-lg"></span>&nbsp;&nbsp;
            Profile
          </router-link>
        </li>
      </ul>

    </el-menu>
  </aside>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import toastr from 'toastr';

  export default {
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
