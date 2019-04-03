import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'
import tokens from './tokens'

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
        }
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
          return state.wallets!.map((item) => {
            return {
              ...item
              // own: connex.vendor.owned(item.address)
            }
          })
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

  // public async monitorBlock() {
  //   const balanceOfABI = {
  //     constant: true,
  //     inputs: [
  //       {
  //         name: '_owner',
  //         type: 'address'
  //       }
  //     ],
  //     name: 'balanceOf',
  //     outputs: [
  //       {
  //         name: 'balance',
  //         type: 'uint256'
  //       }
  //     ],
  //     payable: false,
  //     stateMutability: 'view',
  //     type: 'function'
  //   }
  //   tokens.map(item => {
  //     const balanceOfMethod = connex.thor.account(item.address).method(balanceOfABI)
  //     return 
  //   })
    
  // }

  public async initState() {
    try {
      const wallets = await DB.wallets.toArray()
      this.commit('setWallets', wallets)
      // tslint:disable-next-line:no-empty
    } catch (error) {}
    this.commit('setTokens', tokens)
  }
}

export default new Store()
