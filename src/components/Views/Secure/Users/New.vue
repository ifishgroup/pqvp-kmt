<template>
    <section class="forms">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <card-default>
                        <div slot="header-card">Add New User</div>
                        <div slot="body-card">
                            <form class="form-horizontal" @submit="onSubmit">
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Full Name:*</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-model="form.name" id="fullname" autofocus required class="form-control">
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Email:*</label>
                                    <div class="col-sm-9">
                                        <input type="email" v-model="form.email" id="email" required class="form-control">
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Password:*</label>
                                    <div class="col-sm-9">
                                        <input type="password" v-model="form.password" id="password" required class="form-control">
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Confirm Password:*</label>
                                    <div class="col-sm-9">
                                        <input type="password" id="password2" required class="form-control">
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="form-group row">
                                    <label class="col-sm-3 form-control-label">Role:*</label>
                                    <div class="col-sm-9">
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAdmin" name="" type="radio" value="adminAuth" name="chkRole" required class="radio-template">
                                            <label for="roleAdmin">Admin</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleAuthor" type="radio" value="authorAuth" name="chkRole" required class="radio-template">
                                            <label for="roleAuthor">Author</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleContent" type="radio" value="contentAuth" name="chkRole" required class="radio-template">
                                            <label for="roleContent">Content Manager</label>
                                        </div>
                                        <div class="i-checks">
                                            <input v-model="form.role" id="roleExecutive" type="radio" value="executiveAuth" name="chkRole" required class="radio-template">
                                            <label for="roleExecutive">Executive</label>
                                        </div>
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
import { CardDefault } from "@/components/index";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        role: ""
      }
    };
  },
  computed: {
    ...mapGetters({ config: "getConfig", user: "getUser" })
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      axios
        .post(this.config.registerUrl, this.form, {
          headers: { "x-auth": this.user.info.token }
        })
        .then(response => {
          // JSON responses are automatically parsed.
          if (response.status === 200) {
            var _json = response.data;
            this.$router.push("/users/edit");
          } else this.$toastr.e(response, "Error Creating User");
        })
        .catch(e => {
          this.$toastr.e(e, "Error Creating User");
        });
    }
  },
  components: {
    CardDefault
  }
};
</script>

