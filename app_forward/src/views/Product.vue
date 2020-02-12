<template>
    <div class="product_wrap">
        <template v-if="!show">
            <product-list @addProduct="addProduct" @editProduct="editProduct" @deleteProduct="deleteProduct"></product-list>
        </template>
        <template v-else>
            <router-view></router-view>
        </template>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Watch} from "vue-property-decorator";
    import ProductList from "@/components/product/product_list";

    @Component({
        components : {
            ProductList
        }
    })
    export default class Product extends Vue{
        private name:string="Product";
        private show:boolean=false;

        @Watch('$route',{immediate : true,deep : true})
        handler(val){
            if(val.name=='product'){
                this.show=false;
            }else{
                this.show=true;
            }
        }

        public addProduct(){
            this.show=true;
            this.$router.push({name : 'add_product'});
        }

        public editProduct(payload){
            this.show=true;
            this.$router.push({name : 'edit_product',params : {product : {...payload}}});
        }

        public deleteProduct(id){
            let {msg,code}=this.$store.dispatch('product/deleteProduct',{params : {id}});
            if(!code){
                this.$alert(msg,'提示信息',{
                    cancelButtonText : '确定',
                    callback : ()=>{
                        this.$store.commit('product/setProductModify',true);
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>