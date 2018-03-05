<template>
  <section class="tables">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
              <div class="card-close">
              <div class="dropdown">
                <button type="button" @click="$router.push('/articles/new')" class="btn btn-primary btn-sm">New Article</button>
                </div>
            </div>
            <div class="card-header d-flex align-items-center">
              <h3 class="h4">Articles</h3>
            </div>
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(article, index) in articles" :key="article._id">
                    <th scope="row">{{index += 1}}</th>
                    <td><a class="article" @click.prevent="editArticle(`${article._id}`)">{{article.title}}</a></td>
                    <td>{{article.author}}</td>
                     <td>{{article.status}}</td>
                    <th><a v-if="showEditIcons(article)==true" @click.prevent="editArticle(`${article._id}`)"><i class="fa fa-edit fa-lg"></i></a>&nbsp;&nbsp;<a v-if="showEditIcons(article)==true"  @click.prevent="deleteArticle(`${article.title}`,`${article._id}`)"><i class="fa fa-trash-o fa-lg"></i></a></th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

</template>

<script>
import axios from 'axios';
import { CardDefault } from '@/components/index';
import { mapGetters } from 'vuex';
import helper from '../../../Mixins/helper';

export default {
  mixins: [helper],
  created() {
    axios
      .get(this.config.allArticlesUrl, {
        headers: { 'x-auth': this.user.info.token },
      })
      .then((response) => {
        this.articles = response.data;
      })
      .catch((e) => {
        this.$toastr.e(e, 'Error Getting Articles List');
      });
  },
  data() {
    return {
      counter: 1,
      articles: [],
    };
  },
  methods: {
    deleteArticle(article, articleid) {
      const msg = `Are you sure you want to delete article '${article}'?`;
      if (confirm(msg)) {
        const url = `${this.config.deleteArticleUrl}/${articleid}`;
        axios
          .get(url, {
            headers: { 'x-auth': this.user.info.token },
          })
          .then((response) => {
            this.articles = response.data;
          })
          .catch((e) => {
            this.$toastr.e(e, 'Error Deleting Article');
          });
      }
    },
    editArticle(id) {
      const route = `/articles/edit/${id}`;
      this.$router.push(route);
    },
  },
  computed: {
    ...mapGetters({ config: 'getConfig', user: 'getUser' }),
  },
  components: {
    CardDefault,
  },
};
</script>

<style scoped>
.fa-lg {
  font-size: 1.33em;
  color: #0073e5;
}
a.article {
  font-weight: bold;
  color: #0073e5;
}
a.article:hover {
  font-weight: bold;
  color: #0073e5;
  text-decoration: underline;
}
</style>

