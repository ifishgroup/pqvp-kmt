<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <card-default>
                        <div slot="header-card">Edit User Profile</div>
                        <div slot="body-card">
                            <form class="form-horizontal" @submit.prevent="onSubmit">
                                <div class="form-group row">

                                    <label class="col-sm-3 form-control-label">Photo</label>
                                    <div class="col-sm-9">
                                        <img :src="userPhoto" width="144px" class="img-fluid">
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Full Name:*</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="fullname" v-model="form.name" id="fullname" autofocus v-validate="'required'" class="form-control">
                                        <span v-show="errors.has('fullname')" class="error">{{ errors.first('fullname') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Email:*</label>
                                    <div class="col-sm-9">
                                        <input type="hidden" v-model="form._id" id="_id">
                                        <input type="email" disabled v-model="form.email" id="email" class="form-control">
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Password:*</label>
                                    <div class="col-sm-9">
                                        <input type="password" v-model="form.password" name="password" v-validate="'required|min:6'" class="form-control">
                                        <span v-show="errors.has('password')" class="error">{{ errors.first('password') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Confirm Password:*</label>
                                    <div class="col-sm-9">
                                        <input type="password" name="confirmed" v-validate="'required|confirmed:password'" class="form-control">
                                        <span v-show="errors.has('confirmed')" class="error">{{ errors.first('confirmed') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row" v-if="!isCurrentUserAdmin">
                                    <label class="col-sm-3 form-control-label">Role:*</label>
                                    <div class="col-sm-9">
                                        {{getRoleName(form.role)}}
                                    </div>
                                </div>
                                <div class="form-group row" v-if="isCurrentUserAdmin">
                                    <label class="col-sm-3 form-control-label">Role:*</label>
                                    <div class="col-sm-9">

                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAdmin" type="radio" value="adminAuth" name="role" v-validate="'required'" class="radio-template">
                                            <label for="roleAdmin">Admin</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAuthor" type="radio" value="authorAuth" name="role" class="radio-template">
                                            <label for="roleAuthor">Author</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleContent" type="radio" value="contentAuth" name="role" class="radio-template">
                                            <label for="roleContent">Content Manager</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleExecutive" type="radio" value="executiveAuth" name="role" class="radio-template">
                                            <label for="roleExecutive">Executive</label>
                                        </div>
                                        <span v-show="errors.has('role')" class="error">{{ errors.first('role') }}</span>
                                        <span>Admins shouldn't change their own role.</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <div class="col-sm-4 offset-sm-3">
                                        <button type="button" @click.prevent="$router.push(cancelUrl)" class="btn btn-secondary">Cancel</button>
                                        <button type="submit" class="btn btn-primary">Update</button>
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
import axios from 'axios';
import { mapGetters } from 'vuex';
import helper from '../../../Mixins/helper';

export default {
  mixins: [helper],
  created() {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    let _id;
    if (this.$route.params.id) _id = this.$route.params.id;
    else _id = this.user.info._id;

    this.editUrl = `${this.config.editUserUrl}/${_id}`;

    axios
      .get(this.editUrl, { headers: { 'x-auth': this.user.info.token } })
      .then((response) => {
        this.form = response.data;
      })
      .catch((e) => {
        this.$toastr.e(e, 'Error Getting User');
      });
  },
  data() {
    return {
      editUrl: '',
      form: {},
    };
  },
  computed: {
    ...mapGetters({ config: 'getConfig', user: 'getUser' }),
    cancelUrl() {
      if (this.isCurrentUserAdmin) return '/users/edit';
      return '/';
    },
    userPhoto() {
      let imgsrc = '/static/img/users/default-avatar.png';

      if (this.form) {
        if (this.form.photo === null || this.form.photo === '') { imgsrc = '/static/img/users/default-avatar.png'; } else imgsrc = `/static/img/users/${this.form.photo}`;
      }
      return imgsrc;
    },
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios
            .post(this.editUrl, this.form, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then((response) => {
              // JSON responses are automatically parsed.
              if (response.status === 200) {
                this.$toastr.s('Profile was successfully update!', 'Success');
              } else this.$toastr.e(response, 'Bad Authentication');
            })
            .catch((e) => {
              this.$toastr.e(e, 'Error');
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

