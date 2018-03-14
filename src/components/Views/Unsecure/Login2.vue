<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <card-default>
                        <div slot="header-card">Login Form</div>
                        <div slot="body-card">
                            <div class="row">
                                <div class="col-lg-5">
                                    <form id="login-form" @submit.prevent="onSubmit()">
                                        <div class="form-group">
                                            <label class="form-control-label">Email</label>
                                            <input id="email" v-model="form.email" type="text" name="email" v-validate="'required|email'" autofocus class="input-material">
                                            <span v-show="errors.has('email')" class="error">{{ errors.first('email') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-control-label">Password</label>
                                            <input id="password" v-model="form.password" type="password" v-validate="'required'" name="password" class="input-material">
                                            <span v-show="errors.has('password')" class="error">{{ errors.first('password') }}</span>
                                        </div>
                                        <div class="form-group">
                                            &nbsp;
                                        </div>
                                        <div class="form-group">
                                            <button class="btn btn-primary" type="submit">Login</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-lg-7">
                                    <table class="table table-striped" id="tbl-directory">
                                        <thead>
                                            <tr>
                                                <th>Role</th>
                                                <th>Name</th>
                                                <th>Login</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>System Admin</td>
                                                <td>Simon Sined</td>
                                                <td>ssined@insight-kmt.com</td>
                                            </tr>
                                            <tr>
                                                <td>Executive</td>
                                                <td>Bill Boss</td>
                                                <td>bboss@insight-kmt.com</td>
                                            </tr>
                                            <tr>
                                                <td>Content Manager</td>
                                                <td>Connie Smith</td>
                                                <td>csmith@insight-kmt.com</td>
                                            </tr>
                                            <tr>
                                                <td>Author</td>
                                                <td>Ann Jacobs</td>
                                                <td>ajacobs@insight-kmt.com</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p><b>Password: abcd1234!</b></p>
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
import { CardDefault } from '@/components/index';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  components: { CardDefault },
  computed: {
    ...mapGetters({ config: 'getConfig', app: 'getApp' }),
  },
  methods: {
    ...mapActions(['loginUser']),

    onSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          axios
            .post(this.config.loginUrl, this.form)
            .then(response => {
              // JSON responses are automatically parsed.
              if (response.status === 200) {
                const json = response.data;
                json.token = response.headers['x-auth'];
                this.loginUser(json).then(() => {
                  this.$router.push('/');
                });
              } else this.$toastr.e(response, 'Bad Authentication');
            })
            .catch(e => {
              const title = `${e.response.status}-${e.response.statusText}`;
              let msg = e.message;
              if (e.response.status === 401) {
                msg = 'Invalid username or password.  Please try again.';
              }
              this.$toastr.e(msg, title);
            });
        }
      });
    },
  },
};
</script>
<style>
#tbl-directory tr {
  font-size: 0.9rem !important;
  color: #000000 !important;
  font-weight: 500 !important;
}
</style>

