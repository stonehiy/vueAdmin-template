import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'

const user = {
  state: {
    /****token****/
    access_token: getToken(),
    token_type: 'Bearer',
    refresh_token: '',
    expires_in: 0,
    scope: 'ui',

    /*******user********/
    username: '',//登录名
    status: 1,//状态: 1-可用，0-禁用，-1-锁定
    phoneNumber:'',//手机号
    email:'',//邮箱
    name:'',//用户名
    resources:[],//资源
    roles: [],//角色
    enabled: true,//是否可用
    authorities:[],//{"authority": "admin"}
    avatar: '',//头像
    type:'',
  },

  mutations: {
    SET_TOKEN: (state, access_token) => {
      state.access_token = access_token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      let username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          let date = response.data
            setToken(date.access_token)
            commit('SET_TOKEN', date.access_token)
            resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 获取用户信息
    GetInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          let data = response.data
        let userAuthentication = data.roles
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
        })
      })
    },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.access_token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
