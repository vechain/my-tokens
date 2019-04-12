<template>
    <div class="wallet-detail">
        <a-row type="flex" justify="center">
            <a-col>
                <a-row :gutter="{xs: 8, lg: 24}" type="flex" justify="space-around">
                    <a-col :xs="8" :lg="6">
                        <a-row>
                            <a-col>
                                <a-row type="flex" :gutter="8" justify="center" align="middle">
                                    <a-col :xs="6">
                                        <div
                                            style="width: 50px; height: 50px; margin: auto; border-radius: 25px; display: inline-block"
                                            v-picasso="wallet.address"
                                        ></div>
                                    </a-col>
                                    <a-col :xs="15" class="wallet-name">
                                        <a-input
                                            v-show="isEdit"
                                            size="large"
                                            ref="input"
                                            @keypress.enter="saveName"
                                            @blur="isEdit=false"
                                            v-model="name"
                                        ></a-input>
                                        <span v-show="!isEdit">{{wallet.name}}</span>
                                        <a-button
                                            v-show="!isEdit"
                                            style="margin-left: 20px"
                                            shape="circle"
                                            icon="edit"
                                            @click="showEdit"
                                        />
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col style="margin-top: 30px">
                                <a-card>
                                    <QRCode
                                        style="margin: auto"
                                        :content="wallet.address"
                                        :size="220"
                                    />
                                </a-card>
                            </a-col>
                            <a-col>
                                <a-row
                                    type="flex"
                                    :gutter="8"
                                    justify="space-around"
                                    align="middle"
                                >
                                    <a-col :xs="18">
                                        <p ref="address" class="wallet-address">{{wallet.address}}</p>
                                    </a-col>
                                    <a-col :xs="4">
                                        <a-button @click="copy" shape="circle" icon="copy"/>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :xs="14" :lg="16">
                        <!-- <a-card class="token-balance-list"> -->
                        <a-row type="flex" :gutter="8">
                            <a-col :xs="24" :lg="12" v-for="item in tokenlist" :key="item.symbol">
                                <TokenBalanceCard :item="item" style="margin-top: 10px"/>
                            </a-col>
                        </a-row>
                        <!-- </a-card> -->
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class WalletDetail extends Vue {
    // public wallet: app.Wallet | null = null
    public qrcodeHtml?: string
    public name: string = ''
    public isEdit = false

    @Watch('wallet')
    public walletChange(newVal: app.Wallet) {
        this.name = newVal.name
    }

    public created() {
        this.name = this.wallet.name
    }

    get wallet() {
        return this.$store.getters.wallets.find((item: app.Wallet) => {
            return item.address === this.$route.params.id
        })
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

    public async saveName() {
        this.isEdit = false
        await this.$store.dispatch('updateWallet', {
            address: this.wallet!.address,
            name: this.name
        })
    }

    public showEdit() {
        this.isEdit = true
        const ele = this.$refs.input as HTMLInputElement
        this.$nextTick(() => {
            ele.focus()
            ele.select()
        })
    }

    public copy() {
        // (this.$refs['address'] as HTMLParagraphElement).select()
    }
}
</script>
<style>
.wallet-detail {
    max-width: 1200px;
    margin: auto;
    margin-top: 40px;
}

.token-balance-list {
    border-radius: 5px;
}
.wallet-name {
    text-align: left;
    font-size: 20px;
}
.wallet-address {
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
}
</style>
