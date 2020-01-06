import { login, logout, getInfo, singleLogin } from '@/api/login'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo, setUserInfo7 } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_INFO7: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      //debugger
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          console.log(66666, response)
          let data = response.message;//根据业务改为message
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          if (userInfo.isSevenDays) {
            //7天有效期存入用户名和密码
            /* 此时判断一下cookie里是否存在cookie的有效期，如果没有则赋新的值，如果有则使用旧的值，保证勾选的日期能够生效 */
            const hasUserInfo = getUserInfo();
            //debugger
            if (hasUserInfo) {
              //此时cookie里保存过userInfo
              if (hasUserInfo.expires) {
                data.userInfo.expires = hasUserInfo.expires;//使用存入的值
              } else {
                let newDate = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000);
                data.userInfo.expires = newDate;//传入新的值
              }
            } else {
              let newDate = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000);
              data.userInfo.expires = newDate;//传入新的值
            }
            commit('SET_INFO7', data.userInfo)
            setUserInfo7(data.userInfo)
            //document.cookie="userInfo="+JSON.stringify(data.userInfo)+";expires="+data.userInfo.expires.toGMTString();
          } else {
            //debugger
            commit('SET_INFO', data.userInfo)
            setUserInfo(data.userInfo)//存入用户信息
          }
          resolve(data.token)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //单点登录
    SingleLogin({ commit }, singleLoginObj) {
      //debugger
      return new Promise((resolve, reject) => {
        singleLogin(singleLoginObj).then(response => {
          //debugger
          let data = response.message;//根据业务改为message
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          data.userInfo.PLATFORM_NAME = data.platform.PLATFORM_NAME;//平台名称
          data.userInfo.RELATIVE_URL = data.platform.RELATIVE_URL;//定制大屏的地址
          data.userInfo.LONGITUDE = data.platform.LONGITUDE;
          data.userInfo.LATITUDE = data.platform.LATITUDE;//经纬度信息
          data.userInfo.baseFileUrl = data.baseFileUrl;
          data.userInfo.baseApiUrl = data.baseApiUrl;
          data.userInfo.cookiePath = data.cookieUrl.split(':')[2];//cookie作用端口
          //debugger
          commit('SET_INFO', data.userInfo);
          setUserInfo(data.userInfo);//存入用户信息
          resolve(data.token);
        }).catch(err => {
          reject(err);
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        let userInfos = getUserInfo();
        if (userInfos) {
          resolve(userInfos);
        } else {
          reject('error');
        }
        /* getUserInfo().then(response => {
          resolve(response)
          commit('SET_INFO', response)
        }).catch(error => {
          reject(error)
        }) */
        /* getInfo(state.token).then(response => {
          const data = response.message;//根据业务改为message
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        }) */
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', {})
          commit('SET_ROLES', [])
          removeToken()
          removeUserInfo()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        // let isSevenDays = getUserInfo().isSevenDays;
        if (true) {
          commit('SET_TOKEN', '')
          removeToken()//只删除token信息
          localStorage.removeItem('indexID');
          localStorage.removeItem('userModule');
        } else {
          commit('SET_TOKEN', '')
          commit('SET_INFO', {})
          removeToken()
          removeUserInfo()
          localStorage.removeItem('indexID');
          localStorage.removeItem('userModule');
        }
        resolve()
      })
    },
    //免登录登出
    SingleFedLogOut({ commit }) {
      return new Promise(resolve => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', {})
          removeToken()
          removeUserInfo()
          localStorage.removeItem('indexID');
          localStorage.removeItem('userModule');
        resolve()
      })
    }
  }
}


export default user
