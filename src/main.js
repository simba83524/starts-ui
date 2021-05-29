import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HeyUI from "heyui"
require("heyui/themes/index.less")
import {loadmenus} from "@/api/menu";

Vue.use(HeyUI)
Vue.config.productionTip = false

//路由守卫
router.beforeEach((to, from, next) => {
  if(to.path == '/'){
    console.log('即将进入主页面,开始加载菜单。。。');
    loadmenus();
  }
  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
