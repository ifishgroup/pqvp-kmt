<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <card-default>
                        <div slot="header-card">
                            Add New Article
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
                                            <option value="draft">Draft</option>
                                            <option value="pending approval">Submit for Approval</option>
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
                                        <markdown-editor v-validate="'required'" v-model="form.content" name="article"></markdown-editor>
                                        <span v-show="errors.has('article')" class="error">{{ errors.first('article') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Categories:*</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-model="form.keywords" name="categories" v-validate="'required'" placeholder="comma seperated list" class="form-control">
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
                                        <input type="file" ref="file" name='attachment' placeholder="Select File..." class="form-control" @change="handleFilesUpload">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <div v-if="file" class="file-listing">{{ file.name }}
                                                    <span class="remove-file" v-on:click="removeFile()">Remove</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button type="button" @click="addFiles()" class="btn btn-dark btn-flat btn-sm btn-addon m-b-10 m-l-5">
                                                    <i class="ti-plus"></i>Add File</button>
                                                <br>
                                                <span>
                                                    Attachment can only be docx, xlsx ,pdf, or txt file.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <div class="col-sm-4 offset-sm-3">
                                        <button type="button" @click.prevent="$router.push('/articles/edit')" class="btn btn-secondary">Cancel</button>
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
  created() {},
  data() {
    return {
      file: '',
      form: {
        author_id: '',
        author: '',
        author_email: '',
        title: '',
        status: 'draft',
        content: '',
        keywords: '',
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
    ...mapGetters({ config: 'getConfig', user: 'getUser' }),
  },
  methods: {
    addFiles() {
      this.$refs.file.click();
    },
    removeFile() {
      this.file = '';
    },
    handleFilesUpload() {
      this.file = this.$refs.file.files[0];
      if (!/\.(doc?x|xls?x|pdf|txt)$/i.test(this.file.name)) {
        this.$toastr.e(
          'Attachment can only be a docx, xlsx ,pdf, or txt file!',
          'Attachment Error',
        );
        this.file = '';
      }
    },
    onSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
          this.form.author_id = this.user.info._id;
          this.form.author = this.user.info.name;
          this.form.author_email = this.user.info.email;
          this.form.last_updated = new Date();
          this.form.last_update_user = this.user.info.name;

          if (this.file === '') {
            axios
              .post(this.config.newArticleUrl, this.form, {
                headers: { 'x-auth': this.user.info.token },
              })
              .then(response => {
                if (response.status === 200) {
                  this.$toastr.s('Article was successfully created!', 'Success');
                  this.resetForm();
                } else this.$toastr.e(response, 'Article Error');
              })
              .catch(e => {
                this.$toastr.e(e, 'Article Error');
              });
          } else {
            const formData = new FormData();

            formData.append('attachment', this.file);
            formData.append('newArticle', JSON.stringify(this.form));

            axios
              .post(this.config.newArticleWithAttachmentUrl, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'x-auth': this.user.info.token,
                },
              })
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
        }
      });
    },
    resetForm() {
      this.form.author = '';
      this.form.title = '';
      this.form.status = 'draft';
      this.form.content = '';
      this.form.keywords = '';
      this.form.attachment = '';
      this.file = '';
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

<style>
input[type='file'] {
  position: absolute;
  top: -500px;
}

div.file-listing {
  font-weight: bold !important;
  font-size: 0.85rem !important;
  margin-bottom: 5px !important;
}

span.remove-file {
  color: red !important;
  cursor: pointer !important;
  font-weight: bold !important;
  margin-left: 5px !important;
}
</style>
