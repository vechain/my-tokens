<template>
    <a-form class="add-wallet" :form="form">
        <a-form-item>
            <a-input
                ref="address"
                size="large"
                v-decorator="['observeAddress', {
                            rules: [{
                                required: true,
                                message: 'Address is required'
                            }, {
                                pattern: '^0x[a-fA-F0-9]{40}$',
                                message: 'Address format invalid'
                            }]
                        }]"
                placeholder="Start with 0x"
            />
        </a-form-item>
        <a-form-item>
            <a-button size="large" class="btn add-btn" @click="submitWallet">ADD</a-button>
        </a-form-item>
        <a-divider class="divider">
            <span style="color: #fff; font-size: 20px">{{$t('wallets.or')}}</span>
        </a-divider>
        <a-form-item>
            <a-button size="large" class="btn import-btn" @click="importWallet">IMPOERT</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
@Component
export default class AddWallet extends Vue {
    public form: any

    public beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    public async submitWallet() {
        this.form.validateFields(async (e: any, v: any) => {
            if (!e) {
                await this.$store.dispatch('importWallet', v.observeAddress)
                this.resetForm()
            }
        })
    }

    public async importWallet() {
        await this.$store.dispatch('importWallet')
    }

    public resetForm() {
        this.form.resetFields()
    }
}
</script>
<style>
.add-wallet {
    width: 400px;
}
.add-wallet .divider:after,
.add-wallet .divider:before {
    border-top: 2px solid #8d8d99;
}
</style>
