import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'

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

export const asyncRouterRootMap = [
  {
    path: '',
    component: HomeView,
    meta: {
      icon: 'el-icon-setting',
      title: '数据源模块',
      roles: ['root'],
    },
    name: 'dataSource',
    hidden: false,
    children: [
      {
        path: '/rootAdmin/dataSource',
        meta: {
          icon: 'el-icon-s-data',
          title: '数据源配置信息',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/dataSource'),
        name: 'dataSource',
        hidden: false,
      },
      {
        path: '/paySet',
        meta: {
          icon: 'el-icon-coin',
          title: '支付设置',
          roles: ['root'],
        },
        component: () => import('@/views/paySet/paySet'),
        name: 'paySet',
        hidden: true,
      },
      {
        path: '/rootConfig',
        meta: {
          icon: 'el-icon-s-operation',
          title: '功能模块配置',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/rootConfig'),
        name: 'rootConfig',
        hidden: true,
        children: [],
      },
      {
        path: '/addNode',
        meta: {
          icon: 'el-icon-s-operation',
          title: '功能节点',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/addNode'),
        name: 'addNode',
        hidden: false,
        children: [],
      },
      {
        path: '',
        meta: {
          icon: 'el-icon-s-tools',
          title: '模板消息配置',
          roles: ['root'],
        },
        component: MainView,
        name: 'newConfig',
        hidden: false,
        children: [
          {
            path: '/newConfig',
            meta: {
              title: '会员模板消息',
              roles: ['root'],
            },
            component: () => import('@/views/configurable/newConfig'),
            name: 'newConfig',
            hidden: false,
            children: [],
          },
          {
            path: '/newEmployeeConfig',
            meta: {
              title: '员工模板消息',
              roles: ['root'],
            },
            component: () => import('@/views/configurable/newEmployeeConfig'),
            name: 'newEmployeeConfig',
            hidden: false,
            children: [],
          },
        ],
      }
    ],
  },
  {
    path: '',
    component: HomeView,
    meta: {
      icon: 'el-icon-user-solid',
      title: '用户角色管理',
      roles: ['root'],
    },
    name: 'addUser',
    hidden: false,
    children: [
      {
        path: '/addUser',
        meta: {
          icon: 'el-icon-user-solid',
          title: '用户管理',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/addUser'),
        name: 'addUser',
        hidden: false,
        children: [],
      },
      {
        path: '/roleModule',
        meta: {
          icon: 'el-icon-user',
          title: '角色管理',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/roleModule'),
        name: 'roleModule',
        hidden: false,
        children: [],
      },
    ],
  },
  {
    path: '',
    component: HomeView,
    meta: {
      icon: 'el-icon-message',
      title: '短信模块',
      roles: ['root'],
    },
    name: 'note',
    hidden: false,
    children: [
      {
        path: '/note',
        meta: {
          icon: 'el-icon-message',
          title: '短信管理',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/note'),
        name: 'note',
        hidden: false,
      },
    ],
  },
  {
    path: '',
    component: HomeView,
    meta: {
      icon: 'el-icon-s-grid',
      title: '菜单管理',
      roles: ['root'],
    },
    hidden: false,
    children: [
      {
        path: '/rootAdmin/menuList',
        meta: {
          icon: 'el-icon-s-grid',
          title: '菜单管理',
          roles: ['root'],
        },
        component: () => import('@/views/rootAdmin/rootmenuList'),
        name: 'menuList',
        hidden: false,
      },
    ]
  }
]

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

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap
})

export default router
