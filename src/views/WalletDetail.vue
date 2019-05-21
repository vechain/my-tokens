<template>
    <div class="wallet-detail">
        <a-row type="flex" justify="center">
            <a-col :xs="24">
                <a-row :gutter="{xs: 8, lg: 24}" type="flex" justify="space-around">
                    <a-col :xs="8" :lg="6">
                        <a-row>
                            <a-col>
                                <a-row type="flex" :gutter="8" justify="center" align="middle">
                                    <a-col :xs="24">
                                        <div class="wallet-icon" v-picasso="wallet.address">
                                            <span v-if="true">{{$t('wallets.observe')}}</span>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col>
                                <a-row type="flex" align="middle">
                                    <a-col :xs="16" class="wallet-name">
                                        <a-input
                                            v-show="isEdit"
                                            size="large"
                                            ref="input"
                                            maxlength="20"
                                            @keypress.enter="saveName"
                                            @blur="isEdit=false;name=wallet.name"
                                            v-model="name"
                                        ></a-input>
                                        <span :title="wallet.name" v-show="!isEdit">{{wallet.name}}</span>
                                    </a-col>
                                    <a-col :xs="5">
                                        <a-button
                                            v-show="!isEdit"
                                            style="margin-left: 20px"
                                            shape="circle"
                                            icon="edit"
                                            @click="showEdit"
                                            ghost
                                        />
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col style="padding-top: 20px">
                                <a-row type="flex" :gutter="8" align="middle">
                                    <a-col :xs="16">
                                        <p
                                            ref="address"
                                            class="wallet-address text-monospace"
                                        >{{wallet.address | toChecksumAddress | shortAddress}}</p>
                                    </a-col>
                                    <a-col :xs="8">
                                        <a-tooltip :visible="showTip" placement="top">
                                            <template slot="title">
                                                <span>{{$t('wallets.copied')}}</span>
                                            </template>
                                            <a-button
                                                v-clipboard:copy="checksumAddress"
                                                v-clipboard:success="onCopy"
                                                shape="circle"
                                                icon="copy"
                                                ghost
                                            />
                                        </a-tooltip>
                                        <a-button
                                            style=" margin-left: 10px;"
                                            shape="circle"
                                            icon="qrcode"
                                            @click="visible=true"
                                            ghost
                                        />
                                    </a-col>
                                </a-row>
                                <a-row style="margin-top: 30px" type="flex" justify="space-around">
                                    <a-col>
                                        <a-button
                                            type="danger"
                                            class="cus-btn"
                                            style="color: #D58693;"
                                            @click="deleteWallet"
                                        >{{$t('wallets.delete')}}</a-button>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :xs="14" :lg="16">
                        <a-row type="flex" justify="end">
                            <a-col>
                                <a-switch :defaultChecked="true" @change="onHideChange"/>
                            </a-col>
                            <a-col
                                style="color: #fff; font-size: 18px; padding-left: 15px;"
                            >{{$t('wallets.hide_amount')}}</a-col>
                        </a-row>
                        <a-row type="flex" :gutter="8" justify="space-between">
                            <template v-for="item in tokenlist">
                                <a-col
                                    style="margin-top: 25px"
                                    :xs="24"
                                    :lg="11"
                                    v-if="item.show"
                                    :key="item.symbol"
                                >
                                    <TokenBalanceCard
                                        @click="toTransfer(item)"
                                        :item="item"
                                        style="margin-top: 10px"
                                        :class="{'not-allowed': !isOwn}"
                                    />
                                </a-col>
                            </template>
                        </a-row>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-modal v-model="visible" :footer="null">
            <QRCode style="margin: auto" :content="checksumAddress"/>
        </a-modal>
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
    public visible = false

    @Watch('wallet')
    public walletChange(newVal: app.Wallet) {
        if (newVal) {
            this.name = newVal.name
        }
    }

    get checksumAddress() {
        return Vue.filter('toChecksumAddress')(this.wallet.address)
    }

    get hide() {
        return this.$store.getters.isHide
    }

    public onHideChange() {
        this.$store.state.hideTokens = !this.hide
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
        const symbolList = ['VET', 'VTHO']
        return this.$store.getters.tokens.map((item: app.Token) => {
            let isShow = true
            if (this.hide) {
                isShow = symbolList.includes(item.symbol) || this.balances[item.symbol] > 0
            }
            return {
                ...item,
                balance: this.balances[item.symbol] || 0,
                img: require(`../assets/${item.icon}`),
                show: isShow
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
    text-align: right;
    font-size: 30px;
}

.wallet-icon {
    position: relative;
    width: 230px;
    height: 230px;
    margin: 50px auto;
    border-radius: 115px;
    display: block;
    box-shadow: 2px 20px 20px 1px rgba(0, 0, 0, 0.13);
}
.wallet-icon span {
    display: block;
    width: 140px;
    height: 35px;
    line-height: 35px;
    font-size: 24px;
    background-color: rgba(17, 31, 49, 0.33);
    border-radius: 5px;
    margin: auto;
    text-align: center;
    position: absolute;
    top: 95px;
    left: 0;
    right: 0;
    color: #fff;
}

.wallet-name span {
    display: block;
}

.cc-theme .wallet-name span,
.cc-theme .wallet-address {
    color: #fff;
}

.wallet-address {
    overflow: hidden;
    margin: 0;
    text-align: center;
}

.not-allowed:hover {
    cursor: not-allowed;
}

.detail-eye {
    font-size: 20px;
    position: absolute;
    right: -25px;
    color: #6f6f6f;
}
</style>
