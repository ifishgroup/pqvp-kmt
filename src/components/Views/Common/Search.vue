<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <card-default>
                        <div slot="header-card">Start Learning...Search for knowledge articles</div>
                        <div slot="body-card">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row pb-3">
                                        <div class="col-sm-12">
                                            <form class="form-horizontal" @submit.prevent="onSubmit">
                                                <div class="form-group row">
                                                    <div class="col-sm-12">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <input type="text" v-model="form.search_terms" v-validate="'required'" name="search" class="form-control" placeholder="Search is based on Knowledge Article titles and categories">
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
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <ul id="featured-articles" class="bg-gray">
                                                <li v-if="featured_articles"><strong>{{feature_title}}:</strong></li>
                                                <li v-for="x in featured_articles" :key="x._id">
                                                    <a :href="`/ka/${x._id}`"><i class="fa fa-star" aria-hidden="true"></i>&nbsp;{{x.title}}</a>
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
      .get(this.config.featuredArticlesUrl)
      .then(response => {
        this.featured_articles = response.data;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Featured Articles');
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
      form: { search_terms: '' },
      feature_title: 'Featured Articles',
      results_title: 'Top Articles',
      featured_articles: '',
      result_articles: '',
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
  },
  components: {
    CardDefault,
  },
};
</script>

<style>
.form-control {
  padding-top: 0;
  padding-bottom: 0;
}
.form-group
{
    margin-bottom: 0 !important;
}
span.input-group-btn button.btn.btn-primary {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
