import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'wallets' }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
    // {
    //   path: '/tokens',
    //   name: 'tokens',
    //   meta: {
    //     key: 'tokens'
    //   },
    //   component: () =>
    //     import('./views/Tokens.vue')
    // },
    {
      path: '/wallets',
      name: 'wallets',
      meta: {
        key: 'wallets'
      },
      component: () =>
        import('./views/Wallets.vue')
    },
    {
      name: 'wallet-detail',
      path: '/wallet/detail/:id',
      meta: {
        key: 'wallets'
      },
      component: () =>
        import('./views/WalletDetail.vue')
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        key: 'transfer'
      },
      component: () =>
        import('./views/Transfer.vue')
    },
    // {
    //   path: '/contacts',
    //   name: 'contacts',
    //   meta: {
    //     key: 'contacts'
    //   },
    //   component: () =>
    //     import('./views/Contacts.vue')
    // }
  ]
})
