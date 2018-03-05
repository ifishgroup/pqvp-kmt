<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <card-default>
                        <div slot="header-card">Add New User</div>
                        <div slot="body-card">
                            <form class="form-horizontal" @submit.prevent="onSubmit">
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Full Name:*</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-model="form.name" name="fullname" autofocus v-validate="'required'" class="form-control">
                                        <span v-show="errors.has('fullname')" class="error">{{ errors.first('fullname') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Email:*</label>
                                    <div class="col-sm-9">
                                        <input type="email" v-model="form.email" name="email" v-validate="'required|email'" class="form-control">
                                        <span v-show="errors.has('email')" class="error">{{ errors.first('email') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Password:*</label>
                                    <div class="col-sm-9">
                                        <input type="password" v-model="form.password" name="password"  v-validate="'required|min:6'" class="form-control">
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
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Role:*</label>
                                    <div class="col-sm-9">
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAdmin" type="radio" value="adminAuth" name="role" v-validate="'required'" class="radio-template">
                                            <label for="roleAdmin">Admin</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAuthor" type="radio" value="authorAuth" name="role"  class="radio-template">
                                            <label for="roleAuthor">Author</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleContent" type="radio" value="contentAuth" name="role"  class="radio-template">
                                            <label for="roleContent">Content Manager</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleExecutive" type="radio" value="executiveAuth" name="role"  class="radio-template">
                                            <label for="roleExecutive">Executive</label>
                                        </div>
                                        <span v-show="errors.has('role')" class="error">{{ errors.first('role') }}</span>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <div class="col-sm-4 offset-sm-3">
                                        <button type="button" @click.prevent="$router.push('/users/edit')" class="btn btn-secondary">Cancel</button>
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
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: '',
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
          axios
            .post(this.config.registerUrl, this.form, {
              headers: { 'x-auth': this.user.info.token },
            })
            .then((response) => {
              // JSON responses are automatically parsed.
              if (response.status === 200) {
                this.$router.push('/users/edit');
              } else this.$toastr.e(response, 'Error Creating User');
            })
            .catch((e) => {
              this.$toastr.e(e.response.data.message, 'Error Creating User');
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

