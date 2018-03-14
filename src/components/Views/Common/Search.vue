<template>
  <section class="forms">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <card-default>
            <div slot="header-card">Start learning...search for knowledge articles
              <div class="card-close">
                <button @click="$router.push('/suggest')" v-if="!$store.state.user && settings.suggestions ===true" type="button" class="btn btn-info btn-flat btn-addon btn-sm m-b-10 m-l-5 hidden-sm-down">
                  <i class="ti-plus"></i>Suggest</button>&nbsp;
                <button @click="$router.push('/login')" v-if="!$store.state.user" type="button" class="btn btn-info btn-flat btn-addon btn-sm m-b-10 m-l-5 hidden-sm-down">
                  <i class="ti-lock"></i>Login</button>
              </div>
            </div>
            <div slot="body-card">
              <div class="row">
                <div class="col-lg-3  text-center">
                  <img id="mlogo" src="/static/img/insight_rgb-large.png" width="135px">
                </div>
                <div class="col-lg-9">
                  <h3 class="h4">
                    For State agencies and departments that need better knowledge management functionality, INSIGHT is a web-based service that provides knowledge creation, sharing, and archival features.</h3>
                  <h4>Unlike other knowledge management tools, INSIGHT provides easy navigation, portfolio and product knowledge visibility, and an intuitive research experience.
                  </h4>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3" v-if="treeData.length > 0 && settings.categories ===true">
                  <div class="row">
                    <div class="col-lg-12 p-0">
                      <ul class="featured bg-gray">
                        <li v-if="showTree">
                          <strong>Categories:</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="row">
                    <tree class="col-sm-12" :data="treeData" v-if="showTree" :options="treeOptions" @node:selected="nodeSelected" />
                  </div>
                </div>
                <div :class="[treeData.length > 0 && settings.categories === true ? 'col-lg-9' : 'col-lg-12']">
                  <div class="row pb-3">
                    <div class="col-lg-12">
                      <form class="form-horizontal" @submit.prevent="onSubmit">
                        <div class="form-group row">
                          <div class="col-sm-12">
                            <div class="form-group">
                              <div class="input-group">
                                <input type="text" v-model="form.search_terms" v-validate="'required'" name="search" id="search" class="form-control" placeholder="Search...">
                                <span class="input-group-btn">
                                  <button type="submit" class="btn btn-primary">Search</button>
                                </span>
                              </div>
                              <span v-show="errors.has('search')" class="error">{{ errors.first('search') }}</span>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="row" v-if="settings.featured === true">
                    <div class="col-lg-12">
                      <ul class="featured bg-gray">
                        <li v-if="featured_articles">
                          <strong>{{feature_title}}:</strong>
                        </li>
                        <li v-for="x in featured_articles" :key="x._id">
                          <a :href="`/ka/${x._id}`">
                            <i class="fa fa-star" aria-hidden="true"></i>&nbsp;{{x.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12">
                      <card-default class="secondary-card">
                        <div slot="header-card" class="secondary-title">{{results_title}}</div>
                        <div slot="body-card">
                          <ul id="result-articles" class="list-unstyled">
                            <li v-if="!result_articles">&nbsp;</li>
                            <li v-for="x in result_articles" :key="x._id">
                              <a :href="`/ka/${x._id}`">{{x.title}}</a>
                              <span class="d-none d-md-block">View count: {{x.viewcount}}</span>
                            </li>
                          </ul>
                        </div>
                      </card-default>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </card-default>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { CardDefault } from '@/components/index';

export default {
  created() {
    axios
      .get(this.config.settingsUrl)
      .then(response => {
        this.settings = response.data[0];
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Settings');
      });

    axios
      .get(this.config.featuredArticlesUrl)
      .then(response => {
        this.featured_articles = response.data;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Featured Articles');
      });

    axios
      .get(this.config.categoriesUrl)
      .then(response => {
        this.treeData = response.data;
        this.showTree = true;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Article Categories');
      });

    if (this.$route.params.keywords) {
      this.form.search_terms = this.$route.params.keywords;
      this.onSubmit();
    } else {
      axios
        .get(this.config.topArticlesUrl)
        .then(response => {
          this.result_articles = response.data;
        })
        .catch(e => {
          this.$toastr.e(e, 'Error Getting Top Articles');
        });
    }
  },
  data() {
    return {
      settings: '',
      form: { search_terms: '' },
      feature_title: 'Featured Articles',
      results_title: 'Top Articles',
      featured_articles: '',
      result_articles: '',
      treeData: [{ _id: 'Categories', titles: [{ _id: '', data: { articleid: '' } }] }],
      treeOptions: {
        propertyNames: {
          text: '_id',
          children: 'titles',
        },
      },
      showTree: false,
    };
  },
  computed: {
    ...mapGetters({ config: 'getConfig' }),
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          axios
            .post(this.config.searchUrl, this.form)
            .then(response => {
              if (response.status === 200) {
                this.results_title = `Results for '${this.form.search_terms}'`;
                this.result_articles = response.data;
              } else this.$toastr.e(response, 'Search Error');
            })
            .catch(e => {
              this.$toastr.e(e, 'Search Error');
            });
        }
      });
    },
    nodeSelected(node) {
      this.$router.push(`/ka/${node.data('articleid')}`);
    },
  },
  components: {
    CardDefault,
  },
};
</script>

<style>
#mlogo {
  padding-top: 0px !important;
  padding-bottom: 20px !important;
}
.form-control {
  padding-top: 0;
  padding-bottom: 0;
}
.form-group {
  margin-bottom: 0 !important;
}

#search {
  border-color: #a8a8a8 !important;
}

span.input-group-btn button.btn.btn-primary {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

a.tree-anchor {
  color: #29A8E0 !important;
  font-weight: bold;
  font-size: 0.9rem;
}

i.tree-arrow.has-child,
.tree-arrow.has-child {
  margin-left: 5px !important;
  color: #29A8E0 !important;
  width: 15px !important;
}
i.tree-arrow {
  color: #29A8E0 !important;
}

.tree-arrow.has-child:after {
  height: 6px !important;
  width: 6px !important;
  border-color: #29A8E0 !important;
}
ul.tree-children li div.tree-content {
  padding-left: 0px !important;
}
</style>
