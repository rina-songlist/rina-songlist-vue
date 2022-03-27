import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆状态 true：已登陆，false：未登陆
    loginState: false,
    // 是否展示登陆窗口
    loginDialogVisible: false,
    // 当前用户
    currentUser: ''
  },
  mutations: {
    setLoginState(state, newState) {
      state.loginState = newState
      window.sessionStorage.setItem('state', newState)
    },
    setLoginDialogVisible(state, newState) {
      state.loginDialogVisible = newState
    },
    setCurrentUser(state, newUser) {
      state.currentUser = newUser
      window.sessionStorage.setItem('user', newUser)
    }
  },
  actions: {
  },
  modules: {
  }
})
