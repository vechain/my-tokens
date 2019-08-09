<template>
    <div class="wallet">
        <div v-if="!loading">
            <template v-if="wallets.length">
                <div class="wallet-list" style="padding: 0 40px">
                    <a-row class="hide-small" type="flex" align="middle" justify="space-around">
                        <a-col :md="22" :lg="18" :xl="16" :xxl="14">
                            <a-row type="flex" align="middle" justify="space-between">
                                <a-col>
                                    <h2 class="font-g underscore">{{$t('wallets.title')}}</h2>
                                </a-col>
                                <a-col>
                                    <a-button
                                        class="cus-btn"
                                        @click="observeWallet"
                                    >{{$t('wallets.add')}}</a-button>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <a-row class="hide-gt-small" type="flex" align="middle" justify="space-between">
                        <a-col>
                            <h2 class="font-g underscore">{{$t('wallets.title')}}</h2>
                        </a-col>
                        <a-col>
                            <a-button
                                shape="circle"
                                style="background-color: #625B6C; border: none; color: #fff;"
                                @click="observeWallet"
                                icon="plus-circle"
                            ></a-button>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <a-row type="flex" :justify="wallets.length >= 4 ? 'start' : 'center'">
                        <a-col
                            :xs="24"
                            v-for="item in wallets"
                            :key="item.address"
                            :sm="12"
                            :md="12"
                            :lg="12"
                            :xl="8"
                            :xxl="6"
                        >
                            <wallet-card
                                @click="$router.push({name: 'wallet-detail', params: {id: item.address}})"
                                style="margin: 30px auto 0;"
                                :item="item"
                            ></wallet-card>
                        </a-col>
                    </a-row>
                </div>
            </template>
            <div v-else class="wallet-empty">
                <div>
                    <p v-html="$t('wallets.first_time')" style="color: #fff;"></p>
                    <AddWallet />
                </div>
            </div>
        </div>
        <a-modal
            :centered="true"
            :mask="false"
            wrapClassName="cus-modal"
            class="cus-modal"
            :title="null"
            :closable="false"
            :footer="null"
            v-model="visible"
            @cancel="onCancel"
        >
            <h1 style="color: #fff;">{{$t('wallets.title_add')}}</h1>
            <add-wallet @finished="visible=false" style="margin: auto" ref="addform" />
        </a-modal>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import WalletCard from '../components/WalletCard.vue'
import AddWallet from '../components/AddWallet.vue'
@Component({
    components: {
        WalletCard,
        AddWallet
    }
})
export default class Wallets extends Vue {
    public visible = false
    public observeAddress = ''
    public created() {
        this.$ga.page('/tokens/wallets')
    }
    public observeWallet() {
        this.visible = true
    }

    get loading() {
        return this.wallets === null
    }

    public onCancel() {
        const temp = this.$refs.addform as AddWallet
        temp.resetForm()
    }

    get wallets() {
        return this.$store.getters.wallets.map((item: app.Wallet) => {
            return {
                ...item,
                own: connex.vendor.owned(item.address)
            }
        })
    }
}
</script>
<style>
.wallet {
    padding: 20px 40px;
}
.wallet .wallet-empty {
    margin-top: 50px;
    margin-left: 20%;
    max-width: 800px;
}
.wallet .wallet-item {
    transition: all 0.2s ease;
}
@media (min-width: 576.1px) {
    .wallet .wallet-item:hover {
        transform: scale(1.1);
    }
}
.wallet .wallet-empty p {
    font-size: 36px;
}
@media (max-width: 576px) {
    .add-wallet,
    .add-wallet .ant-input,
    .add-wallet .btn {
        width: 100%;
    }
    .wallet {
        padding: 20px 10px;
    }
    .wallet .wallet-empty {
        margin: 50px auto;
        width: 80%;
    }
    .wallet .wallet-empty p {
        font-size: 1.7em;
    }
}
</style>
