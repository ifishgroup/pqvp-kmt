<template>
  <section class="forms">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <card-default>
            <div slot="header-card">
              Edit Article
              <div class="card-close">
                <div class="dropdown">
                  <button type="button" @click="$router.push('/articles/edit')" class="btn btn-primary btn-sm">Back to Articles</button>
                </div>
              </div>
            </div>
            <div slot="body-card">
              <form class="form-horizontal" @submit.prevent="onSubmit">
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Status:*</label>
                  <div class="col-sm-9">
                    <select class="form-control" id="status" required v-model="form.status">
                      <option v-if="form.status=='approved' || user.info.role == 'contentAuth'" value="approved">Approved</option>
                      <option value="draft">Draft</option>
                      <option v-if="form.status=='rejected' || user.info.role == 'contentAuth'" value="rejected">Rejected</option>
                      <option value="pending approval">Submit For Approval</option>

                    </select>
                  </div>
                </div>
                <div class="line"></div>
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
                    <markdown-editor v-model="form.content" name="article" :configs="configs" v-validate="'required'"></markdown-editor>
                    <span v-show="errors.has('article')" class="error">{{ errors.first('article') }}</span>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Categories:*</label>
                  <div class="col-sm-9">
                    <input type="text" v-model="form.keywords" name="categories" placeholder="comma seperated list" v-validate="'required'" class="form-control">
                    <span v-show="errors.has('categories')" class="error">{{ errors.first('categories') }}</span>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Permalink:</label>
                  <div class="col-sm-9">
                    <input type="text" v-model="form.permalink" name="permalink" class="form-control">
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <div class="col-sm-4 offset-sm-3">
                    <button type="button" @click.prevent="$router.push('/articles/edit')" class="btn btn-secondary">Cancel</button>
                    <button type="submit" v-if="form.status!='approved' || user.info.role == 'contentAuth' " class="btn btn-primary">Update</button>
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
import helper from '../../../Mixins/helper';

export default {
  mixins: [helper],
  created() {
    const articleid = this.$route.params.id;
    this.editUrl = `${this.config.editArticleUrl}/${articleid}`;

    axios
      .get(this.editUrl, { headers: { 'x-auth': this.user.info.token } })
      .then((response) => {
        this.form = response.data;
      })
      .catch((e) => {
        this.$toastr.e(e, 'Error Getting Article');
      });
  },
  data() {
    return {
      editUrl: '',
      form: {},
      configs: {
        showIcons: ['code', 'table', 'horizontal-rule'],
      },
    };
  },
  computed: {
    ...mapGetters({ config: 'getConfig', user: 'getUser' }),
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.form.last_updated = new Date();
          this.form.last_update_user = this.user.info.name;

          axios
            .post(this.editUrl, this.form, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then((response) => {
              if (response.status === 200) {
                this.$toastr.s('Article was successfully updated!', 'Success');
              } else this.$toastr.e(response, 'Article Error');
            })
            .catch((e) => {
              this.$toastr.e(e, 'Article Error');
            });
        }
      });
    },
  },
  components: {
    CardDefault,
    markdownEditor,
  },
};
</script>

<style >
.CodeMirror {
  font-size: 18px;
}

div.CodeMirror-code pre.CodeMirror-line span {
  color: #000000 !important;
  font-weight: 400;
}

.editor-toolbar.fullscreen,
.CodeMirror-fullscreen {
  z-index: 1001 !important;
}
div.editor-toolbar a {
  color: #000000 !important;
}
</style>

