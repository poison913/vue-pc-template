import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// 大屏
import bigScreen from '../views/layout/bigScreen'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // 模块路由     
  //免登录页
  {
    path: '/singleLogin',
    component: () => import('@/views/login/singleLogin'),
    hidden: true
  },
  {
    path: '/',//首页
    component: Layout,
    id: '1',
    name: '首页',
    parentName: '省级首页',
    redirect: '/homePage',
    children: [{
      path: 'homePage',
      name: '首页',
      component: () => import('@/views/homePage/homePage'),
      meta: { title: '首页', icon: 'form', powerCode: 'XA0000' }
    }]
  },

  /* 县级路由配置 */
  {
    path: '/',//首页
    component: Layout,
    id: '7',
    name: '首页',
    redirect: '/supHomePage',
    children: [{
      path: 'supHomePage',
      name: '首页',
      component: () => import('@/views/homePage/supHomePage'),
      meta: { title: '首页', icon: 'form', powerCode: 'A0000' }
    }]
  },
  {
    path: '/monitor',//监测监控
    component: Layout,
    icon: 'tint',
    name: ' 二级菜单',
    redirect: '/monitor/supWaterMonitor',
    children: [{
      path: 'supWaterMonitor',
      name: '二级菜单',
      icon: 'water',
      component: () => import('@/views/supMonitor/supWaterMonitor'),
      meta: { title: '水质监测', icon: 'form', powerCode: 'B1001' }
    }]
  },
  {
    path: '/monitor',//监测监控
    component: Layout,
    icon: 'video-camera',
    name: '二级菜单',
    redirect: '/monitor/supVideoMonitor',
    children: [{
      path: 'supVideoMonitor',
      name: '二级菜单',
      icon: 'video-camera',
      component: () => import('@/views/supMonitor/supVideoMonitor'),
      meta: { title: '视频监测', icon: 'form', powerCode: 'B1002' }
    }]
  },
  {
    path: '/',//首页
    component: bigScreen,
    name: '首页',
    redirect: '/supBigScreen',
    children: [{
      path: 'supBigScreen',
      name: '首页',
      component: () => import('@/views/bigScreen/supBigScreen'),
      meta: { title: '首页', icon: 'form', powerCode: 'A0000' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
