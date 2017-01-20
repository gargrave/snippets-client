<template>
  <section>

    <!--
    'Navigation' sub-menu
    -->
    <ul class="sidenav-submenu">
      <li class="sidenav-submenu-header">Navigation</li>

      <!-- link to Snippets page-->
      <li>
        <router-link
          :to="{name: 'snippets-list'}"
          active-class="active"
          exact>
          My Snippets
        </router-link>
      </li>

      <!-- link to starred Snippets page-->
      <li>
        <router-link
          to="/snippets/filter/starred"
          active-class="active"
          exact>
          Starred
        </router-link>
      </li>

      <!-- link to archived Snippets page-->
      <li>
        <router-link
          to="/snippets/filter/archived"
          active-class="active"
          exact>
          Archived
        </router-link>
      </li>
    </ul>


    <!--
    'Account' sub-menu
    -->
    <ul class="sidenav-submenu">
      <li class="sidenav-submenu-header">Account</li>

      <!-- link to profile page -->
      <li>
        <router-link
          :to="{name: 'account'}"
          active-class="active"
          exact>
          <i class="fa fa-user fa-lg" aria-hidden="true"></i>&nbsp;
          Profile
        </router-link>
      </li>

      <!-- logout link -->
      <li>
        <a href="" @click.prevent="onLogout">
          <i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;
          Logout
        </a>
      </li>
    </ul>

  </section>
</template>


<script>
  export default {
    methods: {
      onLogout() {
        this.$emit('logout');
      }
    }
  };
</script>
