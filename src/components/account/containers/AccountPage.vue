<template>
  <section>
    <h3 class="page-title">Account Details</h3>

    <!-- loading spinner -->
    <div
      class="snippets-list-working-spinner"
      v-loading="isWorking"
      v-if="isWorking"
      element-loading-text="Working..."
      style="width: 100%; height: 160px;">
    </div><!-- loading spinner -->

    <transition name="fade">
      <el-card class="box-card" v-if="!isWorking">
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

  </section>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import errors from '../../../app-data/errors';
  import dateHelper from '../../../utils/dateHelper';
  import { localUrls } from '../../../app-data/urls';

  export default {
    data() {
      return {
        // whether any operations are currently running
        working: false,
      };
    },


    computed: {
      dateJoined() {
        return dateHelper.cleanDate(this.userData.dateJoined);
      },

      isWorking() {
        return this.working || this.profileAjaxPending;
      },

      ...mapGetters([
        'profileAjaxPending',
        'userData',
        'profile'
      ])
    },


    methods: {
      ...mapActions([
        'checkForStoredLogin'
      ])
    },


    created() {
      // redirect to login page if not logged in
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.working = false;
          // no action needed if successful
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
