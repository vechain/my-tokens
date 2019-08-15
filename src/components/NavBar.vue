<template>
    <a-row type="flex" justify="space-between">
        <a-col :span="8">
            <a-row type="flex" justify="start">
                <div class="logo">
                    <router-link :to="{name: 'wallets'}">
                        <img src="../assets/logo.png" alt="Logo" />
                    </router-link>
                </div>
            </a-row>
        </a-col>
        <a-col class="hide-small" :span="12">
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
        <a-col class="hide-small" :span="3">
            <a-row type="flex" align="bottom" justify="space-around">
                <a-col :span="16">
                    <a-select
                        class="select-re-theme"
                        dropdownClassName="select-list-rebg"
                        style="width: 100px"
                        v-model="$i18n.locale"
                        defaultValue="en"
                    >
                        <a-select-option
                            v-for="item in langs"
                            :key="item.value"
                            :value="item.value"
                        >{{item.text}}</a-select-option>
                    </a-select>
                </a-col>
            </a-row>
        </a-col>
        <a-col class="hide-gt-small" :span="16">
            <a-row type="flex" justify="end" :gutter="2">
                <a-col :span="8" style="text-align: right">
                    <a-select
                        class="select-re-theme"
                        dropdownClassName="select-list-rebg"
                        style="width: 100%; max-width: 100px"
                        v-model="currentS"
                        @select="onRouteChange"
                        defaultValue="wallets"
                    >
                        <a-icon slot="suffixIcon" type="bars" />
                        <a-select-option value="wallets">Wallets</a-select-option>
                        <a-select-option value="transfer">Transfer</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="8" style="text-align: right">
                    <a-select
                        class="select-re-theme"
                        dropdownClassName="select-list-rebg"
                        style="width: 100%; max-width: 100px"
                        v-model="$i18n.locale"
                        defaultValue="en"
                    >
                        <a-icon slot="suffixIcon" type="global" />
                        <a-select-option
                            v-for="item in langs"
                            :key="item.value"
                            :value="item.value"
                        >{{item.text}}</a-select-option>
                    </a-select>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { langList } from '../lang'
@Component
export default class NavBar extends Vue {
    public current: any[] = []
    public currentS: 'wallets' | 'transfer' = 'wallets'
    public langs = langList
    public collapsed = false
    public created() {
        this.routed()
    }
    @Watch('$route')
    public routed() {
        this.current = [this.$route.meta.key]
        this.currentS = this.$route.meta.key
    }

    public onRouteChange(v: string) {
        this.$router.push({ name: v })
    }
}
</script>
<style>
.logo,
.logo img {
    width: 157px;
}
@media (max-width: 576px) {
    .logo,
    .logo img {
        width: 100%;
        max-width: 100px;
    }
    .ant-layout-header {
        padding: 0 10px;
    }
}

</style>

