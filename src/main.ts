import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Store from './store'
import './i18n'
import './antd'
import './components'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false

new Vue({
  router,
  store: new Store(),
  render: (h) => h(App),
}).$mount('#app')
