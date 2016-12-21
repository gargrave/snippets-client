<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">


      <!-- navbar branding area -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="offcanvas" data-target=".navmenu">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link class="navbar-brand" to="/">
          {{ appTitle }}
        </router-link>
      </div><!-- /navbar-header -->


      <div class="collapse navbar-collapse">
        <!-- options for logged in users -->
        <ul class="nav navbar-nav navbar-right" v-if="isLoggedIn">
          <li class="dropdown">

            <!-- logged in username & dropdown toggle -->
            <a href="#" class="dropdown-toggle"
               data-toggle="dropdown" role="button"
               aria-haspopup="true" aria-expanded="false">
              {{ user.username }} <span class="caret"></span>
            </a>

            <ul class="dropdown-menu">
              <!-- link to profile/account page -->
              <li>
                <router-link to="/account">
                  <span class="fa fa-user fa-lg"></span>&nbsp; &nbsp;
                  Profile
                </router-link>
              </li>


              <!-- logout link -->
              <li>
                <a href="" @click.prevent="logout">
                  <span class="fa fa-sign-out fa-lg"></span>&nbsp; &nbsp;
                  Logout
                </a>
              </li>
            </ul>

          </li>
        </ul>

        <!-- options for not logged in users -->
        <ul class="nav navbar-nav navbar-right" v-else>
          <li>
            <router-link to="/account/login">Login</router-link>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex';
  import toastr from 'toastr';

  export default {
    data() {
      return {
      };
    },

    computed: {
      ...mapGetters({
        appTitle: 'appTitle',
        user: 'userData',
        isLoggedIn: 'isLoggedIn'
      })
    },

    methods: {
      logout(event) {
        this.storeLogout();
        this.$router.push('/account/login');
      },

      ...mapActions({
        storeLogout: 'logout'
      })
    }
  };
</script>
