<template>
    <div class="wallet-detail">
        <a-row type="flex">
            <a-col :xs="8">
                <QRCode :content="wallet.address" :size="100"/>
            </a-col>
            <a-col :xs="16">
                <a-card >
                    <TokenBalanceCard style="margin-top: 10px" :item="item" v-for="item in tokenlist" :key="item.symbol"/>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class WalletDetail extends Vue {
    public wallet: app.Wallet | null = null
    public qrcodeHtml?: string

    public created() {
        const address = this.$route.params.id
        this.wallet = (this.$store.getters.wallets as app.Wallet[]).find((item) => {
            return item.address === address
        }) || null
    }

    get tokenlist() {
        return this.$store.getters.tokens.map((item: app.Token) => {
            return {
                ...item,
                balance: this.balances[item.symbol],
                img: require(`../assets/${item.icon}`)
            }
        })
    }
    get balances() {
        if (this.$store.getters.balanceList && this.wallet && this.$store.getters.balanceList[this.wallet!.address]) {
            return this.$store.getters.balanceList[this.wallet!.address]
        } else {
            return {}
        }
    }
}
</script>
<style>
.wallet-detail {
    max-width: 1080px;
    margin: auto;
}
</style>
