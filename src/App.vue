<template>
<div id="app">
    <div class="page home-page">
        <top-nav></top-nav>
        <authenticated></authenticated>
        <footer-area>
        </footer-area>
    </div>
</div>
</template>

<script>
import { TopNav, FooterArea, Authenticated, Anonymous } from '@/components/index';
import { mapState } from 'vuex';

export default {
  name: 'app',
  created() {},
  data() {
    return {};
  },
  computed: {
    ...mapState(['user']),
  },
  components: {
    TopNav,
    Authenticated,
    Anonymous,
    FooterArea,
  },
};
</script>

