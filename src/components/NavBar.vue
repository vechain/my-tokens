<template>
    <a-row type="flex" justify="space-between">
        <a-col :span="8">
            <a-row type="flex" justify="start">
                <div class="logo">
                    <router-link :to="{name: 'wallets'}">
                        <img width="157px" src="../assets/logo.png" alt="Logo" />
                    </router-link>
                </div>
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
        <a-col :span="3">
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
    </a-row>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { langList } from '../lang'
@Component
export default class NavBar extends Vue {
    public current: any[] = []
    public langs = langList
    public created() {
        this.routed()
    }
    @Watch('$route')
    public routed() {
        this.current = [this.$route.meta.key]
    }
}
</script>

