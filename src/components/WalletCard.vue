<template>
  <div>
    {{item.name}}
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

declare interface Wallet {
  name: string,
  address: string
}
@Component
export default class WalletCard extends Vue {
  @Prop({default: {}})
  public item!: Wallet
}
</script>
