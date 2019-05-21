<template>
    <div id="app" >
        <a-layout>
            <a-layout-header class="nav light">
                <nav-bar style="max-width: 1200px; margin: auto;"/>
            </a-layout-header>
            <a-layout-content style="padding-top: 64px;">
                <router-view/>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Route } from 'vue-router'
import NavBar from './components/NavBar.vue'
@Component({
    components: {
        NavBar
    }
})
export default class App extends Vue {
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
    overflow: auto;
    background-color: #fff;
}
#app > .ant-layout .ant-layout-content {
    min-height: calc(100% - 48px);
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
