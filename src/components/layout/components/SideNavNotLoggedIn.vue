<template>
  <section>
    <ul class="sidenav-submenu">
      <li class="sidenav-submenu-header">Account</li>

      <!-- link to login page -->
      <li>
        <router-link
          :to="{name: 'login'}"
          active-class="active"
          exact>
          Login
        </router-link>
      </li>

      <!-- link to 'new account' page -->
      <li>
        <router-link
          :to="{name: 'account-create'}"
          active-class="active"
          exact>
          Sign Up
        </router-link>
      </li>

    </ul>
  </section>
</template>
