<template>
            <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <!-- Basic Form-->
                <div class="col-lg-6">
                    <card-default>
                        <div slot="header-card">Login Form</div>
                        <div slot="body-card">
                         
                            <form id="login-form" @submit="onSubmit">
                                <div class="form-group">
                                    <label class="form-control-label">Email</label>
                                    <input id="email" v-model="form.email" type="email" name="email" required autofocus  class="input-material">
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label">Password</label>
                                    <input id="password" v-model="form.password" type="password" name="password"   class="input-material">
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-primary" type="submit">Login</button>
                                </div>
                            </form>
                        </div>
                    </card-default>
                </div>
                <!-- Horizontal Form-->
                <div class="col-lg-6">
                    <card-default>
                        <div slot="header-card">Insight User Directory</div>
                        <div slot="body-card">
                           <ul class="list-unstyled">
                  <li><b>System Admin</b></br>ssined@insight-kmt.com</li>
                  <li><b>Executive</b></br>bboss@insight-kmt.com</li>
                  <li><b>Content Manager</b></br>csmith@insight-kmt.com</li>
                  <li><b>Author</b></br>pjacobs@insight-kmt.com</li>
                  <li><br><b>Password</b>:"abcd1234!"</li>
                </ul>
                </div>
                    </card-default>
                </div>
                <!-- Form Elements -->
               
            </div>
        </div>
    </section>

</template>

<script>
import { CardDefault } from "@/components/index";
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
  components: {CardDefault},
  computed: {
    ...mapGetters({ config: "getConfig",app:"getApp" }),
  },
  methods: {
    ...mapActions(['loginUser']),

    onSubmit(evt) {
      evt.preventDefault();

      axios
        .post(this.config.loginUrl, this.form)
        .then(response => {
          // JSON responses are automatically parsed.
          if (response.status === 200) 
          {
            let json = response.data;
            json['token']=response.headers['x-auth'];
            this.loginUser(json).then(() => {
              this.$router.push('/');
            });
          }
          else
            console.log('Bad Authentication', response);
        })
        .catch(e => {
          console.log('error-obj',e.response);
          this.$toastr.e(e,"Error");
        });
    }
  }
};
</script>



