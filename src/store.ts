import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokens: [
      'VTHO',
      'TIC',
      'SHA',
      'OCE',
    ]
  },
  mutations: {
    
  },
  actions: {
    async importWallet() {
      try {
        const result = await connex.vendor.sign('cert')
      } catch (error) {}
    }
  }
})
