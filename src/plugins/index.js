import Vue from 'vue'

// import Toastr
import Toastr from 'vue-toastr';
// import toastr less file: need webpack less-loader
//require('vue-toastr/src/vue-toastr.less');
import 'vue-toastr/dist/vue-toastr.min.css'

import VeeValidate from 'vee-validate';

// Register plugin
Vue.use(Toastr);
Vue.use(VeeValidate);