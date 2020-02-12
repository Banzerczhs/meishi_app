<template>
    <el-row>
        <el-col>
            <el-menu
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                mode="vertical"
                :default-active="activeMenuIndex"
                :router="true">
                <template v-for="item in menus">
                    <el-menu-item :key="item.name" :index="item.path">
                        <span>
                            <i :class="item.icon"></i>
                            {{item.text}}
                        </span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import asideMenuData from "@/data/AsideMenuData.ts";
    import {ISTATE} from "@/store";

    @Component
    export default class AsideBar extends Vue {
        private menus: Array<Object>=[];

        created(){
            this.menus=asideMenuData;
        }

        get activeMenuIndex(){
            let state= (<ISTATE>this.$store.state);
            return state.activeMenu;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-menu{
        border-right: none;
    }
</style>
