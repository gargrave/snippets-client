<template>
  <section>
    <h2 class="page-title">Account Details</h2>

    <el-card class="box-card">
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

  import errors from '../../../appData/errors';
  import dateHelper from '../../../utils/dateHelper';
  import { localUrls } from '../../../appData/urls';

  export default {
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
      this.checkForStoredLogin()
        .then((res) => {
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
        });
    }
  };
</script>
