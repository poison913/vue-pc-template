import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { sysConfig} from '@/json/sysConfig'

const baseUrl=sysConfig().ServiceUrl//获取配置的服务url
// 创建axios实例
const service = axios.create({
        baseURL: baseUrl+'api/', // api 的 base_url
        timeout: 18000, // 请求超时时间
        headers: { 'Content-Type': 'application/json' },
        /* transformRequest: [function(obj) {
          var str = []
          for (var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          }
          return str.join('&')
        }] */
    })
    // request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

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
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.status !== 0) {
            /* Message({
              message: res.errmsg,
              type: 'error',
              duration: 5 * 1000
            }) */

            if (res.status === 402001) {
                Message({
                    message: '用户不存在',
                    type: 'error'
                });
            } else if (res.status === 402002) {
                Message({
                    message: '密码不正确',
                    type: 'error'
                });
            } else if (res.status === 402003) {
                Message({
                    message: '用户名或密码不正确',
                    type: 'error'
                });
            }else{
                Message({
                    message: res.errmsg,
                    type: 'error'
                });
            }
            return Promise.reject(response.data.errmsg)
        } else {
            //debugger
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        let res = error.response.data
        if (res.status === 401001) {
            MessageBox.confirm(
                '登录时间已超时，请重新登录！',
                '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'error'
                }
            ).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            })
        }
        Message({
            message: error.errmsg,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
