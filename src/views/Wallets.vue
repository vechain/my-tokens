<template>
    <div class="wallet">
        <div v-if="!loading">
            <div v-if="wallets.length" class="wallet-list">
                <h2>Wallet</h2>
                <a-button @click="importWallet">Import</a-button>
                <a-button @click="observeWallet">Observe</a-button>
                <div v-for="item in wallets" :key="item.address">{{item.name}}</div>
            </div>
            <div v-else class="wallet-empty">
                <h1>Wallets</h1>
                <p>There is no wallet. You need to add a wallet first</p>
                <a-row type="flex">
                    <a-col class="action" :span="12">
                        <div @click="observeWallet">
                            <a-icon type="wallet"/>
                            <p style="font-size: 16px">Observe</p>
                        </div>
                    </a-col>
                    <a-col class="action" :span="12">
                        <div @click="importWallet">
                            <a-icon type="sync"/>
                            <p style="font-size: 16px">Import from Sync</p>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-modal title="Observe Wallet" v-model="visible" @ok="submitWallet" @cancel="resetModal">
            <a-form>
                <a-form-item>
                    <a-input
                        ref="address"
                        required
                        placeholder="Start with 0x"
                        pattern="^0x[a-fA-F0-9]{40}$"
                        v-model="observeAddress"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Wallets extends Vue {
    public visible = false
    public observeAddress = ''
    public form = this.$form.createForm(this)
    // loading = this.wallets === null
    // hasWallets = this.wallets && this.wallets.length
    public observeWallet() {
        this.visible = true
    }

    get loading() {
        return this.wallets === null
    }

    public checkForm() {
        const ele = ((this.$refs.address as Vue).$el as HTMLInputElement)
        const result = ele.checkValidity()
        if (result) {
            ele.parentElement!.classList.remove('has-error')
        } else {
            ele.parentElement!.classList.add('has-error')
        }

        return result
    }

    public async submitWallet() {
        if (!this.checkForm()) {
            return
        }
        await this.$store.dispatch('importWallet', this.observeAddress)
        this.resetModal()
    }

    public resetModal() {
        const ele = ((this.$refs.address as Vue).$el as HTMLInputElement)
        ele.parentElement!.classList.remove('has-error')
        this.visible = false
        this.observeAddress = ''
    }

    get wallets() {
        return this.$store.getters.wallets
    }
    public async importWallet() {
        await this.$store.dispatch('importWallet')
    }
}
</script>
<style>
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

.ant-form .has-error .ant-input:not(:placeholder-shown):invalid:focus,
.ant-input:not(:placeholder-shown):invalid:focus {
    background-color: transparent !important;
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
}

.ant-form .has-error .ant-input:not(:placeholder-shown):valid:focus,
.ant-input:not(:placeholder-shown):valid:focus {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}
.ant-form .has-error .ant-input {
    border: 1px solid red;
}
.ant-input:not(:placeholder-shown):invalid {
    border: 1px solid red !important;
}
.ant-input:not(:placeholder-shown):valid {
    background-color: transparent !important;
}
</style>
