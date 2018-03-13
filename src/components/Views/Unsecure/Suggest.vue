<template>
  <section class="forms">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <card-default>
            <div slot="header-card">
              Suggest Knowledge Article
            </div>
            <div slot="body-card">
              <form class="form-horizontal" @submit.prevent="onSubmit">
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Article Title:*</label>
                  <div class="col-sm-9">
                    <input type="text" autofocus v-model="form.title" name="title" v-validate="'required'" class="form-control">
                    <span v-show="errors.has('title')" class="error">{{ errors.first('title') }}</span>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Article Body:*</label>
                  <div class="col-sm-9">
                    <markdown-editor v-validate="'required'" v-model="form.content" name="article"></markdown-editor>
                    <span v-show="errors.has('article')" class="error">{{ errors.first('article') }}</span>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <div class="col-sm-4 offset-sm-3">
                    <button type="button" @click.prevent="$router.push('/')" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create</button>
                  </div>
                </div>
              </form>
            </div>
          </card-default>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import { CardDefault } from '@/components/index';
import markdownEditor from 'vue-simplemde/src/markdown-editor';
import 'simplemde/dist/simplemde.min.css';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  created() {
    axios
      .get(this.config.authorUrl)
      .then(response => {
        this.author = response.data;
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        this.form.author_id = this.author._id;
        this.form.author = this.author.name;
        this.form.author_email = this.author.email;
        this.form.last_updated = new Date();
        this.form.last_update_user = this.author.name;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error');
      });
  },
  data() {
    return {
      author: '',
      form: {
        author_id: '',
        author: '',
        author_email: '',
        title: '',
        status: 'draft',
        content: '',
        keywords: 'suggestion',
        attachment: '',
        featured: false,
        last_updated: '',
        last_update_user: '',
        published_date: '',
        viewcount: 0,
        votes: 0,
      },
    };
  },
  computed: {
    ...mapGetters({ config: 'getConfig' }),
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.form.title = `[SUGGESTION] - ${this.form.title}`;

          axios
            .post(this.config.newSuggestionUrl, this.form)
            .then(response => {
              if (response.status === 200) {
                this.$toastr.s('Article was successfully created!', 'Success');
                this.resetForm();
              } else this.$toastr.e(response, 'Article Error');
            })
            .catch(e => {
              this.$toastr.e(e, 'Article Error');
            });
        }
      });
    },
    resetForm() {
      this.form.title = '';
      this.form.status = 'draft';
      this.form.content = '';
      this.form.keywords = 'suggestion';
      this.form.attachment = '';
      this.$nextTick(() => {
        this.$validator.reset();
      });
    },
  },
  components: {
    CardDefault,
    markdownEditor,
  },
};
</script>

