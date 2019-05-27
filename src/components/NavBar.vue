<template>
    <a-row type="flex" justify="space-between">
        <a-col :span="12">
            <a-row type="flex" justify="start">
                <div class="logo">VeChain</div>
            </a-row>
        </a-col>
        <a-col :span="12">
            <a-row type="flex" justify="end">
                <a-col>
                    <a-menu v-model="current" mode="horizontal">
                        <a-menu-item key="wallets">
                            <router-link :to="{name: 'wallets'}">{{$t('navBar.wallets')}}</router-link>
                        </a-menu-item>
                        <a-menu-item key="transfer">
                            <router-link :to="{name: 'transfer'}">{{$t('navBar.transfer')}}</router-link>
                        </a-menu-item>
                    </a-menu>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class NavBar extends Vue {
    public current: any[] = []

    @Watch('$route')
    public routed() {
        this.current = [this.$route.meta.key]
    }
}
</script>

