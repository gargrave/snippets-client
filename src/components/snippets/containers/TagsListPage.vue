<template>
  <div>
    <!-- page title display -->
    <h3 class="page-title">
      My Tags
      <!-- working icon for background tasks -->
      <i class="fa fa-spinner fa-spin" v-if="isWorking"></i>
    </h3><!-- /page title display -->

    <!-- tags list, shown when not tagsAjaxPending -->
    <transition name="fade">
      <section>
        <app-tags-list-detail
          v-for="tag in tags"
          :working="isWorking"
          :tag="tag"
          :onDeleteClick="onTagDeleteClick">
        </app-tags-list-detail>
      </section>
    </transition>

  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';
  import TagsListDetail from '../components/TagsListDetail';

  export default {
    components: {
      appTagsListDetail: TagsListDetail
    },


    data() {
      return {
        initializing: true,

        // whether any operations are currently running
        working: false,
      };
    },


    computed: {
      isWorking() {
        return this.initializing || this.working || this.tagsAjaxPending;
      },

      ...mapGetters([
        'tagsAjaxPending',
        'tags',
      ])
    },


    methods: {
      onTagDeleteClick(tag) {
        if (!this.isWorking) {
          const msgConfirm = {
            confirmButtonText: 'Ok',
            cancelButtonText: 'Cancel',
            type: 'warning'
          };
          const msgNotify = {
            type: 'success',
            message: 'Tag deleted'
          };

          this.$confirm(`Delete "${tag.title}"?`, 'Confirm', msgConfirm)
            .then(() => {
              this.working = true;
              this.deleteTag(tag.id)
                .then((res) => {
                  this.$notify(msgNotify);
                  this.working = false;
                }, (err) => {
                  this.apiError = err;
                  this.working = false;
                });
            })
            .catch(() => {
              // cancel deletion; no action needed
            });
        }
      },

      ...mapActions([
        'checkForStoredLogin',
        'initTags',
        'deleteTag'
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
