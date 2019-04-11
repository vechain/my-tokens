import Vue from 'vue'
import NavBar from './NavBar.vue'
import TokenCard from './TokenCard.vue'
import TokenBalanceCard from './TokenBalanceCard.vue'
import WalletCard from './WalletCard.vue'
import QRCode from './QRCode.vue'

Vue.component(NavBar.name, NavBar)
Vue.component(TokenCard.name, TokenCard)
// tslint:disable-next-line:no-console
console.log(TokenBalanceCard.name)
Vue.component(TokenBalanceCard.name, TokenBalanceCard)
Vue.component(WalletCard.name, WalletCard)
Vue.component(QRCode.name, QRCode)
