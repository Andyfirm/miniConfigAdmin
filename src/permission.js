import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

NProgress.configure({ showSpinner: false })// NProgress Configuration
const whiteList = ['/login'] // 不重定向白名单
let flag = 0
router.beforeEach(async (to, from, next) => {
  let sessionFlag = sessionStorage.getItem('flag')
  if (sessionFlag && sessionFlag!=='null') {
    flag = sessionFlag
  }
  NProgress.start() // start progress bar
  let token = sessionStorage.getItem('token')
  if(token) {
    if (flag == 0) {
      const roles = [JSON.parse(sessionStorage.getItem('userinfo')).role]
      await store.dispatch('GenerateRoutes', { roles }) // 根据roles权限生成可访问的路由表
      router.addRoutes(store.getters.permission_routers) // 动态添加可访问路由表
      flag++
      next({ ...to, replace: true })
    }
    else {
      next()
    }
  } else if (to.name === 'login' && !token) {
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})