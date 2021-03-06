<template>
  <nav>
    <el-menu
      id="nav-top"
      default-active="1"
      mode="horizontal">


      <!-- title/brand display -->
      <el-menu-item index="1" class="navbar-title hide-on-xs">
        <router-link to="/">
          {{ appTitle }} <small v-if="appBuild">{{ appBuild }}</small>
        </router-link>
      </el-menu-item><!-- title/brand display -->


      <!--
      Menus for logged in users
      -->
      <section v-show="isLoggedIn">
        <!-- 'actions' dropdown menu -->
        <el-submenu index="2" id="actions-menu">
          <template slot="title">
            <i class="el-icon-menu"></i>
          </template>

          <el-menu-item index="2-1-0" class="submenu-section">Snippets</el-menu-item>
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


          <el-menu-item index="2-3-0" class="submenu-section">Tags</el-menu-item>
          <!-- link to 'create snippet' page -->
          <span @click="gotoLink($event, localUrls.tagsList)">
            <el-menu-item index="2-3-1">
              My Tags
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


        <!--
          user/profile dropdown menu
          wrapping in an extra span to allow a click handler, which el-submenu does not
        -->
        <el-submenu index="3" id="profile-menu" class="border-left">
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
        </el-submenu><!-- user/profile dropdown -->


        <!-- button to show search dialog -->
        <el-menu-item index="10-2" id="search-button" class="border-left">
          <i class="fa fa-search" aria-hidden="true"></i>
        </el-menu-item>

        <!-- button to show sort dialog -->
        <el-menu-item index="10-1" id="sort-button" class="border-left">
          <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>
        </el-menu-item>
      </section><!-- menus for logged in users -->


      <!--
      Menus for non-authenticated users
      -->
      <section v-show="!isLoggedIn">
        <span>
          <el-submenu index="2" id="actions-menu-not-auth">
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

    <!-- "search" dialog; hidden by default -->
    <app-search-dialog
      :showing="searchDialogShowing"
      @submitSearch="onSearchSubmit"
      @close="onSearchClose">
    </app-search-dialog>

    <!-- "sort" dialog; hidden by default -->
    <app-sort-dialog
      :showing="sortDialogShowing"
      @close="onSortClose">
    </app-sort-dialog>

  </nav>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../app-data/urls';
  import SearchDialog from '../snippets/components/dialogs/SearchDialog';
  import SortDialog from '../snippets/components/dialogs/SortDialog';
  import searchHelper from '../snippets/helpers/snippetSearchHelper';

  export default {
    components: {
      appSearchDialog: SearchDialog,
      appSortDialog: SortDialog,
    },


    data() {
      return {
        localUrls, // make this available to the template
        actionsMenuUpdated: false,
        profileMenuUpdated: false,
        searchDialogShowing: false,
        sortDialogShowing: false,
      };
    },


    computed: {
      ...mapGetters([
        'appTitle',
        'appBuild',
        'isLoggedIn',
        'userData',
        'currentSearch'
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

      /*=============================================
       = search-related methods
       =============================================*/
      onSearchClick() {
        this.searchDialogShowing = !this.searchDialogShowing;
      },

      onSearchSubmit(value, event) {
        if (!searchHelper.isIdentical(value, this.currentSearch)) {
          this.fetchSnippetsBySearch(value)
            .then((res) => {
              // succesful search; no action needed
            }, (err) => {
              // TODO handle errors
            });
        }
      },

      onSearchClose() {
        this.searchDialogShowing = false;
      },

      /*=============================================
       = sort-related methods
       =============================================*/
      onSortClick() {
        this.sortDialogShowing = !this.sortDialogShowing;
      },

      onSortClose() {
        this.sortDialogShowing = false;
      },

      /*=============================================
       = dropdown helper methods
       =============================================*/
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
          actionsMenu.classList.remove('is-active');
        }
        if (profileMenu) {
          profileMenu.classList.remove('is-active');
        }
      },

      ...mapActions([
        'logout',
        'fetchSnippetsBySearch'
      ])
    },

    created() {
      /*
      Element UI does some weird stuff at run-time with some of its components, which
      causes them to not bind correctly to CSS classes in some cases. Here we are manually
      binding CSS to those elements after we ensure that they have been created.
      */
      const setStyles = () => {
        const elSearchButton = document.querySelector('#search-button');
        const elSortButton = document.querySelector('#sort-button');
        const elProfileMenu = document.querySelector('#profile-menu > ul');
        const elActionsMenu = document.querySelector('#actions-menu > ul');
        const elActionsMenuNoAuth = document.querySelector('#actions-menu-not-auth > ul');

        if (elSearchButton) {
          elSearchButton.addEventListener('click', this.onSearchClick);
          elSortButton.addEventListener('click', this.onSortClick);
          // update 'profile' menu styles
          elProfileMenu.style.padding = '0';
          elProfileMenu.style.right = '0';
          elProfileMenu.style.left = 'inherit';
          elProfileMenu.style.minWidth = '130px';
          // update 'actions' menu styles
          elActionsMenu.style.padding = '0';
          elActionsMenu.style.minWidth = '110px';
          elActionsMenuNoAuth.style.padding = '0';
          elActionsMenuNoAuth.style.minWidth = '110px';
        } else {
          // try again really soon!
          setTimeout(setStyles, 2);
        }
      };
      setStyles();
    }
  };
</script>


<style scoped>
  i {
    color: #777;
  }

  .el-menu-item, .el-submenu {
    border: 0;
  }

  .el-menu-item.border-left,
  .el-submenu-item.border-left,
  li.border-left {
    border-left: #ddd solid 1px;
  }

  .el-menu-item.border-right,
  .el-submenu-item.border-right,
  li.border-right {
    border-right: #ddd solid 1px;
  }

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

  #profile-menu, #search-button, #sort-button {
    float: right;
  }
</style>
