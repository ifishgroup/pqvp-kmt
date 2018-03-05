<template>
  <section class="tables">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
              <div class="card-close">
              <div class="dropdown">
                <button type="button" @click="$router.push('/users/new')" class="btn btn-primary btn-sm">New User</button>
                </div>
            </div>
            <div class="card-header d-flex align-items-center">
              <h3 class="h4">Users</h3>
            </div>
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(_user, index) in users" :key="_user._id">
                    <th scope="row">{{index += 1}}</th>
                    <td>{{_user.name}}</td>
                    <td>{{_user.email}}</td>
                    <td>{{getRoleName(_user.role)}}</td>
                    <th><a @click.prevent="editUser(`${_user._id}`)"><i class="fa fa-edit fa-lg"></i></a>&nbsp;&nbsp;<a @click.prevent="deleteUser(`${_user.name}`,`${_user._id}`)"><i class="fa fa-trash-o fa-lg"></i></a></th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

</template>

<script>
import axios from 'axios';
import { CardDefault } from '@/components/index';
import { mapGetters } from 'vuex';
import helper from '../../../Mixins/helper';

export default {
  mixins: [helper],
  created() {
    axios
      .get(this.config.allUsersUrl, { headers: { 'x-auth': this.user.info.token } })
      .then((response) => {
        this.users = response.data;
      })
      .catch((e) => {
        this.$toastr.e(e, 'Error Getting Users List');
      });
  },
  data() {
    return {
      counter: 1,
      users: [],
    };
  },
  methods: {
    deleteUser(name, userid) {
      const msg = `Are you sure you want to delete user '${name}'?`;
      if (confirm(msg)) {
        const url = `${this.config.deleteUserUrl}/${userid}`;
        axios
          .get(url, {
            headers: { 'x-auth': this.user.info.token },
          })
          .then((response) => {
            this.users = response.data;
          })
          .catch((e) => {
            this.$toastr.e(e, 'Error Deleting User');
          });
      }
    },
    editUser(id) {
      const route = `/users/edit/${id}`;
      this.$router.push(route);
    },
  },
  computed: {
    ...mapGetters({ config: 'getConfig', user: 'getUser' }),
  },
  components: {
    CardDefault,
  },
};
</script>

<style scoped>
.fa-lg {
  font-size: 1.33em;
  color: #0073e5;
}
</style>

