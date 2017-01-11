<template>
  <div>
    <h2 class="pageTitle">Account Details</h2>

    <div class="panel panel-default snippet-panel">
      <div class="panel-body">

        <ul class="list-group">
          <li class="list-group-item">
            <h4>User name: {{ user.username }}</h4>
          </li>
          <li class="list-group-item">
            <h4>Real name: {{ user.firstName }} {{ user.lastName }}</h4>
          </li>
          <li class="list-group-item">
            <h4>Member since: {{ dateJoined }}</h4>
          </li>
        </ul>

      </div><!-- /panel-body -->
    </div><!-- /panel -->
  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';
  import toastr from 'toastr';

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
            toastr.info('Please login again.', 'Invalid auth token');
          }
          this.$router.push(localUrls.login);
        });
    }
  };
</script>


<style scoped>
  .list-group {
    margin-bottom: 0;
  }
</style>
