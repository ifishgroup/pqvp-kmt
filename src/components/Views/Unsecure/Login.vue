<template>
     <div id="container" class="page login-page">
  <div class="container d-flex align-items-center">
    <div class="form-holder has-shadow">
      <div class="row">

        <div class="col-lg-6">
          <div class="info d-flex align-items-center">
            <div class="content">
              <div class="logo-login">
                <h1> INSIGHT</h1>
              </div>
              <p>Knowledge Management Tool</p>
            </div>
          </div>
      </div>
      <div class="col-lg-6 bg-white">
          <div class="form d-flex align-items-center">
            <div class="content">
              <form id="login-form" @submit="onSubmit">
                <div class="form-group">
                  <input id="email" v-model="form.email" type="text" name="email" required placeholder="Email" class="input-material">
                  
                </div>
                <div class="form-group">
                  <input id="password" v-model="form.password" type="password" name="password" required placeholder="Password" class="input-material">
                </div><button class="btn btn-primary" type="submit">Login</button>
              </form>
                <ul class="list-unstyled">
                  <li>ssined@insight-kmt.com - [System Admin]</li>
                  <li>bboss@insight-kmt.com - [Executive]</li>
                  <li>csmith@insight-kmt.com - [Content Manager]</li>
                  <li>pjacobs@insight-kmt.com - [Author]</li>
                  <li>Password:"abcd1234!"</li>
                </ul>
              </p>
              
            </div>
          </div>
        </div>
  </div>
</div>
</div>
 </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  components: {},
  computed: {
    ...mapGetters({ config: "getConfig",app:"getApp" })
  },
  methods: {
    ...mapActions(["loginUser"]),

    onSubmit(evt) {
      evt.preventDefault();

      axios
        .post(this.config.loginUrl, this.form)
        .then(response => {
          // JSON responses are automatically parsed.
          if (response.status === 200) {
            var _json = response.data;
            _json['token']=response.headers['x-auth']
            this.loginUser(_json).then(() => {
              this.$router.push("/");
            });
          }
          else
            console.log('Bad Authentication',response);
        })
        .catch(e => {
          console.log('error-obj',e.response);
          this.$toastr.e(e,"Error");
        });
    }
  }
};
</script>