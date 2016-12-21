<template>
  <aside class="navmenu navmenu-default navmenu-fixed-left offcanvas-xs">

    <div id="sidenav-loggedin" v-if="isLoggedIn">
      <!-- basic snippets navigation links -->
      <ul class="nav navmenu-nav">
        <li class="nav-header">Navigation</li>
        <li>
          <router-link to="/snippets">My Snippets</router-link>
        </li>
        <li>
          <router-link to="/snippets/filter/starred">Starred</router-link>
        </li>
        <li>
          <router-link to="/snippets/filter/archived">Archived</router-link>
        </li>
      </ul>

      <!-- dev stuff (i.e. things I'm working on that don't have a proper home yet) -->
      <ul class="nav navmenu-nav">
        <li class="nav-header">In Dev</li>
        <li><a href="#" @click="onExpandCollapse">Expand/Collapse</a></li>
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
              <router-link to="/account">
                <span class="fa fa-user fa-lg"></span>&nbsp;&nbsp;
                Profile
              </router-link>
            </li>
            <li>
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
      <li>
        <router-link to="/account/login">Login</router-link>
      </li>
      <li>
        <router-link to="/account/create">New Account</router-link>
      </li>
    </ul><!-- /#sidenav-notloggedin -->

  </aside>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import toastr from 'toastr';

  export default {
    data() {
      return {
        appName: 'Snippets'
      };
    },

    computed: {
      ...mapGetters({
        user: 'userData',
        isLoggedIn: 'isLoggedIn'
      })
    },

    methods: {
      onExpandCollapse(event) {
        event.preventDefault();
        toastr.warning('TODO: Implement onExpandCollapse()', 'Not implemented');
      },

      onLogout(event) {
        this.storeLogout();
        this.$router.push('/account/login');
      },

      ...mapActions({
        storeLogout: 'logout'
      })
    }
  };
</script>
