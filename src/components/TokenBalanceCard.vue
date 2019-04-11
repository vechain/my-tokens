<template>
    <a-card>
        <a-row type="flex">
            <a-col :xs="2">
                <img width="50" :src="item.img" :alt="item.name">
            </a-col>
            <a-col :xs="12">
                <span>{{item.name}}</span>
                <p>{{item.balance}}</p>
            </a-col>
            <a-col :xs="4">
                <router-link
                    class="go-transfer"
                    :to="{name: 'transfer', query: {
                    symbol: item.symbol
                }}"
                >Transfer</router-link>
            </a-col>
        </a-row>
    </a-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TokenBalanceCard extends Vue {
    @Prop(Object)
    private item!: app.Balance & app.Token
}
</script>
