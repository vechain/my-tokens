<template>
    <div id="app">
        <a-layout :class="{plants: bgClass}">
            <a-layout-header :class="navClass" class="nav light">
                <nav-bar style="max-width: 1200px; margin: auto;" />
            </a-layout-header>
            <a-layout-content ref="content" style="padding-top: 64px;">
                <a-alert v-if="isConnexOk" banner>
                    <span slot="description" v-html="msg"></span>
                </a-alert>
                <router-view />
            </a-layout-content>
            <Corner />
        </a-layout>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Route } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Corner from './components/Corner.vue'
@Component({
    components: {
        NavBar,
        Corner
    }
})
export default class App extends Vue {
    private isConnexOk = (window.connex && window.connex.version !== '1.2.3')
    private syncLink = 'https://env.vechain.org/r/#' + encodeURIComponent(location.href)

    private navClass = ''

    get msg() {
        return this.$t('msg.require_connex', { url: this.syncLink })
    }
    get bgClass() {
        return this.$route.name === 'wallets'
            && (this.$store.state.wallets && this.$store.state.wallets.length === 0)
    }

    public mounted() {
        let timer: any
        (this.$refs.content as Vue).$el.addEventListener('scroll', (e: Event) => {
            if (timer) { clearTimeout(timer) }
            timer = setTimeout(() => {
                if ((e.target as HTMLElement).scrollTop > 100) {
                    this.navClass = 'full'
                } else {
                    this.navClass = ''
                }
            }, 300)
        })
    }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    height: 100%;
}
#app > .ant-layout {
    height: 100%;
    overflow: hidden;
    background-color: #fff;
}
#app > .ant-layout .ant-layout-content {
    height: calc(100% - 48px);
    overflow: auto;
}
#app .nav {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #e8e8e8;
    position: fixed;
    width: 100%;
    z-index: 11111;
}
#app .nav.light {
    background-color: #fff;
}

.text-monospace {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
}
</style>
