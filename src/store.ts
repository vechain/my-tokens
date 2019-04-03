import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'

Vue.use(Vuex)

// tslint:disable-next-line:no-namespace
declare namespace Store {
  interface State {
    wallets?: app.Wallet[]
    tokens?: app.Token[]
  }
}

class Store extends Vuex.Store<Store.State> {
  constructor() {
    super({
      state: {
        wallets: [],
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
        },
        // updateWallet(state, payload) {
        //   const index = state.wallets!.findIndex((item) => {
        //     return item.address === payload.address
        //   })
        //   if (index) {
        //     Vue.set(state.wallets![index], 'own', payload.isOwn)
        //   }
        // }
      },
      getters: {
        wallets(state) {
          return state.wallets
        },
        tokens(state) {
          return state.tokens
        }
      },
      actions: {
        // async walletOwnUpdate({ commit }, { addr, isOwn }) {
        //   try {
        //     await DB.wallets
        //       .where('address')
        //       .equals(addr)
        //       .modify({ own: isOwn })
        //     // tslint:disable-next-line:no-empty
        //   } catch (error) {}

        //   commit('updateWallet', { addr, isOwn })
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
  }

  public async initState() {
    try {
      const wallets = await DB.wallets.toArray()
      this.commit('setWallets', wallets)
      // tslint:disable-next-line:no-empty
    } catch (error) {}
    this.commit('setTokens', [
      {
        name: 'Yeet Coin',
        symbol: 'YEET',
        address: '0xae4c53b120cba91a44832f875107cbc8fbee185c',
        decimals: 18,
        icon: 'yeet.png'
      },
      {
        name: 'TicTalk Token',
        symbol: 'TIC',
        address: '0xa94a33f776073423e163088a5078feac31373990',
        decimals: 18,
        icon: 'tic.png'
      },
      {
        name: 'OceanEx Token',
        symbol: 'OCE',
        address: '0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14',
        decimals: 18,
        icon: 'oce.png'
      },
      {
        name: 'VeThor',
        symbol: 'VTHO',
        address: '0x0000000000000000000000000000456e65726779',
        decimals: 18,
        icon: 'vtho.png'
      },
      {
        name: 'Plair',
        symbol: 'PLA',
        address: '0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f',
        decimals: 18,
        icon: 'pla.png'
      },
      {
        name: 'Safe Haven Token',
        symbol: 'SHA',
        address: '0x5db3c8a942333f6468176a870db36eef120a34dc',
        decimals: 18,
        icon: 'sha.png'
      },
      {
        name: 'Decent.bet Token',
        symbol: 'DBET',
        address: '0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8',
        decimals: 18,
        icon: 'dbet.png'
      },
      {
        name: 'Bitarora Token',
        symbol: 'BAG',
        address: '0x2182aa52adB1b27903d089e4432538A695effE3d',
        decimals: 18,
        icon: 'bag.png'
      }
    ])
  }
}

export default new Store()
