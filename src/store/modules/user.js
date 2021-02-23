import { http } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    token: '',
    session_key: '',
  },
  mutations: {
    setSessionKey(state, key) {
      state.session_key = key
    }
  },
  actions:{
    getSessionKey({commit, state}) {
      return new Promise( async (resolve, reject) => {
        if (state.session_key) {
          try {
            await wx.checkSession()
            resolve(state.session_key)
          } catch(e) {
            console.log('session_key过期')
            let { code } = await wx.login()
            let { session_key } = await http('auth/code', { code }, 'get')
            console.log(session_key)
            commit('setSessionKey', session_key)
            resolve(session_key)
          }
        } else {
          let { code } = await wx.login()
          let { session_key } = await http('auth/code', { code }, 'get')
          console.log(session_key)
          commit('setSessionKey', session_key)
          resolve(session_key)
        }
      })
      
    }
  }
}