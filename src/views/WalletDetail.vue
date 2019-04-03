<template>
    <div class="wallet-detail">
      
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class WalletDetail extends Vue {
    public wallet: app.Wallet | null = null

    public created() {
        const address = this.$route.params.id
        this.wallet = (this.$store.getters.wallets as app.Wallet[]).find((item) => {
            return item.address === address
        }) || null
        // if (this.wallet && this.wallet.own) {
        //     this.walletInfoCheck(address)
        // }
    }

    // public walletInfoCheck(addr: string) {
    //     if (!connex.vendor.owned(addr)) {
    //         this.$store.dispatch('walletOwnUpdate', {
    //             addr,
    //             isOwn: false
    //         })
    //     }
    // }
}
</script>
