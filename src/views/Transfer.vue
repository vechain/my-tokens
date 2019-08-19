<template>
    <div class="transfer">
        <a-row class="hide-small" type="flex" justify="space-around">
            <a-col :md="22" :lg="18" :xl="16" :xxl="14">
                <h2 class="font-g underscore">{{$t('transfer.title')}}</h2>
            </a-col>
        </a-row>
        <a-row class="hide-gt-small" type="flex" justify="space-between">
            <a-col>
                <h2 class="font-g underscore">{{$t('transfer.title')}}</h2>
            </a-col>
            <a-col></a-col>
        </a-row>
        <a-row type="flex" justify="space-around">
            <a-col :md="18" :lg="14" :xl="12" :xxl="8">
                <a-form layout="vertical" :hideRequiredMark="true" :form="form" @submit="send">
                    <a-form-item :label="$t('transfer.from')">
                        <a-input
                            v-show="false"
                            v-decorator="['from', {
                                initialValue: from,
                                rules: [{
                                    required: true,
                                    message: $t('msg.from_require')
                                }]
                            }]"
                        />
                        <WalletCard
                            class="transfer-wallet show-card"
                            @click="showWl = true"
                            :item="wallet"
                        ></WalletCard>
                    </a-form-item>
                    <a-form-item :label="$t('transfer.to')">
                        <a-auto-complete
                            :allowClear="true"
                            class="select-re-theme"
                            dropdownClassName="select-list-rebg text-monospace"
                            size="large"
                            name="to"
                            v-decorator="['to', {
                                rules: [{
                                    required: true,
                                    message: $t('msg.to_require')
                                },{
                                    pattern: '^0x[a-fA-F0-9]{40}$',
                                    message: $t('msg.to_format')
                                }]
                            }]"
                            :dataSource="toList"
                        ></a-auto-complete>
                    </a-form-item>
                    <a-form-item :label="$t('transfer.amount')">
                        <a-input
                            size="large"
                            class="amount-input"
                            v-decorator="['val', {
                                rules: [{
                                    required: true,
                                    message: $t('msg.amount_require')
                                }, {
                                    validator: checkAmount
                                }]
                            }]"
                            name="amount"
                        >
                            <a-button
                                @click="showTl=true"
                                class="cus-btn token-btn"
                                slot="addonBefore"
                            >
                                <img :src="token.img" :alt="token.symbol" />
                            </a-button>
                            <a-button
                                @click="setAmount"
                                :style="SetAmountStyle"
                                class="cus-btn balance-btn"
                                slot="addonAfter"
                            >{{tokenBalance | balance}}</a-button>
                        </a-input>
                    </a-form-item>
                    <a-form-item v-if="showImport">
                        <a-checkbox
                            @change="doImport = !doImport"
                            style="color: #fff;"
                        >{{$t('transfer.import_after_tx')}}</a-checkbox>
                    </a-form-item>
                    <a-form-item class="send-wapper">
                        <button
                            class="send-btn add-btn btn ant-btn ant-btn-default ant-btn-lg"
                            type="submit"
                        >{{$t('transfer.send')}}</button>
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
        <a-modal
            :mask="false"
            :closable="false"
            :footer="null"
            wrapClassName="cus-modal transfer-p"
            v-model="showTl"
        >
            <h1>{{$t('wallets.token')}}</h1>
            <div ref="tokenList" class="transfer-list-container">
                <TokenBalanceCard
                    v-for="item in tokenlist"
                    :key="item.symbol"
                    style="margin-top: 10px;"
                    @click="tokenChange(item.symbol)"
                    :item="item"
                />
            </div>
        </a-modal>
        <a-modal
            :mask="false"
            :closable="false"
            :footer="null"
            wrapClassName="cus-modal transfer-p"
            v-model="showWl"
        >
            <a-row type="flex" align="middle" justify="space-between">
                <a-col>
                    <h1>{{$t('wallets.title')}}</h1>
                </a-col>
                <a-col>
                    <a-select
                        class="select-re-theme"
                        dropdownClassName="select-list-rebg"
                        v-model="unit"
                        @change="tokenChange"
                    >
                        <template v-for="token in tokenlist">
                            <a-select-option
                                :key="token.symbol"
                                :value="token.symbol"
                            >{{token.symbol}}</a-select-option>
                        </template>
                    </a-select>
                </a-col>
            </a-row>
            <div ref="walletList" class="transfer-list-container">
                <template v-if="walletList.length">
                    <WalletCard
                        style="margin: 25px auto; width: 100%;"
                        class="transfer-wallet"
                        @click="walletChange(item)"
                        v-for="item in walletList"
                        :item="item"
                        :key="item.address"
                    >
                        <div slot="actions">
                            {{item.balance | balance}}
                            <span style="font-size: 14px">{{unit}}</span>
                        </div>
                    </WalletCard>
                </template>
                <template v-else>
                    <p
                        style="text-align: center; color: #fff; padding: 30px 0;font-size: 16px"
                    >{{$t('transfer.no_wallet')}}</p>
                    <a-button
                        style="width: 300px; font-size: 22px; margin: 15px auto; display: block"
                        size="large"
                        @click="importWallet"
                        class="btn import-btn"
                    >{{$t('wallets.import')}}</a-button>
                </template>
            </div>
            <div style="text-align:center; padding-top: 25px;">
                <a-button
                    type="primary"
                    @click="importWallet"
                    ghost
                    v-if="walletList.length"
                >{{$t('wallets.import')}}</a-button>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import TokenBalanceCard from '../components/TokenBalanceCard.vue'
import WalletCard from '../components/WalletCard.vue'
@Component({
    components: {
        TokenBalanceCard,
        WalletCard
    }
})
export default class Transfer extends Vue {
    private from: string = ''
    private unit: string = 'VET'
    private token!: app.Token
    private showTl = false
    private showWl = false
    private form: any
    private wallet: app.Wallet | null = null
    private showImport = false
    private doImport = false
    private walletList: app.Wallet[] = []

    public beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    public async importWallet() {
        await this.$store.dispatch('importWallet')
        this.getWalletList()
    }

    public async getWalletList(): Promise<void> {
        const result: app.Wallet[] = []
        for (const item of this.$store.getters.wallets) {
            if (await connex.vendor.owned(item.address) || true) {
                result.push(item)
            }
        }
        this.walletList = result.map((item: app.Wallet) => {
            return {
                ...item,
                balance: this.$store.getters.balanceList
                    && this.$store.getters.balanceList[item.address]
                    && this.$store.getters.balanceList[item.address][this.unit] || 0
            }
        }).sort((a: app.Wallet & { balance: number }, b: app.Wallet & { balance: number }) => {
            return b.balance - a.balance
        })

        return
    }

    get SetAmountStyle() {
        return (this.unit && this.unit.toLowerCase() === 'vtho') ? { cursor: 'not-allowed' } : ''
    }

    get toList() {
        return this.$store.state.toList.map((item: string) => {
            return Vue.filter('toChecksumAddress')(item)
        })
    }

    public checkAmount(rule: any, value: any, callback: any) {
        let msg = ''
        if (!value) {
            callback()
        }
        if (!Vue.filter('balanceCheck')(value)) {
            msg = this.$t('msg.amount_invalid').toString()
            callback(new Error(msg))
        }

        if (value > this.tokenBalance) {
            msg = this.$t('msg.amount_not_enough').toString()
            callback(new Error(msg))
        }
        callback()
    }

    public walletChange(wallet: app.Wallet) {
        const el = this.$refs.walletList as HTMLElement
        this.wallet = wallet
        this.from = wallet.address
        this.form.setFieldsValue({ from: wallet.address })
        this.showWl = false
        this.showImport = false
        el.scrollTop = 0
    }

    public tokenChange(symbol: string) {
        const el = this.$refs.tokenList as HTMLElement
        this.token = this.tokenlist.find((item: app.Token) => {
            return item.symbol === symbol
        })
        this.unit = symbol
        this.showTl = false
        this.form.resetFields(['val'])
        if (el) {
            el.scrollTop = 0
        }
    }

    public setAmount() {
        if (this.unit && this.unit.toLowerCase() === 'vtho') {
            return
        }
        this.form.setFieldsValue({ val: this.tokenBalance })
    }

    get balances() {
        return this.$store.getters.balanceList && this.$store.getters.balanceList[this.from] || {}
    }

    get tokenBalance() {
        return this.$store.getters.balanceList
            && this.$store.getters.balanceList[this.from]
            && this.$store.getters.balanceList[this.from][this.unit] || 0
    }

    get tokenlist() {
        return this.$store.getters.tokens.map((item: app.Token) => {
            return {
                ...item,
                balance: this.balances[item.symbol] || 0
            }
        })
    }

    public async created() {
        this.$ga.page('/tokens/transfer')
        this.initForm()
    }

    public mounted() {
        this.form.setFieldsValue({ from: this.from })
    }

    public send(e: Event) {
        e.preventDefault()
        this.form.validateFields(async (err: any, val: any) => {
            const symbolUnit = this.unit
            const isVet = (symbolUnit! as string).toLowerCase() === 'vet'
            let decimals = 18
            if (!err) {
                let result: any
                try {
                    if (isVet) {
                        result = await this.transferVet(val.from, val.to, val.val, 18)
                    } else {
                        const temp = this.$store.getters.tokens.find((item: app.Token) => {
                            return item.symbol.toString().toLowerCase() === symbolUnit.toString().toLowerCase()
                        })
                        decimals = temp.decimals
                        result = await this.tokenTransfer(
                            val.to,
                            val.from,
                            temp.address,
                            val.val,
                            symbolUnit,
                            decimals
                        )

                    }
                } catch (error) {
                    this.$error({
                        class: 'cus-modal',
                        title: this.$createElement('span', {
                            style: {
                                color: '#fff'
                            }
                        }, error.message)
                    })
                    return
                }
                this.$store.dispatch('addTransferLog', {
                    txid: result.txid,
                    from: val.from,
                    to: val.to,
                    amount: Vue.filter('valToHex')(val.val, decimals),
                    coin: symbolUnit
                })
                this.$success({
                    title: this.$createElement('span', {
                        style: {
                            color: '#fff'
                        }
                    }, this.$t('transfer.tx_success').toString()),
                    class: 'cus-modal',
                    content: this.$createElement('div', {
                        style: {
                            color: '#fff'
                        },
                        domProps: {
                            innerHTML: this.$t('transfer.tx_info',
                                {
                                    txid: result.txid,
                                    path: 'https://insight.vecha.in/#/txs/'
                                }).toString()
                        }
                    }),
                    okType: 'primary',
                    maskStyle: { background: 'transparent' },
                    okButtonProps: { props: { ghost: true } },
                    maskClosable: true
                } as any)
                if (this.doImport) {
                    this.$store.dispatch('importWallet', this.from)
                }
                this.resetForm()
            }
        })
    }

    public resetForm() {
        this.form.resetFields(['to', 'val', 'from'])
        this.wallet = null
        this.doImport = false
        this.showImport = false
        this.from = ''
    }

    public async transferVet(from: string, to: string, amount: number, decimals: number) {
        const svc = connex.vendor.sign('tx')
        return await svc.signer(from).request([{
            to,
            value: Vue.filter('valToHex')(amount, decimals),
            data: '0x',
            comment: `Transfering ${amount} VET`
        }])
    }

    public async tokenTransfer(
        to: string,
        from: string,
        address: string,
        amount: number,
        symbol: string,
        decimals: number
    ) {
        const abi = {
            constant: false,
            inputs: [
                {
                    name: '_to',
                    type: 'address'
                },
                {
                    name: '_value',
                    type: 'uint256'
                }
            ],
            name: 'transfer',
            outputs: [
                {
                    name: '',
                    type: 'bool'
                }
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        }
        const method = connex.thor.account(address).method(abi)
        const transferClause = method.asClause(to, Vue.filter('valToHex')(amount, decimals))
        const svc = connex.vendor.sign('tx')
        svc.signer(from)
        return await svc.comment('').request([{ ...transferClause, comment: `Transfering ${amount} ${symbol}` }])
    }

    public async initForm() {
        const token = this.tokenlist.find((item: app.Token) => {
            return item.symbol.toLowerCase() === (this.$route.query.symbol || 'VET').toString().toLowerCase()
        })
        if (token) {
            this.unit = token.symbol
            this.token = token
        } else {
            this.token = this.tokenlist[0]
        }
        await this.getWalletList()
        const wallet = this.walletList!.find((item) => {
            return item.address.toLowerCase() === (this.$route.query.from || '').toString().toLowerCase()
        })

        if (this.$route.query && this.$route.query.from) {
            if (connex.vendor.owned(this.$route.query.from.toString())) {
                if (wallet) {
                    this.from = wallet.address
                    this.wallet = wallet
                } else {
                    this.showImport = true
                    this.from = this.$route.query.from.toString().toLowerCase()
                    this.wallet = {
                        name: this.$t('wallets.select_wallet').toString(),
                        address: this.from
                    }
                }
            }
        }
    }
}
</script>
<style>
.transfer {
    padding: 20px 80px;
}
.select-opt.item-name,
.transfer .item-name {
    max-width: 300px;
    overflow: hidden;
    display: inline-block;
    font-weight: bold;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
}
.transfer .item-address {
    font-size: 14px;
    font-family: "Courier New", Courier, monospace;
    font-weight: 500;
}
.transfer .item-balance {
    font-size: 12px;
}
.transfer .ant-select-selection-selected-value .item-balance {
    display: none;
}
.transfer form .ant-input-group .ant-select {
    width: 100%;
}
.transfer .ant-select-selection-selected-value img {
    width: 25px;
    height: 25px;
}
.transfer .ant-input-group-addon {
    background: transparent;
}
.transfer .token-btn:after,
.transfer .balance-btn:after {
    border: none;
}
.transfer .token-btn img {
    width: 30px;
    height: 30px;
}
.transfer .token-btn,
.transfer .balance-btn {
    background: transparent;
    padding: 0;
    border: none;
}

.transfer .ant-input-wrapper .ant-input-group-addon {
    border-color: #c1c1cd;
}

.transfer .ant-input-wrapper .ant-input-group-addon:hover {
    background-color: rgba(247, 247, 247, 0.2);
}
.transfer .ant-form-item-control.has-error .ant-input,
.transfer .ant-input-wrapper .ant-input:focus,
.transfer .ant-input-wrapper .ant-input:hover {
    border-left-width: 1px;
    border-right-width: 1px;
}
.transfer .ant-input-group .ant-input {
    border-left-width: 0;
    border-right-width: 0;
}
.transfer-wallet {
    width: 380px;
    margin: auto;
    transition: all 0.3s ease;
}
.transfer .send-wapper {
    padding-top: 30px;
}
.transfer .send-wapper .ant-form-item-children,
.transfer .send-wapper .send-btn {
    display: block;
    margin: auto;
}
.transfer .send-wapper .send-btn {
    width: 350px;
    font-size: 16px;
    opacity: 0.6;
}
.transfer .send-wapper .send-btn:hover {
    opacity: 1;
}
.transfer .send-wapper .send-btn::after {
    background-image: url(../assets/sendLeft.png);
}

.transfer .send-wapper .send-btn::before {
    background-image: url(../assets/sendRight.png);
}
.transfer-list-container .transfer-wallet img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.transfer-list-container .transfer-wallet {
    width: 390px;
    height: initial;
    padding: 20px 0;
}

.transfer-list-container .transfer-wallet .ant-col-xs-8 {
    width: 100px;
}
.transfer-list-container .transfer-wallet .ant-col-xs-14 {
    width: 250px;
}
.transfer-list-container .transfer-wallet .ant-col-xs-14 > div:nth-child(1) {
    display: inline-block;
    line-height: 20px;
}
.transfer-list-container .transfer-wallet .wallet-label {
    vertical-align: text-bottom;
}
.transfer-list-container
    .transfer-wallet
    .ant-col-xs-14
    > div:nth-child(2)::after {
    content: ")";
}
.transfer-list-container
    .transfer-wallet
    .ant-col-xs-14
    > div:nth-child(2)::before {
    content: "(";
}
.transfer-list-container .transfer-wallet .ant-col-xs-14 > div:nth-child(2) {
    display: inline-block;
    font-size: 12px;
    color: #737373;
    vertical-align: bottom;
}
.transfer-list-container {
    max-height: 500px;
    overflow-y: auto;
    padding: 0 15px;
    overflow-x: visible;
}
.transfer-list-container .actions {
    font-size: 16px;
    text-align: right;
    color: #333;
}
.select-re-theme {
    width: 120px;
}
.transfer-list-container .token-balance-card {
    transition: all 0.2s ease;
    width: 390px;
    margin: 20px auto;
}

@media (max-width: 576px) {
    .transfer {
        padding: 20px 40px;
    }
    .transfer-list-container .token-balance-card {
        width: 100%;
    }
    .transfer-list-container .token-balance-card .ant-card-body {
        padding: 10px;
    }
    .cus-modal .ant-modal-body .transfer-list-container {
        padding: 0;
    }
    .cus-modal.transfer-p .ant-modal-body {
        padding: 15px 5px;
    }
}
@media (min-width: 576.1px) {
    .transfer-list-container .token-balance-card:hover {
        transform: scale(1.1);
    }
    .transfer-list-container .transfer-wallet:hover {
        transform: scale(1.11);
    }
}
</style>

