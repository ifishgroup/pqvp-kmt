<template>
<nav class="side-navbar" v-bind:class="{ shrinked: !config.wideMenu }">
    <div class="sidebar-header d-flex align-items-center" >
       <div class="avatar"><img :src="userPhoto" class="img-fluid rounded-circle"></div>
        <div class="title">
            <h3 class="h4">{{userName}}</h3>
            <p>{{userTitle}}</p>
        </div>
    </div>
    <span class="heading">{{headerText}}</span>
    <ul class="list-unstyled">
        <li v-for="x in activeMenu">
            <a @click.prevent="!x.group ? $router.push(x.to): showSubMenu(x.id)" :data-toggle="x.group ? 'collapse':''"><i :class="x.class"></i>{{x.link}}</a>
            <ul :id="x.id" class="collapse list-unstyled" v-if="x.group">
                <li v-for="y in x.group" v-bind:class="{ active: isActive }">
                  <router-link :to="y.to">{{y.link}}</router-link>
                </li>
            </ul>
        </li>
    </ul>
</nav>
</template>

<script>
import { mapActions, mapState } from "vuex";

import helper from "../Mixins/helper";

export default {
  mixins: [helper],
  created() {},
  data() {
    return {
      isActive: true,
      isCollapse: true,
      sidebar: [
        {
          to: "/",
          class: "ti-search",
          link: "Home",
          isecure: true,
          role: ["adminAuth", "executiveAuth", "authorAuth", "contentAuth"]
        },
        {
          to: "/",
          class: "ti-dashboard",
          link: "Dashboard",
          isecure: true,
          role: ["executiveAuth", "contentAuth"]
        },
        {
          id: "users",
          to: "#users",
          class: "ti-user",
          link: "Manage Users",
          isecure: true,
          role: ["adminAuth"],
          group: [
            { to: "/users/new", link: "New" },
            { to: "/users/edit", link: "Edit" }
          ]
        },
        {
          id: "articles",
          to: "#articles",
          class: "ti-layers",
          link: "Articles",
          isecure: true,
          role: ["authorAuth", "contentAuth"],
          group: [
            { to: "/articles/new", link: "New" },
            { to: "/articles/edit", link: "Edit" }
          ]
        },
        // {
        //   id: "settings",
        //   to: "#settings",
        //   class: "ti-settings",
        //   link: "Configure",
        //   isecure: true,
        //   group: [{ to: "/", class: "ti-ruler-pencil", link: "Settings" }]
        // },
        {
          to: "/users/myaccount",
          class: "ti-id-badge",
          link: "My Account",
          role: ["adminAuth", "executiveAuth", "authorAuth", "contentAuth"],
          isecure: true
        },
        {
          to: "/logoff",
          class: "ti-unlock",
          link: "Logoff",
          role: ["adminAuth", "executiveAuth", "authorAuth", "contentAuth"],
          isecure: true
        },
        {
          to: "/welcome",
          class: "ti-search",
          link: "Home",
          isecure: false
        },
        {
          to: "/login",
          class: "ti-lock",
          link: "Login",
          isecure: false
        }
      ]
    };
  },
  methods: {

    showSubMenu(id) {
      var el = document.getElementById(id).classList;
      if (el.contains("collapse")) {
        el.remove("collapse");
      } else {
        el.add("collapse");
      }
    }
  },
  computed: {
    ...mapState(["user", "config"]),
    headerText() {
      return this.user ? "MAIN MENU" : "MAIN MENU";
    },
    userName() {
      return this.user ? this.user.info.name : "INSIGHT";
    },
    userPhoto() {
      var imgsrc = "/static/img/insight-logo.png";

      if (this.user) {
        if (this.user.info.photo == null || this.user.info.photo == "")
          imgsrc = "/static/img/users/default-avatar.png";
        else imgsrc = "/static/img/users/" + this.user.info.photo;
      }
      return imgsrc;
    },
    userTitle() {
      return this.user
        ? this.getRoleName(this.user.info.role)
        : "The iFish Group";
    },
    activeMenu() {
      var showSecure = this.user == null ? false : true;
      var role = this.user == null ? "" : this.user.info.role;
      return this.sidebar.filter(function(u) {
        if (!showSecure) return u.isecure == showSecure;
        else {
          return u.isecure == showSecure && u.role.includes(role);
        }
      });
    }
  },
  components: {}
};
</script>


