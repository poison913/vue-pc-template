import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getUserInfo } from '@/utils/auth' // 验权
import { judgeAuth } from '@/mixins/common';
const whiteList = ['/login', '/singleLogin'] // 不重定向白名单登录页和免登录页
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/singleLogin') {
    next()
    NProgress.done()
  } else {
    if (getToken()) {
      //debugger
      if (to.path === '/login') {
        next()
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      } else {
        //debugger
        //根据router表里的meta里存的powerCode信息去匹配用户的权限
        let auth = [];
        if (to.meta.powerCode) {
          auth = judgeAuth(to.meta.powerCode);
        }
        if (auth) {
          to.meta.auth = auth;
          next()
        } else {
          next({ path: '/login' });//如果auth为false,localstorage里没有储存，跳到登录页
        }
        NProgress.done()
        /* if (store.getters.roles.length === 0) {
          store.dispatch('GetInfo').then(res => { // 拉取用户信息
            next()
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
        } else {
          next()
        } */
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
        NProgress.done()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  }

})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
