import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

export const constantRouterMap = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    hidden: true,
    children: [
      {
        path: '/',
        name: 'commonHome',
        hidden: true,
        component: () => import(/* webpackChunkName: "commonHome" */ '../views/commonHome/commonHome.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  }
]

export const asyncRouterRootMap = [

]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap
})

export default router
