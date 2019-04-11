import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'
// import { mainNetTokens } from './tokens'
import BigNumber from 'bignumber.js'

Vue.use(Vuex)

// tslint:disable-next-line:no-namespace
declare namespace Store {
  interface State {
    wallets?: app.Wallet[]
    tokens?: app.Token[]
    netWork: 'main' | 'test' | null
    balances: {
      [address: string]: {
        [symbol: string]: number
      }
    } | null
  }
  interface TokenMethod {
    symbol: string
    decimals: number
    balanceOf(addr: string): Promise<Connex.Thor.VMOutput>
  }
}

class Store extends Vuex.Store<Store.State> {
  private balanceOfABI = {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
  private tokenMethods: Store.TokenMethod[] | null = null

  constructor() {
    super({
      state: {
        netWork: null,
        wallets: [],
        tokens: [],
        balances: null
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
        netWork(state, payload) {
          state.netWork = payload
        },
        setBalance(state, payload) {
          if (!state.balances) {
            state.balances = {}
          }
          if (!state.balances[payload.address]) {
            state.balances[payload.address] = {}
          }
          const temp = new BigNumber(payload.balance)
          const balance = temp.isGreaterThan(0)
            ? temp.div(new BigNumber('1e+' + payload.decimals)).toNumber()
            : 0
          state.balances[payload.address][payload.symbol] = balance
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
        async walletOwnUpdate({ commit }, { addr, isOwn }) {
          try {
            await DB.wallets
              .where('address')
              .equals(addr)
              .modify({ own: isOwn })
            // tslint:disable-next-line:no-empty
          } catch (error) {}
          commit('updateWallet', { addr, isOwn })
        },
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
    this.initTokenMethods()
  }

  public async monitorBlock() {
    const tick = connex.thor.ticker()
    for (;;) {
      await tick.next()
      this.getTokenBalance()
      this.getBalance()
    }
  }

  public async initState() {
    if (
      connex.thor.genesis.id ===
      '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
    ) {
      this.commit('netWork', 'main')
      this.commit('setTokens', require('./tokens').mainNetTokens)
    } else {
      this.commit('netWork', 'test')
      this.commit('setTokens', require('./tokens').testNetTokens)
    }
    try {
      const wallets = await DB.wallets.toArray()
      this.commit('setWallets', wallets)
    // tslint:disable-next-line:no-empty
    } catch (error) {}
  }

  private async getBalance() {
    this.state.wallets!.forEach(async (item) => {
      const info = await connex.thor.account(item.address).get()
      this.commit('setBalance', {
        address: item.address,
        symbol: 'VET',
        balance: info.balance,
        decimals: 18
      })
    })
  }

  private getTokenBalance() {
    this.tokenMethods!.forEach(async (item) => {
      this.state.wallets!.forEach(async (wallet) => {
        const result = await item.balanceOf(wallet.address)
        this.commit('setBalance', {
          address: wallet.address,
          symbol: item.symbol,
          balance: result.decoded!.balance,
          decimals: item.decimals
        })
      })
    })
  }

  private initTokenMethods() {
    this.tokenMethods = this.state.tokens!.map((item) => {
      return {
        balanceOf: (addr: string) => {
          return connex.thor
            .account(item.address)
            .method(this.balanceOfABI)
            .cache([addr])
            .call(addr)
        },
        symbol: item.symbol,
        decimals: item.decimals
      }
    })
  }
}

export default new Store()
