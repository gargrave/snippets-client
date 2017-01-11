<template>
  <aside class="navmenu navmenu-default navmenu-fixed-left offcanvas-xs">

    <div id="sidenav-loggedin" v-if="isLoggedIn">
      <!-- basic snippets navigation links -->
      <ul class="nav navmenu-nav">
        <li class="nav-header">Navigation</li>
        <li>
          <!-- link to Snippets page-->
          <router-link
            to="/snippets"
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

      <!-- dev stuff (i.e. things I'm working on that don't have a proper home yet) -->
      <ul class="nav navmenu-nav">
        <li class="nav-header">In Dev</li>
        <li><a href="#" @click.prevent="toggleExpanded">Expand/Collapse</a></li>
      </ul>

      <!-- user/account links -->
      <ul class="nav navmenu-nav">
        <li class="nav-header">Account</li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            {{ user.username }} <b class="caret"></b>
          </a>

          <ul class="dropdown-menu navmenu-nav">
            <li>
              <!-- link to profile page -->
              <router-link
                to="/account"
                active-class="active"
                exact>
                <span class="fa fa-user fa-lg"></span>&nbsp;&nbsp;
                Profile
              </router-link>
            </li>
            <li>
              <!-- logout link -->
              <a href="#" @click.prevent="onLogout">
                <span class="fa fa-sign-out fa-lg"></span>&nbsp;&nbsp;
                Logout
              </a>
            </li>
          </ul>

        </li>
      </ul>
    </div><!-- /#sidenav-loggedin -->


    <!-- not logged in; show login links -->
    <ul id="sidenav-notloggedin" class="nav navmenu-nav" v-else>
      <li class="nav-header">Account</li>
      <!-- link to login page -->
      <li>
        <router-link
          :to="{name: 'login'}"
          active-class="active"
          exact>
          Login
        </router-link>
      </li>
      <!-- link to account creation page -->
      <li>
        <router-link
          :to="{name: 'account-create'}"
          active-class="active"
          exact>
          New Account
        </router-link>
      </li>
    </ul><!-- /#sidenav-notloggedin -->

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
      toggleExpanded() {
        toastr.warning('TODO: Implement onExpandCollapse()', 'Not implemented');
      },

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
