<template>
  <div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import axios from "axios";

export default {
  created() {
    this.logOff();
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["user", "config"])
  },
  methods: {
    ...mapActions(["logoffUser"]),
    logOff() {
      
      this.logoffUser().then(() => {
        this.$router.push("/welcome");
      });

      // axios
      //   .delete(this.config.logoutUrl, {
      //     headers: { "x-auth": this.user.info.token }
      //   })
      //   .then(response => {
      //     if (response.status === 200) {
      //       this.logoffUser().then(() => {
      //         this.$router.push("/welcome");
      //       });
      //     }
      //   })
      //   .catch(e => {
      //     this.$toastr.e(e, "Error Logging Off");
      //   });
    }
  }
};
</script>

