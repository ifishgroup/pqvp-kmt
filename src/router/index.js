import Vue from 'vue';
import Router from 'vue-router';
import {
  UserList,
  UserEdit,
  UserNew,
  ArticleList,
  ArticleEdit,
  ArticleNew,
  Login,
  Search,
  Ka,
  Logoff,
  Error404,
} from '@/components/Views';

import store from '@/store';

Vue.use(Router);

const router = new Router({
  // changed historyApiFallback:true in webpack.base.conf in order to get mode:history to work.
  mode: 'history',
  routes: [{
    name: 'home',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Secure',
      breadcrumb: 'Home',
    },
    path: '/',
    component: Search,
  },
  {
    name: 'newuser',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Users',
      breadcrumb: 'New User',
    },
    path: '/users/new',
    component: UserNew,
  },
  {
    name: 'edituser',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Users',
      breadcrumb: 'Edit Users',
    },
    path: '/users/edit',
    component: UserList,
  },
  {
    name: 'edituserbyid',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Users',
      breadcrumb: 'Edit User',
    },
    path: '/users/edit/:id?',
    component: UserEdit,
  },
  {
    name: 'myaccount',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Users',
      breadcrumb: 'My Account',
    },
    path: '/users/myaccount',
    component: UserEdit,
  },
  {
    name: 'newarticle',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Articles',
      breadcrumb: 'New Article',
    },
    path: '/articles/new',
    component: ArticleNew,
  },
  {
    name: 'editarticle',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Articles',
      breadcrumb: 'Edit Articles',
    },
    path: '/articles/edit',
    component: ArticleList,
  },
  {
    name: 'editarticlebyid',
    meta: {
      requiresAuth: true,
      title: 'Search The Knowledge Base',
      area: 'Articles',
      breadcrumb: 'Edit Article',
    },
    path: '/articles/edit/:id',
    component: ArticleEdit,
  },
  {
    name: 'logoff',
    meta: {
      requiresAuth: true,
    },
    path: '/logoff',
    component: Logoff,
  },


  {
    name: 'welcome',
    meta: {
      requiresAuth: false,
      title: 'Search The Knowledge Base',
      area: 'To Attain Knowledge',
      breadcrumb: 'add things everyday',
    },
    path: '/welcome',
    component: Search,
  },
  {
    name: 'search',
    meta: {
      requiresAuth: false,
      title: 'Search The Knowledge Base',
      area: 'To Attain Knowledge',
      breadcrumb: 'add things everyday',
    },
    path: '/search/:keywords?',
    component: Search,
  },
  {
    name: 'ka',
    meta: {
      requiresAuth: false,
      title: 'Search The Knowledge Base',
      area: 'To Attain Knowledge',
      breadcrumb: 'add things everyday',
    },
    path: '/ka/:id',
    component: Ka,
  },
  {
    name: 'login',
    meta: {
      requiresAuth: false,
      title: 'Search The Knowledge Base',
      area: 'Public',
      breadcrumb: 'Login',
    },
    path: '/login',
    component: Login,
  },
  {
    path: '/404',
    component: Error404,
    meta: {
      requiresAuth: false,
      title: 'Search The Knowledge Base',
      area: 'Woops',
      breadcrumb: '404 Error',
    },
  },
  {
    path: '*',
    redirect: '/404',
  },
  ],
});

router.beforeEach((to, from, next) => {
  // if (!to.matched.length) {next('/notFound');}
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to landing page.
    if (!store.state.user || !store.state.user.isLoggedIn) {
      next({
        path: '/welcome',
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
