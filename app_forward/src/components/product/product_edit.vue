<template>
    <p-common :productData="productData" @editProduct="editProduct">
        <template v-slot:submit_btnText>更新食品</template>
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
    export default class Edit extends Vue {
        name: "product_edit"
        private productData:object={};

        async created(){
            let params:any=this.$route.params;
            if(params.product){
                let stepGen=()=>{
                    let content=JSON.parse(params.product.product_step.content);
                    let pic=JSON.parse(params.product.product_step.pic);
                    let reference=content.length>pic.length?content:pic;
                    return reference.map((item,index)=>{
                        return {
                            url : pic[index],
                            content : content[index],
                            percenTage : 0
                        }
                    })
                };
                let product={
                    name : params.product.name,
                    isSole : params.product.isSole,
                    desc : params.product.desc,
                    cover : JSON.parse(params.product.cover).length,
                    cid : params.product.cid,
                    tips : params.product.tips,
                    ingredients : {
                        mainstuff :{
                            name : '主料',
                            data : params.product.product_ingredient.mainstuff
                                ?[...JSON.parse(params.product.product_ingredient.mainstuff).data]
                                :[{name : '',value : ''}]
                        },
                        seconedstuff : {
                            name : '辅料',
                            data : params.product.product_ingredient.secondstuff
                                ?[...JSON.parse(params.product.product_ingredient.secondstuff).data]
                                :[{name : '',value : ''}]
                        },
                        rest : params.product.product_ingredient.rest
                            ?[...JSON.parse(params.product.product_ingredient.rest).data]
                            :{name : '其他食材',data : [{name : '',value : ''}]}
                    },
                    step : stepGen()
                }
                this.productData={data : {...product},filelist : {cover : JSON.parse(params.product.cover).filter(url=>url).map(url=>({url}))}};
            }else{
                this.$router.replace({name : 'product'});
            }
        }

        public async editProduct(product){
            let {formData:{name,cid,desc,isSole,step,ingredients,tips},filelist:{cover}}=product;

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

            let {code,msg}=await this.$store.dispatch('product/updateProduct',{
                data : {productSchema,stepSchema,ingredientSchema},
                headers : {'Content-Type' : 'application/json'},
                params : {id : (<ANYOBJ>this.$route.params).product.id}
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