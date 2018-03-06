const moment = require('moment');

export default {
  methods: {
    getRoleName(role) {
      let roleName;

      switch (role) {
        case 'adminAuth':
          roleName = 'System Admin';
          break;
        case 'contentAuth':
          roleName = 'Content Manager';
          break;
        case 'authorAuth':
          roleName = 'Author';
          break;
        case 'executiveAuth':
          roleName = 'Executive';
          break;
        default:
          roleName = 'N/A';
      }
      return roleName;
    },
    formatDate(date) {
      return moment(date).format('MM/DD/YYYY h:mmA');
    },
    splitKeywords(keywords) {
      if (keywords) {
        const array = keywords.split(',');
        let links = '';
        for (let i = 0; i < array.length; i += 1) {
          if (array[i].trim() !== '') {
            links += `<a class="search" href="/search/${array[i].trim()}">${array[
              i
            ].trim()}</a> <span>|</span> `;
          }
        }
        return links.substring(0, links.length - 1);
      }
      return keywords;
    },
    showEditIcons(article) {
      if (article.status === 'draft') {
        return true;
      }

      if (article.status === 'rejected' && this.$store.state.user.info.role === 'authorAuth') {
        return true;
      }

      if (article.status !== 'draft' && this.$store.state.user.info.role === 'contentAuth') {
        return true;
      }

      return false;
    },
  },
  computed: {
    isCurrentUserAdmin() {
      return this.$store.state.user ? this.$store.state.user.info.role === 'adminAuth' : false;
    },
  },
};
