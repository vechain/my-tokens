<template>
    <div class="wallet-detail">
        <a-row type="flex" justify="center">
            <a-col :xs="24">
                <a-row :gutter="{xs: 8, lg: 24}" type="flex" justify="space-around">
                    <a-col :xs="8" :lg="6">
                        <a-row>
                            <a-col>
                                <a-row type="flex" :gutter="8" justify="center" align="middle">
                                    <a-col :xs="6">
                                        <div
                                            style="width: 60px; height: 60px; margin: auto; border-radius: 30px; display: inline-block"
                                            v-picasso="wallet.address"
                                        ><a-icon v-if="!isOwn" type="eye"/></div>
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
                                        <span :title="wallet.name" v-show="!isEdit">{{wallet.name}}</span>
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
                            <a-col style="margin-top: 15px">
                                <a-card>
                                    <QRCode style="margin: auto" :content="checksumAddress"/>
                                </a-card>
                            </a-col>
                            <a-col style="padding-top: 20px">
                                <a-row
                                    type="flex"
                                    :gutter="8"
                                    justify="space-around"
                                    align="middle"
                                >
                                    <a-col :xs="18">
                                        <p
                                            ref="address"
                                            style="margin: 0"
                                            class="wallet-address text-monospace"
                                        >{{wallet.address | toChecksumAddress}}</p>
                                    </a-col>
                                    <a-col :xs="4">
                                        <a-tooltip :visible="showTip" placement="top">
                                            <template slot="title">
                                                <span>{{$t('wallets.copied')}}</span>
                                            </template>
                                            <a-button
                                                v-clipboard:copy="checksumAddress"
                                                v-clipboard:success="onCopy"
                                                shape="circle"
                                                icon="copy"
                                            />
                                        </a-tooltip>
                                    </a-col>
                                </a-row>
                                <a-row style="margin-top: 40px" type="flex" justify="space-around">
                                    <a-col>
                                        <a-button
                                            type="danger"
                                            @click="deleteWallet"
                                            ghost
                                        >{{$t('wallets.delete')}}</a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :xs="14" :lg="16">
                        <a-row type="flex" :gutter="8">
                            <a-col :xs="24" :lg="12" v-for="item in tokenlist" :key="item.symbol">
                                <TokenBalanceCard
                                    @click="toTransfer(item)"
                                    :item="item"
                                    style="margin-top: 10px"
                                    :class="{'not-allowed': !isOwn}"
                                />
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import TokenBalanceCard from '../components/TokenBalanceCard.vue'
import QRCode from '../components/QRCode.vue'
@Component({
    components: {
        TokenBalanceCard,
        QRCode
    }
})
export default class WalletDetail extends Vue {
    public qrcodeHtml?: string
    public name: string = ''
    public isEdit = false
    public showTip = false
    public isOwn = false

    @Watch('wallet')
    public walletChange(newVal: app.Wallet) {
        if (newVal) {
            this.name = newVal.name
        }
    }

    get checksumAddress() {
        return Vue.filter('toChecksumAddress')(this.wallet.address)
    }

    public created() {
        this.name = this.wallet.name
        this.isOwn = connex.vendor.owned(this.wallet.address)
    }

    get wallet(): app.Wallet {
        return this.$store.getters.wallets.find((item: app.Wallet) => {
            return item.address === this.$route.params.id
        })
    }

    get tokenlist() {
        return this.$store.getters.tokens.map((item: app.Token) => {
            return {
                ...item,
                balance: this.balances[item.symbol] || 0,
                img: require(`../assets/${item.icon}`)
            }
        })
    }
    public async deleteWallet() {
        this.$confirm({
            title: this.$tc('wallets.dlt_conf_msg'),
            onOk: async () => {
                await this.$store.dispatch('deleteWallet', { address: this.wallet.address })
                this.$router.push({ name: 'wallets' })
            }
        })
    }

    get balances() {
        if (this.$store.getters.balanceList && this.wallet && this.$store.getters.balanceList[this.wallet!.address]) {
            return this.$store.getters.balanceList[this.wallet!.address] || 0
        } else {
            return {}
        }
    }

    public toTransfer(item: app.Token) {
        if (!this.isOwn) {
            return
        }
        this.$router.push({
            name: 'transfer',
            query: {
                symbol: item.symbol.toLowerCase(),
                from: this.wallet.address
            }
        })
    }

    public async saveName() {
        this.isEdit = false
        await this.$store.dispatch('updateWallet', {
            address: this.wallet.address,
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

    public onCopy() {
        this.showTip = true
        setTimeout(() => {
            this.showTip = false
        }, 1000)
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

.wallet-name span {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 120px;
    text-overflow: ellipsis;
    /* word-break: break-all; */
    display: inline-block;
    float: left;
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
.not-allowed:hover {
    cursor: not-allowed;
}
</style>
