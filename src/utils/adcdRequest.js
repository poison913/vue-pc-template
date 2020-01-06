import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { sysConfig} from '@/json/sysConfig'

const mapBaseUrl=sysConfig().chartMapServiceUrl//获取政区空间服务的url
// 创建axios实例
const service2 = axios.create({
  baseURL: mapBaseUrl, // api 的 base_url
  timeout: 18000, // 请求超时时间
  headers: { 'Content-Type': 'application/json'},
  /* transformRequest: [function(obj) {
    var str = []
    for (var p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
    return str.join('&')
  }] */
})

// request拦截器
/* service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'form/data' // 让每个请求携带自定义token 请根据实际情况自行修改
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)*/
// response 拦截器
service2.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.success !== true) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service2
