<template>
  <div>
    {{item.name}}
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

declare type Wallet = {
  name: String,
  address: String
}
@Component
export default class WalletCard extends Vue {
  @Prop({default: {}})
  item!: Wallet
}
</script>
