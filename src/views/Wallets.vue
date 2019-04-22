<template>
    <div class="wallet">
        <div v-if="!loading">
            <div v-if="wallets.length" class="wallet-list">
                <a-row type="flex" justify="space-between" style="padding: 20px 80px 0">
                    <a-col>
                        <h2>{{$t('wallets.title')}}</h2>
                    </a-col>
                    <a-col>
                        <div>
                            <a-button-group>
                                <a-button @click="importWallet">{{$t('wallets.import')}}</a-button>
                                <a-button @click="observeWallet">{{$t('wallets.observe')}}</a-button>
                            </a-button-group>
                        </div>
                    </a-col>
                </a-row>
                <a-row type="flex" justify="start">
                    <a-col
                        :xs="24"
                        v-for="item in wallets"
                        :key="item.address"
                        :sm="12"
                        :md="12"
                        :lg="8"
                        :xl="6"
                        :xxl="4"
                    >
                        <wallet-card style="margin: 30px auto 0;" :item="item">
                            <template v-slot:actions>
                                <router-link
                                    :to="{name: 'wallet-detail', params: {id: item.address}}"
                                    style="margin-right: 15px"
                                >{{$t('wallets.detail')}}</router-link>
                                <router-link
                                    v-if="item.own"
                                    :to="{name: 'transfer', query: {
                                    from: item.address, symbol: 'vet'
                                }}"
                                >{{$t('wallets.transfer')}}</router-link>
                            </template>
                        </wallet-card>
                    </a-col>
                </a-row>
            </div>
            <div v-else class="wallet-empty">
                <h1>Wallets</h1>
                <p>There is no wallet. You need to add a wallet first</p>
                <a-row type="flex">
                    <a-col class="action" :span="12">
                        <div @click="observeWallet">
                            <a-icon type="wallet"/>
                            <p style="font-size: 16px">{{$t('wallets.observe')}}</p>
                        </div>
                    </a-col>
                    <a-col class="action" :span="12">
                        <div @click="importWallet">
                            <a-icon type="sync"/>
                            <p style="font-size: 16px">{{$t('wallets.import')}}</p>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-modal title="Observe Wallet" v-model="visible" @ok="submitWallet" @cancel="resetModal">
            <a-form :form="form">
                <a-form-item>
                    <a-input
                        ref="address"
                        v-decorator="['observeAddress', {
                            rules: [{
                                required: true,
                                message: 'Address is required '
                            }, {
                                pattern: '^0x[a-fA-F0-9]{40}$',
                                message: 'Address format invalid'
                            }]
                        }]"
                        placeholder="Start with 0x"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import WalletCard from '../components/WalletCard.vue'
@Component({
    components: {
        WalletCard
    }
})
export default class Wallets extends Vue {
    public visible = false
    public observeAddress = ''
    public form: any

    public beforeCreate() {
        this.form = this.$form.createForm(this)
    }
    public observeWallet() {
        this.visible = true
    }

    get loading() {
        return this.wallets === null
    }

    public async submitWallet() {
        this.form.validateFields(async (e: any, v: any) => {
            if (!e) {
                await this.$store.dispatch('importWallet', v.observeAddress)
                this.resetModal()
            }
        })

    }

    public resetModal() {
        this.form.resetFields()
        this.visible = false
    }

    get wallets() {
        return this.$store.getters.wallets.map((item: app.Wallet) => {
            return {
                ...item,
                own: connex.vendor.owned(item.address)
            }
        })
    }
    public async importWallet() {
        await this.$store.dispatch('importWallet')
    }
}
</script>
<style>
.wallet {
    padding: 20px 80px;
}
.wallet .wallet-empty {
    max-width: 500px;
    margin: auto;
}
.wallet .wallet-empty .action {
    border: 1px solid #222;
    height: 150px;
    padding-top: 30px;
    font-size: 45px;
}
</style>
