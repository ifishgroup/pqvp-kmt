<template>
  <section class="forms">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <card-default class="ka">
            <div slot="header-card"></div>
            <div slot="body-card">
              <div class="row">
                <div class="col-sm-12">
                  <form class="form-horizontal" @submit.prevent="onSubmit">
                    <div class="form-group row">
                      <div class="col-sm-12">
                        <div class="form-group">
                          <div class="input-group">
                            <input type="text" v-model="form.search_terms" v-validate="'required'" name="search" class="form-control" placeholder="Search knowledge articles">
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

              <h1>{{article.title}}</h1>
              <div class="body_text" v-html="htmlOutput(article.content)">
              </div>
              <div class="row">
                <div class="text-right col-lg-12">
                  <span>Was this article helpful?</span>
                  <button id="btnUpvote" :disabled="voted" @click="recordVote(1)" class="btn btn-sm btn-default">
                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                  </button>
                  <button id="btnDownvote" :disabled="voted" @click="recordVote(-1)" class="btn btn-sm btn-default">
                    <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                  </button>
                  <span>
                    <strong>Votes:</strong>&nbsp;{{article.votes}}
                  </span>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-lg-12">
                  <card-default class="secondary-card">
                    <div slot="header-card" class="secondary-title">Article details:</div>
                    <div slot="body-card">
                      <div class="row p-2">
                        <div class="col-sm-12 col-lg-6">
                          <strong>Published date:</strong> {{formatDate(article.published_date)}}
                        </div>
                        <div class="col-sm-12 col-lg-6">
                          <strong>Last updated:</strong> {{formatDate(article.last_updated)}}
                        </div>
                      </div>
                      <div class="row p-2">
                        <div class="col-sm-12 col-lg-6">
                          <social-sharing :url="article.url" :title="article.title" hashtags="insight,ifish" inline-template>
                            <div>
                              <strong>Share article:</strong>
                              <network network="twitter">
                                <i class="fa fa-twitter fa-lg"></i>
                              </network>
                              <network network="facebook">
                                <i class="fa fa-facebook fa-lg"></i>
                              </network>
                            </div>
                          </social-sharing>
                        </div>
                        <div class="col-sm-12 col-lg-6">
                          <strong>Author:</strong> {{article.author}}&nbsp;({{article.author_email}})
                        </div>
                      </div>
                    </div>
                  </card-default>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <strong>Categories:</strong>&nbsp;
                  <span v-html="splitKeywords(article.keywords)"></span>
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
import helper from '../../Mixins/helper';

const MarkdownIt = require('markdown-it');
const Classy = require('markdown-it-classy');
const sanitizeHtml = require('sanitize-html');

export default {
  mixins: [helper],
  created() {
    this.articleid = this.$route.params.id;
    this.vote.articleid = this.articleid;
    this.readUrl = `${this.config.readArticleUrl}/${this.articleid}`;

    axios
      .get(this.readUrl)
      .then(response => {
        this.article = response.data;
        this.article.url = window.location.href;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Article');
      });
  },
  data() {
    return {
      articleid: '',
      article: {},
      vote: {
        articleid: '',
        tally: 0,
      },
      voted: false,
      form: { search_terms: '' },
    };
  },
  computed: {
    ...mapGetters({ config: 'getConfig' }),
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$router.push(`/search/${this.form.search_terms}`);
        }
      });
    },
    recordVote(value) {
      this.vote.tally = value;
      axios
        .post(this.config.voteArticleUrl, this.vote)
        .then(response => {
          if (response.status === 200) {
            this.voted = true;
            this.article.votes += value;
          } else this.$toastr.e(response, 'Voting Error');
        })
        .catch(e => {
          this.$toastr.e(e, 'Voting Error');
        });
    },
    htmlOutput(content) {
      const sContent = String(content);
      const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: true });
      md.use(Classy);
      const html = md.render(sContent);

      // add responsive images and tables
      let fixedHtml = html.replace(/<img/g, "<img class='img-responsive' ");
      fixedHtml = fixedHtml.replace(/<table/g, "<table class='table table-hover' ");

      const cleanHTML = sanitizeHtml(fixedHtml, {
        allowedTags: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'p',
          'a',
          'ul',
          'ol',
          'nl',
          'li',
          'b',
          'i',
          'strong',
          'em',
          'strike',
          'code',
          'hr',
          'br',
          'div',
          'table',
          'thead',
          'caption',
          'tbody',
          'tr',
          'th',
          'td',
          'pre',
          'img',
          'iframe',
        ],
        allowedAttributes: false,
      });

      return cleanHTML;
    },
  },
  components: {
    CardDefault,
  },
};
</script>

<style>
div.ka div.card-header {
  display: none !important;
}

div.secondary-card div.card-header {
  display: block !important;
}

.form-control {
  padding-top: 0;
  padding-bottom: 0;
}

h1 {
  padding-bottom: 25px;
  padding-top: 15px;
}
span.input-group-btn button.btn.btn-primary {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
div.text-right {
  text-align: right;
}

.img-responsive {
  display: block;
  max-width: 100%;
  height: auto;
}

pre {
  display: block;
  padding: 10px;
  margin: 0 0 10.5px;
  font-size: 14px;
  line-height: 1.42857143;
  word-break: break-all;
  word-wrap: break-word;
  color: #7b8a8b;
  background-color: #ecf0f1;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
pre code {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
}
h5 {
  padding: 15px;
}
.fa-lg {
  font-size: 1.33em;
  color: #0073e5;
}

a.search {
  font-weight: bold !important;
  color: #0073e5 !important;
}
</style>
