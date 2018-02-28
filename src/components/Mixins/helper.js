export default {
  methods: {
    getRoleName(role) {
      var roleName;

      switch (role) {
        case "adminAuth":
          roleName = "System Admin";
          break;
        case "contentAuth":
          roleName = "Content Manager";
          break;
        case "authorAuth":
          roleName = "Author";
          break;
        case "executiveAuth":
          roleName = "Executive";
          break;
        default:
          roleName = "N/A";
      }
      return roleName;
    },
    showEditIcons(article) {
      if (article.status == "draft" && this.$store.state.user.info.role == "authorAuth")
        return true;

      if (article.status == "rejected" && this.$store.state.user.info.role == "authorAuth")
        return true;

      if (article.status != "draft" && this.$store.state.user.info.role == "contentAuth")
        return true;

      return false;
    }
  },
  computed: {
    isCurrentUserAdmin() {
      return this.$store.state.user ? this.$store.state.user.info.role == "adminAuth" ? true : false : false;
    }
  }
};
