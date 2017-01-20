<template>
  <nav>
    <el-menu
      id="nav-top"
      default-active="1"
      mode="horizontal">


      <!-- title/brand display -->
      <el-menu-item index="1" class="navbar-title">
        <router-link to="/">
          {{ appTitle }} <small>{{ appBuild }}</small>
        </router-link>
      </el-menu-item><!-- title/brand display -->


      <!--
      Menus for logged in users
      -->
      <section v-if="isLoggedIn">
        <!-- 'actions' dropdown menu -->
        <span @click="onActionsMenuOpen" @mouseover="onActionsMenuOpen">
          <el-submenu index="2" id="actions-menu">
            <template slot="title">
              <i class="el-icon-menu"></i>
            </template>

            <el-menu-item index="2-1-0" class="submenu-section">Go</el-menu-item>
            <!-- link to main snippets list -->
            <span @click="gotoLink($event, localUrls.snippetsList)">
              <el-menu-item index="2-1-1">
                My Snippets
              </el-menu-item>
            </span>

            <!-- link to starred snippets list -->
            <span @click="gotoLink($event, '/snippets/filter/starred')">
              <el-menu-item index="2-1-2">
                Starred Snippets
              </el-menu-item>
            </span>

            <!-- link to archived snippets list -->
            <span @click="gotoLink($event, '/snippets/filter/archived')">
              <el-menu-item index="2-1-3">
                Archived Snippets
              </el-menu-item>
            </span>

            <el-menu-item index="2-2-0" class="submenu-section">Actions</el-menu-item>
            <!-- link to 'create snippet' page -->
            <span @click="gotoLink($event, localUrls.snippetCreate)">
              <el-menu-item index="2-2-1">
                New Snippet
              </el-menu-item>
            </span>

            <!--
            Manual close button
            Element's submenus are tied to opening/closing based on hover in/out,
              so it can be difficult to use on mobile. This should fix that for now.
            -->
            <span class="hide-on-md-up">
              <hr class="menu-hr">
              <span @click="onCloseSubmenu($event)">
                <el-menu-item index="2-3-0">
                  <i class="el-icon-circle-close"></i>Close
                </el-menu-item>
              </span>
            </span>

          </el-submenu><!-- 'actions' dropdown menu -->
        </span>


        <!--
          user/profile dropdown menu
          wrapping in an extra span to allow a click handler, which el-submenu does not
        -->
        <span @click="onProfileMenuOpen" @mouseover="onProfileMenuOpen">
          <el-submenu index="3" id="profile-menu">
            <template slot="title">
              <!--{{ userData.username }}-->
              <i class="el-icon-setting"></i>
            </template>

            <!-- link to profile page -->
            <span @click="gotoLink($event, localUrls.account)">
              <el-menu-item index="3-1">
                <span class="fa fa-user fa-lg"></span>&nbsp; &nbsp;
                Profile
              </el-menu-item>
            </span>

            <!-- logout link -->
            <span @click="onLogout">
              <el-menu-item index="3-2">
                <span class="fa fa-sign-out fa-lg"></span>&nbsp; &nbsp;
                Logout
              </el-menu-item>
            </span>

            <!--
            Manual close button
            Element's submenus are tied to opening/closing based on hover in/out,
              so it can be difficult to use on mobile. This should fix that for now.
            -->
            <span class="hide-on-md-up">
              <hr class="menu-hr">
              <span @click="onCloseSubmenu($event)">
                <el-menu-item index="3-3-0">
                  <i class="el-icon-circle-close"></i>Close
                </el-menu-item>
              </span>
            </span>

          </el-submenu>
        </span><!-- user/profile dropdown -->
      </section><!-- menus for logged in users -->


      <!--
      Menus for non-authenticated users
      -->
      <section v-else>
        <span @click="onActionsMenuOpen" @mouseover="onActionsMenuOpen">
          <el-submenu index="2" id="actions-menu">
            <template slot="title">
              <i class="el-icon-menu"></i>
            </template>

            <el-menu-item index="2-1-0" class="submenu-section">Account</el-menu-item>
            <!-- link to main snippets list -->
            <span @click="gotoLink($event, '/account/login')">
              <el-menu-item index="2-1-1">
                Login
              </el-menu-item>
            </span>

            <!-- link to starred snippets list -->
            <span @click="gotoLink($event, '/account/new')">
              <el-menu-item index="2-1-2">
                Sign Up
              </el-menu-item>
            </span>

            <!--
            Manual close button
            Element's submenus are tied to opening/closing based on hover in/out,
              so it can be difficult to use on mobile. This should fix that for now.
            -->
            <span class="hide-on-lg">
              <hr class="menu-hr">
              <span @click="onCloseSubmenu($event)">
                <el-menu-item index="2-3-0">
                  <i class="el-icon-circle-close"></i>Close
                </el-menu-item>
              </span>
            </span>

          </el-submenu><!-- 'actions' dropdown menu -->
        </span>
      </section><!-- Menus for non-authenticated users -->

    </el-menu>
  </nav>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../app-data/urls';

  export default {
    data() {
      return {
        localUrls, // make this available to the template
        actionsMenuUpdate: false,
        profileMenuUpdated: false
      };
    },


    computed: {
      ...mapGetters([
        'appTitle',
        'appBuild',
        'isLoggedIn',
        'userData'
      ])
    },


    methods: {
      onCloseSubmenu(event) {
        this.clearActiveClasses(event);
      },

      onNewSnippet() {
        this.$router.push({ name: 'snippet-create'});
      },

      onLogout() {
        this.logout().then((res) => {
          this.$router.push({ name: 'login' });
        });
      },

      onActionsMenuOpen() {
        this.clearActiveClasses();
        if (!this.profileMenuUpdated) {
          const menu = document.querySelector('#actions-menu > ul');
          menu.style.padding = '0';
          menu.style.minWidth = '110px';
        }
      },

      onProfileMenuOpen() {
        this.clearActiveClasses();
        if (!this.profileMenuUpdated) {
          const menu = document.querySelector('#profile-menu > ul');
          menu.style.padding = '0';
          menu.style.right = '0';
          menu.style.left = 'inherit';
          menu.style.minWidth = '130px';
          // document.querySelectorAll('#profile-menu ul span li').forEach((li) => {
          // });
        }
      },

      gotoLink(event, link) {
        this.clearActiveClasses(event);
        this.$router.push(link);
      },

      clearActiveClasses(event) {
        // force the removal of 'is-active' classes, which Element sets automatically
        // they don't make sense in our context, so we are not using them
        if (event) {
          event.target.classList.remove('is-active');
        }
        let actionsMenu = document.querySelector('#actions-menu');
        let profileMenu = document.querySelector('#profile-menu');
        if (actionsMenu) {
          document.querySelector('#actions-menu').classList.remove('is-active');
        }
        if (profileMenu) {
          document.querySelector('#profile-menu').classList.remove('is-active');
        }
      },

      ...mapActions([
        'logout'
      ])
    }
  };
</script>


<style scoped>
  .menu-hr {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .navbar-title {
    font-size: 1.2em;
    color: #777;
    font-weight: bold;
  }

  .submenu-section {
    background-color: #eef1f6 !important;
    font-weight: bold;
    cursor: default;
  }

  #nav-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1030;
    min-height: 50px;
    border: 1px solid #dedede;
    background-color: #f8f8f8;
  }

  #profile-menu {
    float: right;
  }
</style>
