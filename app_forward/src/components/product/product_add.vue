<template>
    <p-common @addProduct="addProduct">
        <template v-slot:submit_btnText>添加食品</template>
    </p-common>
</template>

<script lang="ts">
    import {Component,Vue} from "vue-property-decorator";
    import common from "./common";

    @Component({
        components : {
            PCommon : common
        }
    })
    export default class Add extends Vue{
        name: "product_add"

        public async addProduct(data){
            let {formData:{name,cid,desc,isSole,step,ingredients,tips},filelist:{cover}}=data;

            cover=JSON.stringify(cover.map(item=>item.url));
            let {uid}=this.$store.getters['filterUserInfo'];
            let productSchema={name,cid,desc,isSole,cover,uid,tips};

            let contents=JSON.stringify(step.map(item=>item.content));
            let pics=JSON.stringify(step.map(item=>item.url));
            let stepSchema={content : contents,pic : pics};

            let ingredientSchema={
                mainstuff : JSON.stringify({data : [...ingredients.mainstuff.data]}),
                secondstuff : JSON.stringify({data : [...ingredients.seconedstuff.data]}),
                rest : JSON.stringify({data : [...ingredients.rest]})
            };

            let {code,msg}=await this.$store.dispatch('product/addProduct',{
                data : {productSchema,stepSchema,ingredientSchema},
                headers : {'Content-Type' : 'application/json'}
            });

            if(!code){
                this.$alert(msg,'提示信息',{
                    cancelButtonText : '确定',
                    callback : ()=>{
                        this.$router.replace({name : 'product'});
                        this.$store.commit('product/setProductModify',true);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>