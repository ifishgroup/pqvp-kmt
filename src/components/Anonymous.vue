<template>
<div class="page-content d-flex align-items-stretch">
 <side-bar></side-bar>
 <router-view></router-view>
</div>
</template>

<script>
import SideBar from './Layout/SideBar';

export default {
  created() {

  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {},
  components: {
    SideBar,
  },
};
</script>

