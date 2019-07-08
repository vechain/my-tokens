import Vue from 'vue'
import Router from 'vue-router'
import Wallets from './views/Wallets.vue'
import WalletDetail from './views/WalletDetail.vue'
import Transfer from './views/Transfer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'wallets' }
    },
    {
      path: '/wallets',
      name: 'wallets',
      meta: {
        key: 'wallets'
      },
      component: Wallets
    },
    {
      name: 'wallet-detail',
      path: '/wallet/detail/:id',
      meta: {
        key: 'wallets'
      },
      component: WalletDetail
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        key: 'transfer'
      },
      component: Transfer
    }
  ]
})
