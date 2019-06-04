<template>
    <div v-on="$listeners" class="wallet-item">
        <a-row type="flex" style="height: 100%" align="middle">
            <a-col :xs="8" style="text-align: center;">
                <img v-if="item" v-picasso="item.address" class="wallet-img">
                <img v-else src="../assets/unknowWallet.png" class="wallet-img">
            </a-col>
            <a-col :xs="14" style="margin-left: 10px">
                <div>
                    <p v-if="item" :title="item.name" class="wallet-label">{{item.name + ' '}}</p>
                    <p v-else class="wallet-label">{{$t('wallets.unknow')}}</p>
                </div>
                <div
                    v-if="item"
                    class="wallet-address"
                    :title="item.address"
                >{{item.address | toChecksumAddress | shortAddress}}</div>
                <div v-else style="color:#807F89;">{{$t('wallets.select_wallet')}}</div>
                <div class="actions">
                    <slot name="actions"/>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class WalletCard extends Vue {
    @Prop({ default: {} })
    public item!: app.Wallet
}
</script>

<style>
.wallet-item {
    padding: 20px 30px 20px 20px;
    width: 320px;
    height: 130px;
    box-sizing: border-box;
    border: 1px solid rgba(48, 55, 66, 0.06);
    border-radius: 4px;
    background-color: #f1f3ff;
}
.wallet-item:hover {
    border: 1px solid rgba(48, 55, 66, 0.08);
    cursor: pointer;
}
.wallet-item .wallet-img {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    box-shadow: 1px 5px 10px 1px rgba(0, 0, 0, 0.35);
}
.wallet-item .wallet-label {
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    display: inline-block;
    font-size: 20px;
    margin-bottom: 0;
    margin-right: 10px;
    white-space: nowrap;
    color: #484568;
}
.wallet-item .actions {
    margin-top: 5px;
    text-align: left;
}
.wallet-item .wallet-address {
    font-size: 16px;
    color: #484568;
    text-align: left;
}
</style>

