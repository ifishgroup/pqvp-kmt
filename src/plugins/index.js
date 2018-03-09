import Vue from 'vue';

// import Toastr
import Toastr from 'vue-toastr';
// import toastr less file: need webpack less-loader
// require('vue-toastr/src/vue-toastr.less');
import 'vue-toastr/dist/vue-toastr.min.css';

import VeeValidate from 'vee-validate';

import LiquorTree from 'liquor-tree';

const SocialSharing = require('vue-social-sharing');

// Register plugin
Vue.use(Toastr);
Vue.use(VeeValidate);
Vue.use(LiquorTree);
Vue.use(SocialSharing);

