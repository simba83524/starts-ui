import Vue from 'vue'
import VueRouter from 'vue-router'

//解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: (resolve) => require(['../components/login/index'], resolve)
    }, {
        path: '/',
        component: (resolve) => require(['../views/Home'], resolve),
        children: []
    }
]

const router = new VueRouter({
    routes
})

export default router
