<template>
    <div class="footer-bar">
        <a-row :gutter="8" type="flex" justify="end" align="middle">
            <a-col>
                <a-tooltip placement="top">
                    <template slot="title">
                        <span>Github</span>
                    </template>
                    <a-button
                        @click="openWindow('https://github.com/vechain/my-tokens')"
                        shape="circle"
                        icon="github"
                    ></a-button>
                </a-tooltip>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import GitterIcon from './GitterIcon.vue'

@Component({
    components: {
        GitterIcon
    }
})
export default class Corner extends Vue {
    private openWindow(url: string) {
        window.open(url)
    }
}
</script>
<style>
.footer-bar {
    height: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-top-left-radius: 3px;
    transition: all ease-in 0.2s;
    position: fixed;
    bottom: 0;
    right: 0;
}
.footer-bar * {
    opacity: 0;
}
.footer-bar:hover * {
    opacity: 1;
}
.footer-bar:hover {
    height: 40px;
    padding: 5px 20px;
}
</style>
