import Vue from 'vue'
import Store from './store'
import App from './App.vue'
import router from './router'
import './i18n'
import './antd'
import './components'
import './filters'
import './directives'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false

async function createApp() {
  await Store.initState()
  Store.monitorBlock()
  new Vue({
    router,
    store: Store,
    render: (h) => h(App)
  }).$mount('#app')
}
createApp()
