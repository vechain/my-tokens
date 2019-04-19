import Vue from 'vue'
import Store from './store'
import App from './App.vue'
import router from './router'

// tslint:disable-next-line:no-var-requires
const VueClipboard = require('vue-clipboard2')
import i18n from './i18n'
import './antd'
import './filters'
import './directives'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false

Vue.use(VueClipboard)

async function createApp() {
  await Store.initState()
  Store.monitorBlock()
  new Vue({
    i18n,
    router,
    store: Store,
    render: (h) => h(App)
  }).$mount('#app')
}
createApp()
