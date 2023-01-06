import { constantRouterMap, asyncRouterRootMap } from '../../router'
import { getMenue } from '../../api/index'
import router from '@/router'
import Home from '../../views/HomeView.vue'
import Main from '../../views/MainView.vue'

export function generaMenu(routers, data) {
  if (!data) return
  data.forEach(item => {
    let menu = null
    if (item.component === 'Home') {
      menu = {
        path: item.path,
        component: Home,
        hidden: item.hidden === 'false' ? false : true,
        children: [],
        name: item.name,
        meta: { title: item.title, icon: item.icon, roles: ['common'] }
      }
    } else if (item.component == 'Main') {
      menu = {
        path: item.path,
        component: Main,
        hidden: item.hidden == 'false' ? false : true,
        children: [],
        name: item.name,
        meta: { title: item.title, icon: item.icon, roles: ['common'] }
      }
    } else {
      menu = {
        path: item.path,
        component: (resolve) => require([`@/views${item.path}`], resolve),
        hidden: item.hidden == 'false' ? false : true,
        children: [],
        name: item.name,
        meta: { title: item.title, icon: item.icon, roles: ['common'] }
      }
    }
    if (item.children !== null) {
      generaMenu(menu.children, item.children)
    }
    routers.push(menu)
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      router.addRoutes(state.routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        if (!data.roles.includes('root')) {
          if (sessionStorage.getItem('menuList')) {
            let menuList = JSON.parse(sessionStorage.getItem('menuList'))
            let routers = []
            generaMenu(routers, menuList)
            commit('SET_ROUTERS', routers)
            resolve()
          } else {
            getMenue().then(res => {
              if (res.msg === 'success') {
                sessionStorage.setItem('menuList', JSON.stringify(res.data.children))
                let routers = []
                generaMenu(routers, res.data.children)
                commit('SET_ROUTERS', routers)
                resolve()
              } else {
                resolve()
              }
            })
          }
        } else {
          let accessedRouters
          accessedRouters = asyncRouterRootMap || []
          let { roles } = data
          accessedRouters = filterAsyncRouter(asyncRouterRootMap, roles)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }
      })
    }
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param roles
 */
 function filterAsyncRouter(asyncRouterRootMap, roles) {
  const accessedRouters = asyncRouterRootMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
 function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
      return true
  }
}

export default permission
