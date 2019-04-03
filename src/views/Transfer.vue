<template>
    <a-row type="flex" justify="space-around">
        <a-col :xs="12">
            <h2>Transfer</h2>
            <a-form>
                <a-form-item label="From" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-select v-model="from">
                        <a-select-option
                            v-for="wallet in walletList"
                            :key="wallet.address"
                            :value="wallet.address"
                        >{{wallet.name}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="To" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input name="to"/>
                </a-form-item>
                <a-form-item label="Amount" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input name="amount"/>
                </a-form-item>
                <a-form-item>
                    <a-button>Send</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class Transfer extends Vue {
    private from: string = ''
    private to?: string | null = null
    private unit?: string

    get walletList(): app.Wallet[] {
        return this.$store.getters.wallets.filter((item: app.Wallet) => {
            return item.own
        })
    }

    get tokenList(): app.Token[] {
        return this.$store.getters.tokens
    }

    public created() {
        this.initForm()
    }

    public initForm() {
        const wallet = this.walletList.find((item) => {
            return item.address === this.$route.query.from
        })
        const unit = this.tokenList.find((item) => {
            return item.symbol === this.$route.query.symbol
        })

        this.from = wallet && wallet.address || ''
        this.unit = unit && unit.symbol || 'VET'
    }
}
</script>
