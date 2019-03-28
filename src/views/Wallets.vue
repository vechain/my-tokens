<template>
    <div class="wallet">
        <div class="wallet-list"></div>
        <div class="wallet-empty">
            <h1>Wallets</h1>
            <p>There is no wallet. You need to add a wallet first</p>
            <a-row type="flex">
                <a-col class="action" :span="12">
                    <a-icon type="wallet"/>
                    <p style="font-size: 16px">Observe</p>
                </a-col>
                <a-col class="action" :span="12">
                    <a-icon type="sync"/>
                    <p style="font-size: 16px">Import from Sync</p>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Wallets extends Vue {
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
</style>
