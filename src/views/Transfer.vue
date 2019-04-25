<template>
    <a-row class="transfer" type="flex" justify="space-around">
        <a-col :xs="24">
            <a-form :hideRequiredMark="true" :form="form" @submit="send">
                <a-form-item
                    :label="$t('transfer.from')"
                    :label-col="{ span: 5 }"
                    :wrapper-col="wrapperCol"
                >
                    <a-select
                        size="large"
                        @change="onWChange"
                        v-decorator="['from', {
                        initialValue: from,
                        rules: [{
                            required: true,
                            message: 'From is required'
                        }]
                    }]"
                    >
                        <a-select-option
                            v-for="wallet in walletList"
                            :key="wallet.address"
                            :value="wallet.address"
                            :title="wallet.name"
                        >
                            <a-row type="flex" justify="space-between">
                                <a-col>
                                    <a-row type="flex" justify="space-between">
                                        <a-col>
                                            <span class="item-name">{{wallet.name}}</span>
                                        </a-col>
                                        <a-col>
                                            <span
                                                class="item-address text-monospace"
                                            >({{wallet.address | toChecksumAddress | shortAddress}})</span>
                                        </a-col>
                                    </a-row>
                                </a-col>
                                <a-col>
                                    <span class="item-balance">VTHO: {{wallet.vtho | balance}}</span>
                                </a-col>
                            </a-row>
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('transfer.to')"
                    :label-col="{ span: 5 }"
                    :wrapper-col="wrapperCol"
                >
                    <a-input
                        size="large"
                        name="to"
                        v-decorator="['to', {
                            rules: [{
                                required: true,
                                message: 'To is required'
                            },{
                                pattern: '^0x[a-fA-F0-9]{40}$',
                                message: 'To format invalid'
                            }]
                        }]"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('transfer.amount')"
                    :label-col="{ span: 5 }"
                    :wrapper-col="wrapperCol"
                >
                    <a-row type="flex" :gutter="8">
                        <a-col :span="16">
                            <a-form-item>
                                <a-input
                                    size="large"
                                    v-decorator="['val', {
                                    rules: [{
                                        required: true,
                                        message: 'Amount is required'
                                    }, {
                                       validator: checkAmount
                                    }]
                                }]"
                                    name="amount"
                                />
                                <span>{{tokenBalance | balance}}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item>
                                <a-select
                                    size="large"
                                    @change="onSChange"
                                    v-decorator="['unit', {
                                    initialValue: unit,
                                    rules: [{
                                        required: true,
                                        message: 'Type is required'
                                    }]
                                }]"
                                >
                                    <a-select-option
                                        v-for="token in tokenlist"
                                        :key="token.symbol"
                                        :value="token.symbol"
                                    >
                                        <a-row type="flex" justify="space-between">
                                            <a-col :span="8">
                                                <img
                                                    style="margin-right: 10px"
                                                    width="45px"
                                                    height="45px"
                                                    :src="token.img"
                                                    :alt="token.name"
                                                >
                                            </a-col>
                                            <a-col :span="16">
                                                <a-row>
                                                    <a-col style="text-align: right;">
                                                        <span
                                                            class="select-opt item-name"
                                                        >{{token.symbol}}</span>
                                                    </a-col>
                                                    <a-col style="text-align: right;">
                                                        <span
                                                            class="select-opt item-balance"
                                                        >{{token.balance | balance}}</span>
                                                    </a-col>
                                                </a-row>
                                            </a-col>
                                        </a-row>
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item :wrapper-col="{ xs: 10, offset: 12 }">
                    <a-button size="large" type="primary" html-type="submit">{{$t('transfer.send')}}</a-button>
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
    private unit: string = 'VET'
    private wrapperCol = {
        xs: 16,
        lg: 12
    }
    private form: any

    public beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    get walletList(): app.Wallet[] {
        return this.$store.getters.wallets.filter((item: app.Wallet) => {
            return connex.vendor.owned(item.address)
        }).map((item: app.Wallet) => {
            return {
                ...item,
                vtho: this.$store.getters.balanceList
                    && this.$store.getters.balanceList[item.address]
                    && this.$store.getters.balanceList[item.address].VTHO
            }
        })
    }

    public onWChange(val: string, items: any[]) {
        this.from = val
    }

    public checkAmount(rule: any, value: any, callback: any) {
        if (!Vue.filter('balanceCheck')(value)) {
            callback(new Error('Amount is invalid'))
        }
    }

    public onSChange(val: string, items: any[]) {
        this.unit = val
    }

    get balances() {
        return this.$store.getters.balanceList && this.$store.getters.balanceList[this.from] || {}
    }

    get tokenBalance() {
        return this.$store.getters.balanceList
            && this.$store.getters.balanceList[this.from]
            && this.$store.getters.balanceList[this.from][this.unit] || 0
    }

    // All tokens
    get tokenlist() {
        return this.$store.getters.tokens.map((item: app.Token) => {
            return {
                ...item,
                balance: this.balances[item.symbol] || 0,
                img: require(`../assets/${item.icon}`)
            }
        })
    }

    public created() {
        this.initForm()
    }

    public send(e: Event) {
        e.preventDefault()
        this.form.validateFields(async (err: any, val: any) => {
            const isVet = (val.unit! as string).toLowerCase() === 'vet'
            if (!err) {
                let result: any
                if (isVet) {
                    result = await this.transferVet(val.from, val.to, val.val, 18)
                } else {
                    const temp = this.$store.getters.tokens.find((item: app.Token) => {
                        return item.symbol === val.unit
                    })
                    result = await this.tokenTransfer(
                        val.to,
                        val.from,
                        temp.address,
                        Vue.filter('valToHex')(val.val, temp.decimals),
                        val.unit!
                    )
                }
                this.$success({
                    title: 'The request send success',
                    content: `The Txid: ${result.txid}, check the information`,
                    maskClosable: true,
                    onOk() {
                        window.open(`https://insight.vecha.in/#/txs/${result.txid}`)
                    }
                })
                this.form.resetFields(['to', 'val'])
            }
        })
    }

    public async transferVet(from: string, to: string, amount: number, decimals: number) {
        const svc = connex.vendor.sign('tx')
        return await svc.signer(from).request([{
            to,
            value: Vue.filter('valToHex')(amount, decimals),
            data: '0x'
        }])
    }

    public async tokenTransfer(to: string, from: string, address: string, amount: number, symbol: string) {
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
        const transferClause = method.asClause(to, amount)
        const svc = connex.vendor.sign('tx')
        svc.signer(from)
        svc.link('https://connex.vecha.in/{txid}')
        return await svc.comment('').request([{ ...transferClause }])
    }

    public initForm() {
        const wallet = this.walletList.find((item) => {
            return item.address.toLowerCase() === (this.$route.query.from || '').toString().toLowerCase()
        })
        const unit = this.tokenlist.find((item: app.Token) => {
            return item.symbol.toLowerCase() === (this.$route.query.symbol || '').toString().toLowerCase()
        })

        this.from = wallet && wallet.address || ''
        this.unit = unit && unit.symbol
    }
}
</script>
<style>
.transfer {
    padding-top: 50px;
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
</style>

