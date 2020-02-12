<template>
    <div class="login_form">
        <h1 class="form_title">用户登录 <i class="iconfont icon-meishi_logo"></i></h1>
        <el-form
            :model="formData"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            label-position="left"
            :hide-required-asterisk="true">
            <el-form-item prop="username" ref="username">
                <template #default>
                    <i class="iconfont icon-yonghu"></i>
                    <input
                        type="text"
                        name="username"
                        v-model="formData.username"
                        placeholder="用户名/邮箱/手机号码"
                        autocomplete="off"
                        @blur="handleBlur"
                    >
                </template>
                <template #error="{error}">
                    <p class="form_msg">{{error}}</p>
                </template>
            </el-form-item>
            <el-form-item  prop="password" ref="password">
                <template #default>
                    <i class="iconfont icon-yonghuming"></i>
                    <input
                        type="password"
                        name="password"
                        v-model="formData.password"
                        placeholder="请输入密码"
                        @blur="handleBlur"
                        @keyup.enter="handleLogin('ruleForm')"
                    >
                </template>
                <template #error="{error}">
                    <p class="form_msg">{{error}}</p>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="handleLogin('ruleForm')"
                    class="login_btn"
                >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {Component,Vue} from "vue-property-decorator";
    import {accessLogin} from "@/request/access";

    @Component
    export default class Login extends Vue {
        private formData: object={
            username : '',
            password : ''
        }

        private rules: object={
            username : [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
            ],
            password : [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
            ]
        }

        public async handleLogin(ref:string){
            (<ANYOBJ>this.$refs[ref]).validate(async (valid:boolean)=>{
                if(valid){
                    let {username,password}=this.formData;
                    let {data}=await accessLogin({
                        method : 'post',
                        headers : {'Content-Type' : 'application/json'},
                        data : {
                            username,
                            password
                        }
                    })

                    this.$alert(data.msg,'提示信息',{
                        cancelButtonText : '确定',
                        callback: ()=>{
                            if(!data.code){
                                window.localStorage.setItem('user',JSON.stringify(data.data));
                                this.$router.push('/admin');
                            }
                        }
                    })
                }else{
                    this.$alert('数据信息填写有误，请检查后重新填写','错误信息',{
                        confirmButtonText: '确定'
                    })
                }
            })
        }

        public handleBlur(event:Event){
            let target:HTMLFormElement=<HTMLFormElement>event.target;
            (<Vue>this.$refs[target.name]).$emit('el.form.blur',target.value);
        }
    }
</script>

<style lang="less" scoped>
    .login_form{
        width: 100%;
        height: 100%;
        .form_title{
            font-weight: normal;
            font-size: 28px;
            margin: 0 0 40px 0;
            padding: 0;
            color: rgb(255, 208, 75);
            text-align: center;
            .icon-meishi_logo{
                font-size: 40px;
            }
        }
        .el-form-item{
            margin-bottom: 25px;
            text-align: right;
            .form_label{
                color: rgb(255, 208, 75);
            }
            .form_msg{
                font-size: 12px;
                color: rgb(255, 94, 0);
                margin: 5px 0px;
                line-height: 1px;
                padding-top: 4px;
                text-align: left;
                position: absolute;
                top: 100%;
                left: 0;
            }
            input{
                color: #fff;
                width: 100%;
                background-color: transparent;
                border: none;
                outline: none;
                border-bottom: solid 1px rgb(255, 208, 75);
                padding: 6px 0px 6px 25px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                &::-webkit-input-placeholder{
                    color: rgba(176, 174, 173, 0.73);
                }
            }
            .iconfont{
                color: rgb(255, 208, 75);
                width: 32px;
                height: 32px;
                position: absolute;
                left: -14px;
                top: 0;
            }
        }
        .login_btn{
            width: 200px;
            display: block;
            margin: 30px auto;
            margin-bottom: 0px;
            background-color: rgb(255, 208, 75);
            border:none;
            &:hover{
                background-color: rgb(255, 180, 68);
            }
        }
    }
</style>