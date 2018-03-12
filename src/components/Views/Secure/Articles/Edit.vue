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
                <div v-if="user.info.role === 'contentAuth'" class="form-group row">
                  <label class="col-sm-3 form-control-label"></label>
                  <div class="col-sm-9">
                    <div class="button-list">
                      <button type="button" @click="contentAction('approve','approved')" class="btn btn-primary btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-plus"></i>Approve</button>
                      <button type="button" @click="contentAction('reject','rejected')" class="btn btn-warning btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-thumb-down"></i>Reject</button>
                      <button type="button" @click="contentAction('archive','archived')" class="btn btn-dark btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-folder"></i>Archive</button>
                      <button type="button" @click="contentAction('delete','deleted')" class="btn btn-danger btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-folder"></i>Delete</button>
                    </div>
                  </div>
                </div>
                <div v-if="user.info.role !== 'contentAuth' && (form.status!='approved' && form.status!='archived')" class="form-group row">
                  <label class="col-sm-3 form-control-label"></label>
                  <div class="col-sm-9">
                    <div class="button-list">
                      <button v-if="(form.status!=='approved' && form.status!=='pending approval')" type="button" @click="contentAction('submit for approval','pending approval')" class="btn btn-primary btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-plus"></i>Submit For Approval</button>
                      <button type="button" @click="contentAction('delete','deleted')" class="btn btn-danger btn-flat btn-addon m-b-10 m-l-5">
                        <i class="ti-folder"></i>Delete</button>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Status:*</label>
                  <div class="col-sm-9">
                    <select class="form-control" id="status" required v-model="form.status">
                      <option v-if="form.status==='archived'" value="archived">Archived</option>
                      <option v-if="form.status==='approved'" value="approved">Approved</option>
                      <option v-if="form.status==='rejected'" value="rejected">Rejected</option>
                      <option v-if="form.status==='draft'" value="draft">Draft</option>
                      <option v-if="form.status==='pending approval'" value="pending approval">Submit For Approval</option>
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
                  <label class="col-sm-3 form-control-label">Featured:</label>
                  <div class="col-sm-9">
                    <div class="i-checks">
                      <input id="chkFeatured" :checked="form.featured" v-model="form.featured" type="checkbox" class="checkbox-template">
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <label class="col-sm-3 form-control-label">Attachment(s):</label>
                  <div class="col-sm-9">
                    <a v-if="form.attachment" :href="`${this.config.uploadUrl}/${form.attachment}`">{{form.attachment}}</a>
                    <div v-if="!form.attachment">none</div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="form-group row">
                  <div class="col-sm-4 offset-sm-3">
                    <button type="button" v-if="(form.status!='approved' && form.status!='archived') || user.info.role == 'contentAuth' " @click.prevent="$router.push('/articles/edit')" class="btn btn-secondary">Cancel</button>
                    <button type="submit" v-if="(form.status!='approved' && form.status!='archived') || user.info.role == 'contentAuth' " class="btn btn-primary">Update</button>
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
    this.articleid = this.$route.params.id;
    this.editUrl = `${this.config.editArticleUrl}/${this.articleid}`;

    axios
      .get(this.editUrl, { headers: { 'x-auth': this.user.info.token } })
      .then(response => {
        this.form = response.data;
      })
      .catch(e => {
        this.$toastr.e(e, 'Error Getting Article');
      });
  },
  data() {
    return {
      articleid: '',
      editUrl: '',
      form: {},
      statusForm: {
        articleid: '',
        status: '',
        user: '',
      },
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
      this.$validator.validateAll().then(result => {
        if (result) {
          this.form.last_updated = new Date();
          this.form.last_update_user = this.user.info.name;

          axios
            .post(this.editUrl, this.form, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then(response => {
              if (response.status === 200) {
                this.$toastr.s('Article was successfully updated!', 'Success');
              } else this.$toastr.e(response, 'Article Error');
            })
            .catch(e => {
              this.$toastr.e(e, 'Article Error');
            });
        }
      });
    },
    contentAction(title, action) {
      this.statusForm.articleid = this.articleid;
      this.statusForm.status = action;
      this.statusForm.user = this.user.info.name;

      const msg = `Are you sure you want to ${title} article?`;
      if (confirm(msg)) {
        if (action === 'deleted') {
          const deleteUrl = `${this.config.deleteArticleUrl}/${this.articleid}`;
          axios
            .get(deleteUrl, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then(response => {
              if (response.status === 200) {
                this.$router.push('/articles/edit');
              } else this.$toastr.e(response, 'Error Deleting Article');
            })
            .catch(e => {
              this.$toastr.e(e, 'Error Deleting Article');
            });
        } else {
          axios
            .post(this.config.updateArticleUrl, this.statusForm, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then(response => {
              if (response.status === 200) {
                this.form.status = this.statusForm.status;
                this.$toastr.s(`Article was successfully ${action}!`, 'Article Status');
              } else this.$toastr.e(response, 'Error Updating Article');
            })
            .catch(e => {
              this.$toastr.e(e, 'Error Updating Article');
            });
        }
      }
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

