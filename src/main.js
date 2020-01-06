import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/dcindex.css'
import "babel-polyfill"
import App from './App'
import router from './router'
import store from './store'

import echarts from '@/vendor/echarts'//全局挂载echarts

import '@/icons' // icon
import '@/permission' // permission control

import moment from 'moment'
import 'moment/locale/zh-cn';//只引入中文部分

/* import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome' */
import 'font-awesome/scss/font-awesome.scss';
import filters from "@/utils/filters.js";//过滤器全局
//全局挂载
for (let key in filters) {
  Vue.filter(key, filters[key]);
}

// Vue.use(ElementUI, { locale })

Vue.prototype.$moment = moment;//挂载到vue原型链上
moment.locale('zh-cn');//汉化moment

Vue.prototype.$echarts = echarts;

/* library.add(fas, far)
Vue.component('font-awesome-icon', FontAwesomeIcon) */

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
