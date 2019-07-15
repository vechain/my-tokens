<template>
    <a-icon :component="gs"></a-icon>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import GitterSvg from './GitterSvg.vue'

@Component
export default class GitterIcon extends Vue {
  private gs = GitterSvg
}
</script>
