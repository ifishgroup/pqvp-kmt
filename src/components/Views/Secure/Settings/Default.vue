<template>
  <section class="forms">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <vue-tabs>
            <v-tab title="Articles">
              <card-default>
                <div slot="header-card">
                  Settings
                  <div class="card-close">
                    <div class="dropdown">
                      <button type="button" @click="updateSettings" class="btn btn-primary btn-sm">Update</button>
                    </div>
                  </div>
                </div>
                <div slot="body-card">
                  <div class="form">
                    <form class="form-validate form-horizontal">
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Article suggestions allowed:
                        </label>
                        <div class="col-lg-8">
                          <select class="form-control" v-model="settings.suggestions">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <span>If enabled non authenticated users can submit article suggestions for approval.</span>
                        </div>
                      </div>
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Allow voting:
                        </label>
                        <div class="col-lg-8">
                          <select class="form-control" v-model="settings.voting">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <span>Whether to allow users to vote on an article.</span>
                        </div>
                      </div>
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Allow social media sharing:
                        </label>
                        <div class="col-lg-8">
                          <select class="form-control" v-model="settings.share">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <span>Whether to allow users to share article on social media.</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </card-default>
            </v-tab>
            <v-tab title="Display">
              <card-default>
                <div slot="header-card">
                  Settings
                  <div class="card-close">
                    <div class="dropdown">
                      <button type="button" @click="updateSettings" class="btn btn-primary btn-sm">Update</button>
                    </div>
                  </div>
                </div>
                <div slot="body-card">
                  <div class="form">
                    <form class="form-validate form-horizontal">
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Show featured articles:
                        </label>
                        <div class="col-lg-8">
                          <select class="form-control" v-model="settings.featured">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <span>Whether to show any articles set to featured on the homepage and search.</span>
                        </div>
                      </div>
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Top articles shown on homepage:
                        </label>
                        <div class="col-lg-8">
                          <input type="number" v-model="settings.top_number" class="form-control" name="num_top_results" min="5" max="10" required>
                          <span>Sets the number of top articles shown on the home page.</span>
                        </div>
                      </div>
                      <div class="form-group ">
                        <label for="cname" class="control-label col-lg-4">Search by categories:
                        </label>
                        <div class="col-lg-8">
                          <select class="form-control" v-model="settings.categories">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <span>Shows categories menu tree for articles grouping and quick look up.</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </card-default>
            </v-tab>
          </vue-tabs>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

import { CardDefault } from '@/components/index';
import { VueTabs, VTab } from 'vue-nav-tabs';

import 'vue-nav-tabs/themes/vue-tabs.css';

export default {
  created() {
    axios
      .get(this.$store.state.config.settingsUrl, {
        headers: { 'x-auth': this.$store.state.user.info.token },
      })
      .then(response => {
        this.settings = response.data[0];
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Application Settings');
      });
  },
  data() {
    return {
      settings: '',
    };
  },
  methods: {
    updateSettings() {
      const msg = 'Are you sure you want to update settings?';
      if (confirm(msg)) {
        axios
          .post(this.$store.state.config.settingsUpdateUrl, this.settings, {
            headers: { 'x-auth': this.$store.state.user.info.token },
          })
          .then(response => {
            if (response.status === 200) {
              this.$toastr.s('Settings were successfully updated!', 'Success');
            } else this.$toastr.e(response, 'Error Updating Settings');
          })
          .catch(e => {
            this.$toastr.e(e, 'Error Updating Settings');
          });
      }
    },
  },
  components: {
    CardDefault,
    VueTabs,
    VTab,
  },
};
</script>
<style scoped>
div.tab-content section {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

form label {
  font-weight: bold !important;
  color: #000000 !important;
}

.vue-tabs .nav-tabs > li {
  margin-left: -1px !important;
}
</style>

