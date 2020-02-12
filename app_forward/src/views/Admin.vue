<template>
    <el-container>
        <el-header class="header">
            <h1 class="h1 fl"><i class="iconfont icon-meishi"></i>后台管理</h1>
            <el-dropdown class="fr" trigger="hover" :show-timeout="50" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">编辑个人资料</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside class="asidebar">
                <aside-bar></aside-bar>
            </el-aside>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
    import {Component,Mixins} from "vue-property-decorator";
    import AsideBar from "@/components/Asidebar.vue";
    import {accessLoginout} from "@/request/access";
    import {verification} from "@/utils";
    import emitter from "@/utils/emitter";

    @Component({
        components : {
            AsideBar
        }
    })
    export default class Admin extends Mixins(emitter) {
        private user: object={};

        async created(){
            verification.handler();
            this.user=JSON.parse(window.localStorage.getItem('user'));
            this.$store.dispatch('getUserInfoData');
        }

        public async handleCommand(command){
            if(command==='loginout'){
                let {data}=await accessLoginout();

                if(!data.code){
                    window.localStorage.removeItem('user');
                    clearInterval(verification.timer);
                    this.$router.push('/login');
                }
            }

            if(command==='edit'){
                if(this.$route.name!=='user'){
                    this.$router.push({name : 'user',params : {tabname : '我的个人资料'}});
                }else{
                    this.broadcast('User','switchTabs','我的个人资料');
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .header{
        -webkit-box-shadow: -10px -12px 10px 15px rgba(18, 25, 52, 0.5);
        -moz-box-shadow: -10px -12px 10px 15px rgba(18, 25, 52, 0.5);
        box-shadow: -10px -12x 10px 15px rgba(18, 25, 52, 0.5);
    }
    .asidebar{
        -webkit-box-shadow: -12px 24px 10px 15px rgba(18, 25, 52, 0.5);
        -moz-box-shadow: -12px 24px 10px 15px rgba(18, 25, 52, 0.5);
        box-shadow: -12px 24px 10px 15px rgba(18, 25, 52, 0.5);
        z-index: 10;
    }
    html,body,.el-container{
        height: 100%;
    }
    .main{
        background-color: transparent;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>