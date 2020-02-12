<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {sessionMsg} from "@/utils";

    @Component
    export default class App extends Vue {

        created(){
            sessionMsg.handler=sessionMsg.handler.bind(this);
        }
    }
</script>

<style lang="less" scoped>
</style>