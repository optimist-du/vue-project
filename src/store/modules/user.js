import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {asyncRoutes, constantRoutes} from '@/router'
import router from '@/router'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    routes: [],
    user: undefined,
    permissionRoutes: [],
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
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ROUTES: (state, routes) => {
      state.routes = constantRoutes.concat(routes)
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_PERMISSION_ROUTES: (state, routes) => {
      state.permissionRoutes = routes
    }
  },

  actions: {
    // 登录
    login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          localStorage.setItem("userid", res.data.id)
          localStorage.setItem("userType", res.data.userType)
          localStorage.setItem("enterpriseId",res.data?res.data.enterpriseId:"")
          commit('SET_AVATAR', res.data.avatar);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_USER', res.data)
          commit('SET_AVATAR', res.data.avatar);
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限路由
    generateRoutes({ commit }, user) {
      return new Promise(resolve => {
        let accessedRoutes
        if (user.userType == 0) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, user.resourceList)
        }
        commit('SET_PERMISSION_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    
    // 退出系统
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          localStorage.removeItem("userid");
          localStorage.removeItem("userType");
          localStorage.removeItem("enterpriseId");
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export function filterAsyncRoutes(routes, resourceList) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(resourceList, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, resourceList)
      }
      res.push(tmp)
    }
  })

  return res
}

function hasPermission(resourceList, route) {
  if (route.meta && route.meta.permission) {
    return resourceList.some(resource => route.meta.permission===resource.permission)
  } else {
    return true
  }
}

export default user
