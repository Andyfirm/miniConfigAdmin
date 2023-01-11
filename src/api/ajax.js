import axios from 'axios'
import Qs from 'qs'
import { MessageBox } from 'element-ui'
import config from '../configUrl.json'
import router from '../router/index'
const service = axios.create({
  timeout: 200000 // 请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // TODO
    let token = sessionStorage.getItem('token')
    //设置请求头
    if (token) {
      config.headers.token = token
      console.log(config.headers)
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // TODO
    if (res == -1 || res === '-1 访问失败!') {
      sessionStorage.removeItem('token')
      MessageBox.confirm('登录信息失效请重新登录', '登录超时', {
        confirmButtonText: '跳转登录页面',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear()
        sessionStorage.setItem("flag", 0)
        router.push("/login")
      })
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)
// 封装统一发送请求
// baseURL: 'http://192.168.1.31:8091/miniManagementSystem',
const ajax = (url, data, type, configOption) => {
  let defaultUrl = {
    baseURL: config.baseURL
  }
  if (configOption&&configOption.baseURL) {
    defaultUrl.baseURL = configOption.baseURL
  }
  
  if (type === 'post' || type === 'POST') {
    let defaultConfig = {
      baseURL: config.baseURL,
      data: Qs.stringify(data),
      url,
      method: 'post',
    }
    if (configOption) {
      if (configOption.baseURL) {
        defaultConfig.baseURL = configOption.baseURL
      }
      if (configOption.contentType) {
        defaultConfig.headers = {'Content-Type': configOption.contentType}
        defaultConfig.data = data
      }
    }
    return service(defaultConfig)
  } else {
    return service({
      baseURL: defaultUrl.baseURL,
      url,
      method: 'get',
      params: data
    })
  }
}
export default ajax
