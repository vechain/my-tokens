import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'
import BigNumber from 'bignumber.js'

Vue.use(Vuex)

// tslint:disable-next-line:no-namespace
declare namespace Store {
  interface State {
    wallets?: app.Wallet[]
    tokens?: app.Token[]
    hideTokens: boolean
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
        hideTokens: true,
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
        deleteWallet(state, addr) {
          const index = state.wallets!.findIndex((item) => {
            return item.address === addr
          })
          state.wallets!.splice(index, 1)
          delete state.balances![addr]
        },
        addWallet(state, payload) {
          state.wallets!.push(payload)
        },
        updateWalletName(state, payload) {
          const index = state.wallets!.findIndex((item) => {
            return item.address === payload.address
          })
          Vue.set(state.wallets![index], 'name', payload.name)
        },
        netWork(state, payload) {
          state.netWork = payload
        },
        setBalance(state, payload) {
          if (!state.balances) {
            state.balances = {}
          }
          if (!state.balances[payload.address]) {
            Vue.set(state.balances, payload.address, {})
          }
          const temp = new BigNumber(payload.balance)
          const balance = temp.isGreaterThan(0)
            ? temp.div(new BigNumber('1e+' + payload.decimals)).toNumber()
            : 0

          Vue.set(state.balances![payload.address], payload.symbol, balance)
        }
      },
      getters: {
        isHide(state) {
          return state.hideTokens
        },
        wallets(state) {
          return state.wallets!.map((item) => {
            return {
              ...item
            }
          })
        },
        tokens(state) {
          return [
            {
              name: 'VeChain',
              symbol: 'VET',
              address: '',
              decimals: 18,
              icon: 'vet.png'
            }
          ].concat(state.tokens!)
        },
        balanceList(state) {
          return state.balances
        }
      },
      actions: {
        async addTransferLog(ctx, { txid, from, to, amount, coin }) {
          await DB.transfers.add({
            txid: txid.toLowerCase(),
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            amount,
            coin
          })
        },
        async deleteWallet({ commit }, payload) {
          try {
            await DB.wallets
              .where('address')
              .equalsIgnoreCase(payload.address)
              .delete()

            commit('deleteWallet', payload.address)
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error)
          }
        },
        async updateWallet({ commit }, payload) {
          try {
            await DB.wallets
              .where('address')
              .equalsIgnoreCase(payload.address)
              .modify({ name: payload.name })
            commit('updateWalletName', payload)
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error)
          }
        },
        async importWallet({ commit }, addr) {
          let result = addr
          try {
            let cert!: Connex.Vendor.SigningService.CertResponse
            if (!addr) {
              const svc = connex.vendor.sign('cert')

              cert = await svc.request({
                purpose: 'identification',
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
              address: (result as string).toLowerCase()
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
      window.connex &&
      window.connex.thor &&
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
    this.initTokenMethods()
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
