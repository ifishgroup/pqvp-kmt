<template>
 <header class="header">
    <nav class="navbar">
        <!-- search  -->
        <div class="search-box" v-if="showSearch">
            <button class="dismiss" @click.prevent="showSearch=!showSearch"><i class="ti-close"></i></button>
            <form id="searchForm" action="#" role="search">
                <input type="search" placeholder="What are you looking for..." class="form-control">
            </form>
        </div>
        <!-- container-top -->
        <div class="container-fluid">
            <div class="navbar-holder d-flex align-items-center justify-content-between">
                <!-- left top -->
                <div class="navbar-header">
                    <router-link to="/" class="navbar-brand">
                        <div class="brand-text brand-big hidden-lg-down"><span class="logo">INSIGHT</span><strong class="sub-logo">  KMT</strong></div>
                    </router-link>
                    <a id="toggle-btn"  @click.prevent="menuToggle" class="menu-btn" v-bind:class="{ active: config.wideMenu }"><span></span><span></span><span></span></a>
                </div>
                <!-- right top -->
                <!-- <ul class="nav-menu list-unstyled d-flex flex-md-row align-items-md-center" v-if="user">
                    <li class="nav-item d-flex align-items-center"><a id="search" @click.prevent="showSearch=!showSearch"><i class="ti-search"></i></a></li>
                </ul> -->
            </div>
        </div>
    </nav>
</header>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
  ready() {
  },
  data() {
    return {
        showSearch:false
    }
  },
  methods: {
    ...mapActions(['menuToggle']),

    search(){

    }
  },
  computed: {
    ...mapState(["user","config"])
  },
  components: {

  }

}
</script>

