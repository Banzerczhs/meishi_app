<template>
    <div class="bg">
        <div class="wrap">
            <div class="wrap_cover">
                <img src="@/assets/images/cover.gif">
                <h3>欢迎来到美食工坊</h3>
                <p>这是一个功能很齐全的加工厂，无论是添加食材，还是更新美食配方，这里都能够满足您的需求。</p>
            </div>
            <div class="wrap_content">
                <div class="reg_btn">
                    <el-tooltip class="item" effect="dark" :content="!flag?'用户注册':'用户登录'" placement="right" >
                        <el-button @click="gotoPage">
                            <i :class="['iconfont',!flag?'icon-zhuce':'icon-denglu']"></i>
                        </el-button>
                    </el-tooltip>
                </div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Watch} from "vue-property-decorator";
    import anime from "animejs";

    @Component
    export default class Access extends Vue{
        private flag:boolean=false;
        private animState:object={};

        @Watch('$route',{deep:true,immediate:true})
        handle(){
            if(this.$route.name=='login'){
                this.flag=false;
            }else{
                this.flag=true;
            }
        }

        mounted(){
            let {$jq:$}=this;
            this.animState=anime.timeline({
                duration : 1500
            })

            this.animState.add({
                targets: '.wrap',
                opacity: 1,
                translateX: ['-50%','-50%'],
                translateY: ['-30%','-40%'],
                easing : 'easeInOutElastic(1, .6)'
            }).add({
                targets: '.wrap_cover',
                translateX: -($('.wrap').width()-15)/2,
                easing: 'spring(1, 80, 10, 0)'
            },"-=250").add({
                targets: '.wrap_content',
                translateX: ($('.wrap').width()-15)/2,
                easing: 'spring(1, 80, 6, 0)'
            },1380);
        }

        public gotoPage(){
            let name=!this.flag?'register':'login';
            let {$jq:$}=this;
            let value=($('.wrap').width()-15)/2;
            if(this.animState.completed){
                let animeline=anime.timeline({
                    duration : 600
                })

                animeline.add({
                    targets : '.wrap_content',
                    translateX : {
                        value : `-=${value*2}`,
                        easing: 'easeInOutQuart'
                    },
                    complete : ()=>{
                        this.$router.push({name});
                    }
                }).add({
                    targets : '.wrap_content',
                    translateX : {
                        value : `+=${value*2}`,
                        easing: 'easeInOutQuart'
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg{
        width: 100%;
        height: 100%;
        background: url('../assets/images/bgimg.jpg') no-repeat 0 0;
        -webkit-background-size: cover;
        background-size: cover;
    }
    .wrap{
        .publicCss(){
            background-color: rgba(46, 50, 52,1);
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            -webkit-box-shadow: -1px 0px 10px 2px rgba(37, 26, 59, 0.3);
            -moz-box-shadow: -1px 0px 10px 2px rgba(37, 26, 59, 0.3);
            box-shadow: -1px 0px 10px 2px rgba(37, 26, 59, 0.3);
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        opacity: 0;
        width: 350px;
        height: 600px;
        position: absolute;
        left: 50%;
        top: 40%;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
        .wrap_cover{
            .publicCss();
            position: absolute;
            -webkit-transform: translateX(0px);
            -moz-transform: translateX(0px);
            -ms-transform: translateX(0px);
            -o-transform: translateX(0px);
            transform: translateX(0px);
            width: 100%;
            height: 100%;
            color: rgb(255, 208, 75);
            z-index: 10;
            padding: 100px 0px 20px 0px;
            img{width: 100%;}
            h3{text-align: center;}
            p{text-indent: 2em;padding: 0px 30px;line-height: 25px;font-size: 14px;}
        }
        .wrap_content{
            .publicCss();
            width: 350px;
            height: 500px;
            margin-top: 50px;
            padding: 120px 40px 20px 40px;
            overflow: hidden;
            position: relative;
            .reg_btn{
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(52%,5%);
                -webkit-transform: translate(52%,5%);
                -moz-transform: translate(52%,5%);
                -o-transform: translate(52%,5%);
                -ms-transform: translate(52%,5%);
                .mask{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 36px;
                    height: 32px;
                }
                button{
                    width: 35px;
                    height: 30px;
                    padding: 0;
                    margin-left: -34px;
                    background-color: rgb(44, 48, 50);
                    color: rgb(255, 208, 75);
                    border: none;
                    box-shadow: 1px 1px 5px 1px rgb(29, 26, 40);
                    -webkit-border-radius: 15px 0px 0px 15px;
                    -moz-border-radius: 15px 0px 0px 15px;
                    border-radius: 15px 0px 0px 15px;
                    i{margin-left: 3px;}
                    &:hover{
                        box-shadow: 1px 1px 5px 3px rgb(29, 26, 40) inset;
                    }
                }
            }
        }
    }
</style>