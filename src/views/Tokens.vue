<template>
    <div style="padding: 20px 80px;">
        <h1>{{$t('wallets.token')}}</h1>
        <a-row type="flex" justify="start">
            <a-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                :xl="4"
                :xxl="3"
                v-for="(item, index) in tokenList"
                :key="index"
            >
                <token-card :item="item"></token-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Tokens extends Vue {
    get tokenList() {
        return (this.$store.state.tokens as app.Token[]).map((item) => {
            return {
                ...item
            }
        })
    }
}
</script>



