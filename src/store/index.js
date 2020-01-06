import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import mes from './modules/storeTry'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    user,
    mes
  },
  getters
})

export default store
