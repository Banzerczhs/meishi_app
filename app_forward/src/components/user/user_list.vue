<template>
    <div>
        <el-table :data="userData">
            <el-table-column
                prop="username"
                label="用户名"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="phone"
                label="电话"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="identity"
                label="身份"
                align="center"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template v-slot="scope">
                    <el-button-group class="btn-group">
                        <el-button
                            @click.native.prevent="editUser(scope)"
                            type="text"
                            size="small"
                        >编辑</el-button>
                        <el-button
                            @click.native.prevent="deleteUser(scope)"
                            type="text"
                            size="small"
                        >移除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev,pager,next"
            :total="total"
            :hide-on-single-page="true"
            :page-size.sync="pageSize"
            :current-page.sync="currentPage"
            @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Prop} from "vue-property-decorator";

    @Component
    export default class UserList extends Vue{
        @Prop({type : Array,default : []}) userData:Array;
        @Prop({type : String,default : ''}) name:string;

        public editUser(node:ANYOBJ){
            this.$router.push({name : 'edit_user',params : {user : node.row}});
        }

        public async deleteUser(node:ANYOBJ){
            let {code}=await this.$store.dispatch('user/deleteUser',{params : {id : node.row.id},key : this.name=="客户端用户"?'clientUser':'adminUser'});
            if(!code){
                this.changePage(this.currentPage);
            }
        }

        public changePage(pageNum){
            if(this.name=='客户端用户'){
                this.$emit('getUserData',{currentPage : pageNum,identity : '客户'},'clientUser');
            }
            if(this.name=='后台系统用户'){
                this.$emit('getUserData',{currentPage : pageNum,identity : '管理员|合作者'},'adminUser');
            }
        }

        get currentPage(){
            if(this.name=="后台系统用户"){
                return this.$store.state.user.userData.adminUser.current_page;
            }else{
                return this.$store.state.user.userData.clientUser.current_page;
            }
        }

        set currentPage(val){
            if(this.name=="后台系统用户"){
                this.$store.commit('user/setCurrentPage',{key : 'adminUser',current_page : val});
            }else{
                this.$store.commit('user/setCurrentPage',{key : 'clientUser',current_page : val});
            }
        }

        get pageSize(){
            if(this.name=="后台系统用户"){
                return this.$store.state.user.userData.adminUser.page_size;
            }else{
                return this.$store.state.user.userData.clientUser.page_size;
            }
        }

        set pageSize(val){
            if(this.name=="后台系统用户"){
                this.$store.commit('user/setPageSize',{key : 'adminUser',page_size : val});
            }else{
                this.$store.commit('user/setPageSize',{key : 'clientUser',page_size : val});
            }
        }

        get total(){
            return this.$store.state.user.total;
        }
    }
</script>

<style lang="less" scoped>
    .el-table{
        .btn-group button{
            margin: 0 5px;
        }
    }
    .el-pagination{
        margin-top: 36px;
        text-align: center;
    }
</style>