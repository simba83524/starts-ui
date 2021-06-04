import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HeyUI from "heyui"


require("heyui/themes/index.less")

Vue.use(HeyUI)
Vue.config.productionTip = false

//全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    console.log('即将进入主页面,开始加载菜单。。。');
  }
  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
