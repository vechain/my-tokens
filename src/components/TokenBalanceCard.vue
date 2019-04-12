<template>
    <a-card class="token-balance-card">
        <a-row type="flex">
            <a-col :xs="5">
                <div class="img" :style="background"></div>
                <!-- <img width="50" height="50" :src="item.img" :alt="item.name"> -->
            </a-col>
            <a-col :xs="17">
                <p class="card-summary">{{item.symbol}}</p>
                <p class="card-summary balance">{{item.balance}}</p>
            </a-col>
            <!-- <a-col :xs="7">
                <router-link
                    class="go-transfer"
                    :to="{name: 'transfer', query: {
                    symbol: item.symbol
                }}"
                >Transfer</router-link>
            </a-col>-->
        </a-row>
    </a-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TokenBalanceCard extends Vue {
    @Prop(Object)
    private item!: app.Balance & app.Token & { img: string }

    get background() {
        return `background-image: url('${this.item.img}')`
    }
}
</script>
<style>
.token-balance-card {
    transition: box-shadow 0.2s ease;
}
.token-balance-card .img {
    background-size: contain;
    border-radius: 50%;
    border: 2px solid #eee;
    width: 66px;
    height: 66px;
    background-position: center center;
    background-repeat: no-repeat;
}
.token-balance-card .card-summary {
    text-align: right;
    padding-left: 20px;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: bold;
}
.token-balance-card .balance {
    font-size: 14px;
    font-weight: lighter;
}

.token-balance-card:hover {
    cursor: pointer;
    box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
}
</style>

