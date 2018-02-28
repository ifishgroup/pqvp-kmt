<template>
<div class="page-content d-flex align-items-stretch">
    <side-bar></side-bar>
    <div class="content-inner" v-bind:class="{ active: !config.wideMenu }">
        <header-breadcrumb></header-breadcrumb>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</div>
</template>

<script>
import HeaderBreadcrumb from "./Layout/HeaderBreadcrumb";
import SideBar from "./Layout/SideBar";
import { mapActions,mapState } from "vuex";

export default {
  created() {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["user","config"])
  },
  components: {
    HeaderBreadcrumb,
    SideBar
  }
};
</script>