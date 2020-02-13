<template>
    <div
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
        <el-row :gutter="30">
            <el-col :span="4" v-for="item in ProductList" :key="item.id">
                <div @click="editProduct(item.id)">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                        <img :src="JSON.parse(item.cover)[0]" class="image">
                        <div class="card_desc">
                            <span class="p_name">{{item.name}}</span>
                            <div class="bottom clearfix">
                                <time class="u_name">{{item.product_user.username}}</time>
                            </div>
                        </div>
                        <el-button icon="el-icon-delete" class="delete_btn" circle @click.stop="deleteProduct(item.id)"></el-button>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            class="plus_btn"
            style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
            @click="addProduct"
        ></el-button>
    </div>
</template>

<script lang="ts">
    import {Component,Vue} from "vue-property-decorator";

    @Component
    export default class List extends Vue {
        name: "product_list"
        private loading:boolean=false;

        async created(){
            if(this.$store.state.product.modify||!this.ProductList.length){
                this.loading=true;
                let {code,msg}=await this.$store.dispatch('product/getProduct');
                if(!code){
                    this.loading=false;
                    this.$alert(msg,'提示信息',{
                        cancelButtonText : '确定',
                        callback : ()=>{
                            this.$store.commit('product/setProductModify',false);
                        }
                    })
                }
            }
        }

        public addProduct(){
            this.$emit('addProduct');
        }

        public editProduct(id){
            let payload=this.ProductList.filter(item=>item.id==id)[0];
            this.$emit('editProduct',payload);
        }

        public deleteProduct(id){
            this.$emit('deleteProduct',id);
        }

        get ProductList(){
            return this.$store.state.product.productData;
        }
    }
</script>

<style lang="less" scoped>
    .el-card{
        position: relative;
        padding: 55px 10px 10px 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        margin-bottom: 20px;
        img{
            width: 170px;
            height: 150px;
            display: block;
            margin: 0 auto;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        .card_desc{
            margin-top: 20px;
            margin-bottom: 10px;
            text-align: center;
            .clearfix{
                margin-top: 5px;
            }
        }
        .delete_btn{
            position: absolute;
            right: 5px;
            top: 7px;
            border:none;
        }
    }
    .plus_btn{
        position: absolute;
        right: 30px;
        bottom: 30px;
        &::after{
            width: 90%;
            height: 90%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            content: '';
            position: absolute;
            left: 0px;
            top: 0px;
            border:solid 2px #ffffff;
        }
    }
</style>