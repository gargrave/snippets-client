<template>
  <section>
    <h3 class="page-title">
      Account Details
      <el-button
        type="text"
        @click="onEditClick">
        {{ editButtonText }}
      </el-button>
    </h3>

    <transition name="fade">
      <el-card
        class="box-card"
        v-if="!isWorking && !editing"
        v-loading="isWorking"
        element-loading-text="Working..."
        style="width: 100%">

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
        </div><!-- /. text item -->
      </el-card>
    </transition>


    <transition name="fade">
      <el-card
        class="box-card"
        v-if="editing"
        v-loading="isWorking"
        element-loading-text="Working..."
        style="width: 100%">

        <div class="text item">
          <app-profile-edit-form
            :working="working"
            :profile="profileCopy"
            @submitted="onFormSubmitted"
            @cancelled="onFormCancelled">
          </app-profile-edit-form>
        </div><!-- /. text item -->
      </el-card>
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
      appProfileEditForm: ProfileEditForm
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
      dateJoined() {
        return dateHelper.cleanDate(this.userData.dateJoined);
      },

      isWorking() {
        return this.working || this.userAjaxPending || this.profileAjaxPending;
      },

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
      /** toggles the state between viewing and editing the profile */
      onEditClick() {
        if (!this.isWorking) {
          this.profileCopy = Object.assign({}, this.profile);
          this.editing = !this.editing;
        }
      },

      /** Callback for form's 'submitted' event; attempt to save the update profile. */
      onFormSubmitted() {
        const msgNotify = {
          type: 'info',
          title: 'Cannot Update',
          message: 'No changes to save.'
        };
        const updatedProfile = profileData.buildRecordData(this.profileCopy);

        if (profileData.checkForMatch(this.profile, updatedProfile)) {
          this.$notify(msgNotify);
        } else {
          console.log('update dat profile!');
          this.working = true;
          this.updateProfile(updatedProfile)
            .then((res) => {
              this.editing = false;
              this.working = false;
            }, (err) => {
              this.working = false;
            })
        }
      },

      /** Callback for form's' 'cancelled' event; simply end editing session */
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


<style scoped>
  .edit-button {
    float: right;
  }
</style>
