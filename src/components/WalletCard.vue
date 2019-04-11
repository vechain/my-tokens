<template>
    <div class="wallet-item">
        <a-row type="flex" style="height: 100%" align="middle">
            <a-col :xs="8">
                <img v-picasso="item.address" class="wallet-img" alt>
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
    box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
    border: 1px solid rgba(48, 55, 66, 0.06);
    border-radius: 3px;
    transition: box-shadow 0.2s ease, border 0.2s ease;
}
.wallet-item:hover {
    box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.25);
    border: 1px solid rgba(48, 55, 66, 0.08);
}
.wallet-item .wallet-img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
}
</style>

