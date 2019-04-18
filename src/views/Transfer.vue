<template>
    <a-row class="transfer" type="flex" justify="space-around">
        <a-col :xs="18">
            <a-form :hideRequiredMark="true" :form="form" @submit="send">
                <a-form-item :label="$t('transfer.from')" :label-col="{ span: 5 }" :wrapper-col="wrapperCol">
                    <a-select
                        size="large"
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
                                    <span class="item-name">{{wallet.name}}</span>
                                    <span
                                        class="item-address text-monospace"
                                    >({{wallet.address | shortAddress}})</span>
                                </a-col>
                                <a-col>
                                    <span class="item-balance">VTHO: {{wallet.vtho | balance}}</span>
                                </a-col>
                            </a-row>
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('transfer.to')" :label-col="{ span: 5 }" :wrapper-col="wrapperCol">
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
                <a-form-item :label="$t('transfer.amount')" :label-col="{ span: 5 }" :wrapper-col="wrapperCol">
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
                                        pattern: '^[0-9]+$',
                                        message: 'Amount invalid'
                                    }]
                                }]"
                                    name="amount"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item>
                                <a-select
                                    size="large"
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
                                            <a-col>
                                                <img
                                                    style="margin-right: 10px"
                                                    width="25px"
                                                    :src="token.img"
                                                    :alt="token.name"
                                                >
                                                <span class="item-name">{{token.symbol}}</span>
                                            </a-col>
                                            <a-col>
                                                <span
                                                    class="item-balance"
                                                >{{token.balance | balance}}</span>
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
    private unit?: string = 'VET'
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

    // All tokens
    get tokenlist() {
        return this.$store.getters.tokens.map((item: app.Token) => {
            return {
                ...item,
                balance: this.from ? this.balances[item.symbol] || 0 : 0,
                img: require(`../assets/${item.icon}`)
            }
        })
    }

    get balances() {
        if (this.from) {
            return this.$store.getters.balanceList && this.$store.getters.balanceList[this.from] || {}
        } else {
            return {}
        }
    }

    public created() {
        this.initForm()
    }

    public send(e: Event) {
        e.preventDefault()
        this.form.validateFields((err: any, val: any) => {
            const isVet = (val.unit! as string).toLowerCase() === 'vet'
            if (!err) {
                if (isVet) {
                    this.transferVet(val.from, val.to, val.val, 18)
                } else {
                    const temp = this.$store.getters.tokens.find((item: app.Token) => {
                        return item.symbol === val.unit
                    })
                    this.tokenTransfer(
                        val.to,
                        val.from,
                        temp.address,
                        Vue.filter('valToHex')(val.val, temp.decimals),
                        val.unit!
                    )
                }
            }
        })
    }

    public transferVet(from: string, to: string, amount: number, decimals: number) {
        const svc = connex.vendor.sign('tx')
        svc.signer(from).request([{
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
        await svc.comment('').request([{ ...transferClause }])
    }

    public initForm() {
        const wallet = this.walletList.find((item) => {
            return item.address === this.$route.query.from
        })
        const unit = this.tokenlist.find((item: app.Token) => {
            return item.symbol === this.$route.query.symbol
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
.transfer .item-name {
    font-weight: bold;
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
</style>

