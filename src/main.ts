import 'ant-design-vue/dist/antd.css'
import './style.css'
import Vue from 'vue'
import Store from './store'
import App from './App.vue'
import router from './router'
import VueAnalytics from 'vue-analytics'

// tslint:disable-next-line:no-var-requires
const VueClipboard = require('vue-clipboard2')
import i18n from './i18n'
import './antd'
import './filters'
import './directives'
Vue.config.productionTip = false

Vue.use(VueClipboard)
Vue.use(VueAnalytics, {
  id: 'UA-132391998-2',
  disabled: process.env.NODE_ENV !== 'production'
})

async function createApp() {
  Store.getPrice()
  await Store.initState()
  if (window.connex) {
    Store.monitorBlock()
  }
  new Vue({
    i18n,
    router,
    store: Store,
    render: (h) => h(App)
  }).$mount('#app')
}
createApp()
