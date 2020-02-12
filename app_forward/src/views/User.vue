<template>
    <el-tabs
        type="border-card"
        class="tabs-card"
        v-if="!show"
        :value="currentTabs"
        :before-leave="changeTabs"
        @tab-click="clickTab">
        <el-tab-pane name="后台系统用户" label="后台系统用户"
             v-loading="isLoading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
            :lazy="true">
            <h3>后台系统用户</h3>
            <user-list :userData="userList" @getUserData="getUserData" :name="currentTabs"></user-list>
        </el-tab-pane>
        <el-tab-pane name="客户端用户" label="客户端用户"
             v-loading="isLoading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             :lazy="true">
            <h3>客户端用户</h3>
            <user-list :userData="userList" @getUserData="getUserData" :name="currentTabs"></user-list>
        </el-tab-pane>
        <el-tab-pane name="添加用户" label="添加用户" :lazy="true">
            <user-profile tabname="添加用户"></user-profile>
        </el-tab-pane>
        <el-tab-pane name="我的个人资料" label="我的个人资料" :lazy="true">
            <user-profile tabname="更新个人资料"></user-profile>
        </el-tab-pane>
    </el-tabs>
    <router-view v-else></router-view>
</template>

<script lang="ts">
    import {Component,Watch,Mixins} from "vue-property-decorator";
    import UserProfile from "@/components/user/user_profile";
    import UserList from "@/components/user/user_list";
    import emitter from "@/utils/emitter";

    @Component({
        components : {
            UserProfile,
            UserList
        }
    })
    export default class User extends Mixins(emitter){
        private name:string='User';
        private isLoading:boolean=false;
        private currentTabs:string='后台系统用户';
        private show:boolean=false;

        @Watch('$route',{deep : true,immediate : true})
        handler(val){
            val.params.tabname&&(this.currentTabs=val.params.tabname);  //点击导航栏上的编辑个人信息之后跳转的tab标签
            if(val.name==='edit_user'){
                this.show=true;
            }else{
                this.show=false;
                this.changeTabs(this.currentTabs);
            }
        }

        async created(){
            this.$on('switchTabs',(name)=>{
                this.currentTabs=name||'后台系统用户';
            });
        }

        public async getUserData(params,key){
            this.isLoading=true;
            let {code,msg}=await this.$store.dispatch('user/getUser',{params,key});
            this.$alert(msg,"提示信息",{
                confirmButtonText : '确认'
            });
            if(!code){
                this.isLoading=false;
                this.$store.commit('user/userDataModify',false);
            }
        }

        public changeTabs(name){
            this.currentTabs=name;
            let {modify,userData:{adminUser,clientUser}}=this.$store.state.user;
            if((!adminUser.data.length||!clientUser.data.length)||modify){
                let identity,key,pagenum;
                if(name=='后台系统用户'){
                    identity='管理员|合作者';
                    key='adminUser';
                    pagenum=adminUser.current_page;
                }else{
                    identity='客户';
                    key="clientUser";
                    pagenum=clientUser.current_page;
                }
                this.getUserData({currentPage : pagenum,identity},key);
            }
            this.clickTab({name});
        }

        public async clickTab(event){
            if(event.name==='我的个人资料'){
                this.broadcast('Profile','getUserInfo');
            }
            if(event.name=="添加用户"){
                this.broadcast('Profile','initUserInfo');
            }
        }

        get userList(){
            if(this.currentTabs=="后台系统用户"){
                return this.$store.getters['user/getUserData'].adminUser;
            }else{
                return this.$store.getters['user/getUserData'].clientUser;
            }
        }

        destroyed(){
            this.$off('switchTabs');
        }
    }
</script>

<style lang="less" scoped>
    .tabs-card{
        height: 100%;
        box-sizing: border-box;
        position: relative;
        /deep/ .el-tabs__header{
            position: absolute;
            left: 0;
            z-index: 10;
            width: 100%;
        }
        /deep/ .el-tabs__content{
            position: absolute;
            left: 0;
            right: 0;
            top: 39px;
            bottom: 0px;
            overflow-y: auto;
        }
    }
</style>