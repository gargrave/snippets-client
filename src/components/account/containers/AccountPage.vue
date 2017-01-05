<template>
  <div>
    <h2 class="pageTitle">Account Details</h2>

    <div class="panel panel-default snippet-panel">
      <div class="panel-body">

        <ul class="list-group">
          <li class="list-group-item"><h4>User name: {{ user.username }}</h4></li>
          <li class="list-group-item"><h4>Real name: {{ user.firstName }} {{ user.lastName }}</h4></li>
          <li class="list-group-item"><h4>Member since: {{ dateJoined }}</h4></li>
        </ul>

      </div><!-- /panel-body -->
    </div>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex';
  import dateHelper from '../../../utils/dateHelper';

  export default {
    computed: {
      dateJoined() {
        return dateHelper.cleanDate(this.user.dateJoined);
      },

      ...mapGetters({
        user: 'userData'
      })
    }
  };
</script>


<style scoped>
  .list-group {
    margin-bottom: 0;
  }
</style>
