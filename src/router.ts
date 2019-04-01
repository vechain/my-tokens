import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'tokens' }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
    {
      path: '/tokens',
      name: 'tokens',
      meta: {
        key: 'tokens'
      },
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Tokens.vue')
    },
    {
      path: '/wallets',
      name: 'wallets',
      meta: {
        key: 'wallets'
      },
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Wallets.vue')
    },
    {
      name: 'wallet-detail',
      path: '/wallets/detail/:id',
      meta: {
        key: 'wallets'
      },
      component: () =>
        import(/* webpackChunkName: "about" */ './views/WalletDetail.vue')
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        key: 'transfer'
      },
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Transfer.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      meta: {
        key: 'contacts'
      },
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Contacts.vue')
    }
  ]
})
