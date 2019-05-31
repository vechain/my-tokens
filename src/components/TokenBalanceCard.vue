<template>
    <a-card v-on="$listeners" class="token-balance-card">
        <a-row type="flex" align="middle" justify="space-between">
            <a-col :xs="5">
                <div class="img" :style="background"></div>
            </a-col>
            <a-col :xs="19">
                <p
                    ref="balance"
                    class="card-summary balance"
                >
                    <span>{{item.balance | balance}}</span>
                    <span class="card-summary">{{item.symbol}}</span>
                </p>
            </a-col>
        </a-row>
    </a-card>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
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
    background-color: #f1f3ff;
    border-radius: 4px;
}
.token-balance-card .img {
    background-size: contain;
    border-radius: 50%;
    /* border: 2px solid #eee; */
    width: 40px;
    height: 40px;
    background-position: center center;
    background-repeat: no-repeat;
    box-shadow: 1px 8px 15px 1px rgba(0, 0, 0, 0.25);
}
.token-balance-card .card-summary {
    text-align: right;
    padding-left: 3px;
    font-family: Open Sans, Hiragino Sans GB, monospace, serif;
    font-size: 14px;
    font-weight: bold;
    color: #596a7a;
}
.token-balance-card .balance {
    font-size: 24px;
    font-weight: lighter;
    margin-bottom: 0;
    font-family: Open Sans, Hiragino Sans GB, monospace, serif;
    color: #9194a4;
}

.token-balance-card:hover {
    cursor: pointer;
    box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
}
</style>

