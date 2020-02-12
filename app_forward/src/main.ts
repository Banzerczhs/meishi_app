import Vue from "vue";
import App from './App.vue'
import router from './router'
import {store} from './store'
import ElementUI from "element-ui";
import $ from "jquery";

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/iconfont.css';
import '@/assets/css/app.css';
import "@/assets/css/reset.css";

Vue.config.productionTip = false;
Vue.prototype.$jq=$;

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
