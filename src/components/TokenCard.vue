<template>
    <div class="token-card">
        <div>
            <img
                :src="item.img"
                :alt="item.name"
            >
            <div class="token-name">
                <p>
                    <span>{{item.name}}</span>
                </p>
                <router-link class="go-transfer" :to="{name: 'transfer', query: {
                    symbol: item.symbol
                }}">Transfer</router-link>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TokenCard extends Vue {
    @Prop({ default: {} })
    public item!: app.Token
}
</script>

<style scoped>
.token-card {
    position: relative;
    margin: 30px auto 0;
}
.token-card > div,
.token-card:before,
.token-card {
    width: 155px;
    height: 180px;
    border-width: 0;
    background-color: #fff;
    border-radius: 4px;
}
.token-card > div {
  position: absolute;
}
.token-card:before {
    position: absolute;
    top: 0;
    content: "";
    display: block;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.35);
    transition: transform 0.2s;
}
.token-card img {
    margin-top: 15px;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: #eee;
    border-width: 0;
    transition: margin-top 0.2s;
}
.token-card:hover img {
    margin-top: 0;
}
.token-card .go-transfer {
    opacity: 0;
    transition: opacity 0.1s ease-out;
}
.token-card:hover .go-transfer {
    opacity: 1;
}
.token-card:hover:before {
    transform: scaleY(1.2) scaleX(1.1);
}
.token-card .token-name {
    margin-top: 15px;
}
</style>

