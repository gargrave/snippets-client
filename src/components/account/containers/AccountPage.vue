<template>
  <section>
    <h3 class="page-title">
      Account Details
      <!-- button to toggle 'editing' state -->
      <el-button
        type="text"
        @click="onEditClick">
        {{ editButtonText }}
      </el-button>
      <!-- 'working' indicator -->
      <i
        v-if="working"
        class="fa fa-cog fa-spin"
        aria-hidden="true">
      </i>
    </h3>

    <!--
    'basic display' page; simply shows account details
    only shown when not in 'editing' mode
    -->
    <transition name="fade">
      <section>
        <!-- 'user details' card -->
        <el-card
          class="box-card account-page-card"
          v-if="!isWorking && !editing">

          <div slot="header" class="clearfix">
            <h4 class="account-page-card-title">User Details</h4>
          </div>

          <div class="text item">
            <ul>
              <li>
                <h4>User name: {{ userData.username }}</h4>
              </li>
              <li>
                <h4>Real name: {{ profile.firstName }} {{ profile.lastName }}</h4>
              </li>
              <li>
                <h4>Member since: {{ dateJoined }}</h4>
              </li>
            </ul>
          </div><!-- /text item -->
        </el-card><!-- /'user details' card -->
      </section>
    </transition>


    <!--
    'edit profile' page; only shown when in 'editing' mode
    -->
    <transition name="fade">
      <!-- 'user details' edit card -->
      <el-card
        class="box-card account-page-card"
        v-if="editing">

        <div slot="header" class="clearfix">
          <h4 class="account-page-card-title">User Details</h4>
        </div>

        <div class="text item">
          <app-profile-edit-form
            :working="working"
            :profile="profileCopy"
            @submitted="onFormSubmitted"
            @cancelled="onFormCancelled">
          </app-profile-edit-form>
        </div><!-- /text item -->
      </el-card><!-- /'user details' edit card -->
    </transition>

  </section>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import errors from '../../../app-data/errors';
  import dateHelper from '../../../utils/dateHelper';
  import { localUrls } from '../../../app-data/urls';
  import profileData from '../helpers/profileData';
  import ProfileEditForm from '../components/forms/ProfileEditForm';

  export default {
    components: {
      appProfileEditForm: ProfileEditForm,
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // whether user is currently editing profile
        editing: false,

        // a copy of the profile for sending to the form fo reditin
        profileCopy: {}
      };
    },


    computed: {
      // nicely formatting version of the date a user's profile was created
      dateJoined() {
        return dateHelper.cleanDate(this.userData.dateJoined);
      },

      // whether any of the page's 'working' conditions are currently true
      isWorking() {
        return this.working || this.userAjaxPending || this.profileAjaxPending;
      },

      // text to display on the "edit" link; varies depending on current state (i.e. are we editing now?)
      editButtonText() {
        return this.editing ? '(Cancel)' : '(Edit)';
      },

      ...mapGetters([
        'userAjaxPending',
        'profileAjaxPending',
        'userData',
        'profile'
      ])
    },


    methods: {
      getCleanCatString(category) {
        const str = category.key;
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      getCatNameClass(category) {
        return `category-name snippet-color-${category.key}`;
      },

      /**
       * Toggles the state between viewing and editing the profile
       */
      onEditClick() {
        if (!this.isWorking) {
          this.profileCopy = Object.assign({}, this.profile);
          this.editing = !this.editing;
        }
      },

      /**
       * Callback for form's 'submitted' event; attempt to save the update profile.
       */
      onFormSubmitted() {
        const msgNotify = {
          type: 'info',
          title: 'Cannot Update',
          message: 'No changes to save.'
        };

        const updatedProfile = profileData.buildRecordData(this.profileCopy);
        const noUpdatesToSave = profileData.checkForMatch(this.profile, updatedProfile);

        if (noUpdatesToSave) {
          // if no changes have been made, cancel the process and show message
          this.$notify(msgNotify);
        } else {
          // otherwise, attempt to save the updated data
          this.working = true;
          this.updateProfile(updatedProfile)
            .then((res) => {
              this.editing = false;
              this.working = false;
            }, (err) => {
              this.working = false;
            });
        }
      },

      /**
       * Callback for form's' 'cancelled' event; simply end editing session
       */
      onFormCancelled() {
        this.editing = false;
      },

      ...mapActions([
        'checkForStoredLogin',
        'loadUserProfile',
        'updateProfile'
      ])
    },


    created() {
      // redirect to login page if not logged in
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.working = false;
        }, (err) => {
          if (err === errors.INVALID_TOKEN) {
            this.$notify({
              title: 'Invalid auth token',
              message: 'Please login again.',
              type: 'warning'
            });
          }
          this.$router.push(localUrls.login);
          this.working = false;
        });
    }
  };
</script>


<style>
  /* ElementUI cards specific to this page */
  .account-page-card {
    margin-bottom: 16px;
  }

  /* title/header text for cards on this page */
  .account-page-card h4.account-page-card-title {
    font-weight: bold;
  }

  /* update styles for lists in these card; all settings are shown in lists */
  .account-page-card ul {
    list-style: none;
    padding-left: 20px;
  }

  /* add a little bit of spacing for each list item (i.e. settings displays) */
  .account-page-card ul li {
    margin-bottom: 1.1em;
  }

  /* title/header wrapper for cards on this page */
  .account-page-card > .el-card__header {
    padding: 4px 20px;
    background-color: #ddd;
  }

  /* category name display; used to pad and color the background appropriately */
  .category-name {
    padding: 2px 7px;
    margin-right: 5px;
  }

  /* 'muted-text' in a category name; used for unset categories */
  .category-name + .muted-text {
    font-size: .9em;
    color: #999;
  }

  /* edit/cancel button */
  .edit-button {
    float: right;
  }
</style>
