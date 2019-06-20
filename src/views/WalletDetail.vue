<template>
    <div class="wallet-detail">
        <a-row type="flex" justify="center">
            <a-col :xs="24">
                <a-row :gutter="{xs: 8, lg: 24}" type="flex" justify="space-around">
                    <a-col :xs="8" :lg="7">
                        <a-row>
                            <a-col>
                                <a-row type="flex" :gutter="8" justify="center" align="middle">
                                    <a-col :xs="24">
                                        <div class="icon-container">
                                            <div
                                                class="wallet-icon"
                                                :class="{hide: visible}"
                                                v-picasso="wallet.address"
                                            >
                                                <span v-if="!isOwn">{{$t('wallets.observe')}}</span>
                                            </div>
                                            <QRCode
                                                class="code"
                                                :class="{show: visible}"
                                                :content="checksumAddress"
                                            />
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-col>
                            <a-col>
                                <a-row type="flex" :gutter="8" align="middle">
                                    <a-col :xs="16" class="wallet-name">
                                        <a-input
                                            v-show="isEdit"
                                            size="large"
                                            ref="input"
                                            maxlength="20"
                                            @keypress.enter="saveName"
                                            @blur="isEdit=false;name=wallet.name"
                                            v-model.trim="name"
                                        ></a-input>
                                        <a-tooltip placement="topRight" :title="wallet.name">
                                            <span
                                                v-show="!isEdit"
                                                style="margin-right: 10px"
                                            >{{wallet.name}}</span>
                                        </a-tooltip>
                                    </a-col>
                                    <a-col :xs="8">
                                        <a-button
                                            v-show="!isEdit"
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
                                        <a-tooltip placement="topRight" :title="wallet.address">
                                            <p
                                                class="wallet-address text-monospace"
                                            >{{wallet.address | toChecksumAddress | shortAddress}}</p>
                                        </a-tooltip>
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
                                            @mouseover="onHover"
                                            @mouseleave="visible = false"
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
                                <a-switch :defaultChecked="hide" @change="onHideChange"/>
                            </a-col>
                            <a-col
                                style="color: #fff; font-size: 18px; padding-left: 15px;"
                            >{{$t('wallets.hide_amount')}}</a-col>
                        </a-row>
                        <a-row type="flex" :gutter="2" justify="space-between">
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
        <a-modal
            :mask="false"
            wrapClassName="cus-modal"
            :closable="false"
            :footer="null"
            v-model="visibleM"
            @cancel="onCancel"
        >
            <div class="remove-wallet-dialog">
                <h1>{{$t('wallets.remove_title')}}</h1>
                <p>{{$t('wallets.remove_msg')}}</p>
                <a-row style="padding-top: 20px;" type="flex" justify="space-around">
                    <a-col>
                        <a-button @click="onCancel" class="cus-btn">{{$t('wallets.remove_no')}}</a-button>
                    </a-col>
                    <a-col>
                        <a-button @click="onOk" class="cus-btn">{{$t('wallets.remove_yes')}}</a-button>
                    </a-col>
                </a-row>
            </div>
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
    public visibleM = false

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
        if (this.wallet) {
            this.name = this.wallet.name
            this.isOwn = connex.vendor.owned(this.wallet.address)
        } else {
            this.$router.push({
                name: 'wallets'
            })
        }
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
                show: isShow
            }
        })
    }

    public deleteWallet() {
        this.visibleM = true
    }

    public onHover() {
        this.visible = true
    }
    public onCancel() {
        this.visibleM = false
    }
    public async onOk() {
        await this.$store.dispatch('deleteWallet', { address: this.wallet.address })
        this.visibleM = false
        this.$router.push({ name: 'wallets' })
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
        if (!this.name) {
            this.name = this.wallet.name
            return
        }
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
    width: 180px;
    height: 180px;
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
    overflow: hidden;
    text-overflow: ellipsis;
}

.wallet-address {
    overflow: hidden;
    margin: 0;
    text-align: right;
    padding-right: 10px;
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
.icon-container {
    position: relative;
}
.icon-container .code {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 180px;
    border-radius: 10px;
    overflow: hidden;
    visibility: hidden;
}
.icon-container .wallet-icon.hide {
    visibility: hidden;
}
.icon-container .code.show {
    visibility: visible;
}

.wallet-detail .token-balance-card {
    transition: all 0.2s ease;
}
.wallet-detail .token-balance-card:not(.not-allowed):hover {
    transform: scale(1.1);
}
</style>
