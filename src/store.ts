import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'

Vue.use(Vuex)

// tslint:disable-next-line:no-namespace
declare namespace Store {
  interface State {
    wallets?: app.Wallet[] | null
    tokens?: app.Token[]
  }
}

export default class Store extends Vuex.Store<Store.State> {
  constructor() {
    super({
      state: {
        wallets: null,
        tokens: []
      },
      mutations: {
        setWallets(state, payload) {
          state.wallets = payload
        },
        setTokens(state, payload) {
          state.tokens = payload
        },
        addWallet(state, payload) {
          state.wallets!.push(payload)
        }
      },
      getters: {
        wallets(state) {
          return state.wallets
        }
      },
      actions: {
        // async watchWallet({ commit }, addr) {
        //   try {
        //     const count = await DB.wallets.count()
        //     const temp = {
        //       name: `wallet${count}`,
        //       address: addr,
        //       own: false
        //     }
        //     await DB.wallets.add(temp)
        //     commit('addWallet', temp)
        //   } catch (error) {
        //     return ''
        //   }
        //   return addr
        // },
        async importWallet({ commit }, addr) {
          let result = addr
          try {
            let cert!: Connex.Vendor.SigningService.CertResponse
            if (!addr) {
              const svc = connex.vendor.sign('cert')

              cert = await svc.request({
                purpose: 'agreement',
                payload: {
                  type: 'text',
                  content: 'Choose wallet you want to add to "Token Transfer".'
                }
              })

              result = cert.annex.signer
            }

            const count = await DB.wallets.count()
            const temp = {
              name: `wallet${count}`,
              address: result,
              own: true
            }
            await DB.wallets.add(temp)
            commit('addWallet', temp)
          } catch (error) {
            return ''
          }

          return result
        }
      }
    })

    this.initState()
  }

  public async initState() {
    try {
      const wallets = await DB.wallets.toArray()
      this.commit('setWallets', wallets)
      // tslint:disable-next-line:no-empty
    } catch (error) {}
    this.commit('setTokens', [])
  }

  // public monitorDB() {
  //   DB.wallets.hook('creating', () => {
  //     // todo
  //   })
  //   DB.wallets.hook('deleting', () => {
  //     // todo
  //   })
  //   DB.wallets.hook('updating', () => {
  //     // todo
  //   })
  // }
}
