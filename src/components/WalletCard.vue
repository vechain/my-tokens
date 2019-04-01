<template>
    <div class="wallet-item">
        <a-row type="flex" style="height: 100%" align="middle">
            <a-col :xs="8">
                <img class="wallet-img" alt>
            </a-col>
            <a-col :xs="16" style="padding-left: 15px;">
                <div style="text-align: left; font-size: 14px;">
                    <span>
                        {{item.name + ' '}}
                        <a-icon v-if="!item.own" type="eye"/>
                    </span>
                    <br>
                    <span :title="item.address">{{item.address | shortAddress}}</span>
                </div>
                <div style="text-align: left;">
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
    width: 220px;
    height: 90px;
    border: 1px solid #a5a5a5;
}
.wallet-item .wallet-img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
}
</style>

