<template>
    <div style="height: 100%;">
        <el-tabs type="border-card" class="tabs-card" v-show="show" v-model="activeTabs">
            <el-tab-pane label="分类列表" name="list" :lazy="true">
                <category-list
                    :isLoading="isLoading"
                    :categoryData="generateTree"
                ></category-list>
            </el-tab-pane>
            <el-tab-pane label="添加分类" name="form" :lazy="true">
                <edit-category
                    :show="show"
                    @switchTabs="changeTabs"
                ></edit-category>
            </el-tab-pane>
        </el-tabs>
        <router-view v-show="!show" @switchTabs="changeTabs"></router-view>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Watch} from "vue-property-decorator";
    import CategoryList from "@/components/category/category_list.vue";
    import EditCategory from "@/components/category/category_edit.vue";
    import {Route} from "vue-router";

    @Component({
        components : {
            CategoryList,
            EditCategory
        }
    })
    export default class Category extends Vue {
        private isLoading: boolean=false;
        private show: boolean=true;
        private activeTabs: string='list';

        @Watch('$route',{deep : true,immediate : true})
        isShow(val: Route){
            if(val.name=='edit_category'){
                this.show=false;
            }else{
                this.show=true;
            }
        }

        async created(){
            if(!this.generateTree.length){
                this.isLoading=true;
                let {code,msg}=await this.$store.dispatch('cate/getCategory');
                this.$alert(msg,'提示信息',{
                    confirmButtonText : '确定'
                })
                if(!code){
                    this.isLoading=false;
                }
            }
        }

        get generateTree(){
            return this.$store.getters['cate/generateTree'];
        }

        public changeTabs(){
            if(this.$route.name=='edit_category'){
                this.$router.back();
            }
            this.activeTabs='list';
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