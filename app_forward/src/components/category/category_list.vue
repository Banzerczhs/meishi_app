<template>
    <div class="custom-tree-container">
        <div
            class="block"
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">
            <p>所有分类</p>
            <el-tree
                :data="categoryData"
                :show-checkbox="false"
                empty-text="null"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="true">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.name }}</span>
                    <span class="control-btn">
                        <el-button
                            type="text"
                            size="mini"
                            @click.stop="() => edited(data)"
                        >编辑分类</el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click.stop="() => remove(data)"
                        >删除分类</el-button>
                    </span>
                </span>
            </el-tree>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Prop} from "vue-property-decorator";

    @Component
    export default class List extends Vue {
        @Prop({type : Boolean,default : false}) readonly isLoading : boolean;
        @Prop({type : Array,default : []}) readonly categoryData : Array<Object>;

        public edited(data:ANYOBJ){
            this.$router.push({name : 'edit_category',params : data});
        }

        public async remove(data:ANYOBJ){
            let {msg}=await this.$store.dispatch('cate/deleteCategory',{params : {id : data.id}});

            this.$alert(msg,'提示信息',{
                confirmButtonText: '确定'
            })
        }
    }
</script>

<style lang="less" scoped>
    .custom-tree-node{
        display: block;
        width: 100%;
        padding-top: 4px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 14px;
        .control-btn{
            float: right;
            margin-top: -5px;
            margin-right: 5px;
        }
    }
</style>