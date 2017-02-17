<template>
  <div>
    <!-- page title display -->
    <h3 class="page-title">
      My Tags
      <!-- working icon for background tasks -->
      <i class="fa fa-spinner fa-spin" v-if="backgroundWorking"></i>
    </h3><!-- /page title display -->


    <!-- loading spinner -->
    <div
      class="snippets-list-working-spinner"
      v-loading="tagsAjaxPending || initializing"
      v-if="tagsAjaxPending || initializing"
      element-loading-text="Working..."
      style="width: 100%; height: 160px;">
    </div><!-- loading spinner -->


    <!-- snippets list, shown when not tagsAjaxPending -->
    <transition name="fade">
      <el-card
        class="box-card"
        v-loading="isWorking"
        element-loading-text="Working..."
        style="width: 100%">

        <div class="text item">
          <ul>
            <li v-for="tag in tags">{{ tag.title }}</li>
          </ul>
        </div><!-- /. text item -->
      </el-card>
    </transition>

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';


  export default {
    data() {
      return {
        initializing: true,

        // whether any operations are currently running
        working: false,

        // whether any background operations (e.g. 'quick update') are running
        backgroundWorking: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',
      };
    },


    computed: {
      isWorking() {
        return this.initializing || this.working ||
          this.backgroundWorking || this.profileAjaxPending;
      },

      ...mapGetters([
        'tagsAjaxPending',
        'tags',
      ])
    },


    methods: {
      ...mapActions([
        'checkForStoredLogin',
        'initTags'
      ])
    },


    created() {
      this.working = true;
      this.checkForStoredLogin()
        .then((res) => {
          this.initTags()
            .then((tagRes) => {
              this.initializing = false;
              this.working = false;
            });
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
  .fa-spinner {
    display: block;
    margin-top: 14px;
  }
</style>
