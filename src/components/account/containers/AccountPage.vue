<template>
  <section>
    <h3 class="page-title">Account Details</h3>

    <el-card
      class="box-card"
      v-loading="working"
      element-loading-text="Working..."
      style="width: 100%">

      <div class="text item">
        <ul>
          <li>
            <h4>User name: {{ user.username }}</h4>
          </li>
          <li>
            <h4>Real name: {{ user.firstName }} {{ user.lastName }}</h4>
          </li>
          <li>
            <h4>Member since: {{ dateJoined }}</h4>
          </li>
        </ul>
      </div><!-- /. text item -->
    </el-card>

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
        return dateHelper.cleanDate(this.user.dateJoined);
      },

      ...mapGetters({
        user: 'userData'
      })
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
