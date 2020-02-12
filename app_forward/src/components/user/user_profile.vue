<template>
    <el-form ref="ruleForm" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username.value"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" v-show="formData.nickname.state">
            <el-input v-model="formData.nickname.value"></el-input>
        </el-form-item>
        <el-form-item :label="tabname!=='添加用户'?'新密码':'密码'" prop="password">
            <el-input v-model="formData.password.value" type="password" v-if="tabname=='添加用户'"></el-input>
            <template v-else>
                <el-button type="primary" size="medium" @click="createdPwd" v-if="!c_password">生成密码</el-button>
                <template v-else>
                    <el-input v-model="formData.password.value" :type="show_password?'text':'password'"></el-input>
                    <el-button size="small" @click="isShowPwd" :type="show_password?'primary':''">查看密码</el-button>
                    <el-button size="small" @click="resetPwd">取消</el-button>
                </template>
            </template>
        </el-form-item>
        <el-form-item label="电话" prop="phone" v-show="formData.phone.state">
            <el-input v-model="formData.phone.value"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email.value"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" v-show="formData.birthday.state">
            <el-date-picker type="date" placeholder="选择日期" v-model="formData.birthday.value"></el-date-picker>
        </el-form-item>
        <el-form-item label="个人简介" prop="profile" v-show="formData.profile.state">
            <el-input  type="textarea" v-model="formData.profile.value"></el-input>
        </el-form-item>
        <el-form-item label="用户禁用" prop="disable" v-show="formData.disable.state">
            <el-switch v-model="formData.disable.value"></el-switch>
        </el-form-item>
        <el-form-item label="vip" prop="vip" v-show="formData.isVip.state">
            <el-switch v-model="formData.isVip.value"></el-switch>
        </el-form-item>
        <el-form-item label="身份" prop="identity" v-show="formData.identity.state">
            <el-select v-model="formData.identity.value" placeholder="请选择用户身份" @change="changeSelect">
                <el-option label="管理员" value="Administrator"></el-option>
                <el-option label="合作者" value="Collaborator"></el-option>
                <el-option label="客户" value="Customer"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender" v-show="formData.gender.state">
            <el-radio-group v-model="formData.gender.value">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                <el-radio label="保密"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="用户头像" v-show="formData.uimg.state">
            <el-upload
                class="avatar-uploader"
                ref="upload_img"
                action="http://localhost:9000/api/assets/avatar"
                :auto-upload="true"
                :on-success="handleAvatarSuccess"
                :on-progress="handleAvatarProgress"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
                :with-credentials="true">
                <img v-show="formData.uimg.value" :src="formData.uimg.value" class="avatar">
                <el-progress v-show="percenTage" :percentage="percenTage" type="circle" :width="150" :stroke-width="8"></el-progress>
                <i v-show="!formData.uimg.value&&!percenTage" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{tabname}}</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
    import {Component,Prop,Mixins} from "vue-property-decorator";
    import emitter from '@/utils/emitter';
    import {RoleMap} from "@/config/user";

    interface DATAVALUE{
        value : any,
        state : boolean
    }

    interface FROMDATA{
        username: DATAVALUE,
        password: DATAVALUE,
        phone: DATAVALUE,
        email: DATAVALUE,
        disable: DATAVALUE,
        isVip : DATAVALUE,
        identity: DATAVALUE,
        nickname: DATAVALUE,
        gender: DATAVALUE,
        uimg: DATAVALUE,
        profile: DATAVALUE,
        birthday: DATAVALUE
    }

    function initFields(){
       return {
            username : {
                value : '',
                state : true
            },
            password : {
                value : '',
                state : true
            },
            phone : {
                value : '',
                state : true
            },
            email : {
                value : '',
                state : true
            },
            disable : {
                value : false,
                state : true
            },
            identity : {
                value : 'Customer',
                state : true
            },
            nickname : {
                value : '',
                state : true
            },
            gender: {
                value : '保密',
                state : true
            },
            uimg : {
                value : '',
                state : true
            },
            profile : {
                value : '',
                state : true
            },
            birthday : {
                value : '',
                state : true
            },
            isVip : {
                value : false,
                state : true
            }
        };
    }

    let id_state;
    @Component
    export default class Profile extends Mixins(emitter){
        @Prop({type : String,default : '更新用户'}) tabname:string;

        private name:string='Profile';
        private formData:FROMDATA=initFields();
        private rules:object={
            username : {
                type: "object", required: true,trigger : 'blur',
                fields : {
                    value: [
                        {required: true, message: '你还没有输入用户名'},
                        {min: 3, max: 8, message: '长度在3到8个字符之间'}
                    ]
                }
            },
            nickname : {
                type: "object",trigger : 'blur',
                fields : {
                    value : {min : 3,max : 8,message : '字符长度在3到8个字符之间'}
                }
            },
            password : {
                type: "object", required: true,trigger : 'blur',
                fields : {
                    value : [
                        {required : true,message : '你还没有输入用户密码'},
                        {min : 6,max : 32,message : '字符长度在6到32个字符之间'}
                    ]
                }
            },
            phone : {
                type: "object",trigger : 'blur',
                fields : {
                    value : {pattern : /^1\d{10}$/,message : '您输入的手机号码格式有误'}
                }
            },
            email : {
                type: "object", required: true,trigger : 'blur',
                fields : {
                    value : [
                        {required : true,message : '你还没有输入用户密码'},
                        {
                            type : 'email',
                            pattern : /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                            message : '您输入的邮箱格式不正确',
                            trigger : 'blur'
                        }
                    ]
                }
            }
        }
        private percenTage:number=0;
        private c_password:boolean=false;
        private show_password:boolean=false;

        created(){
            if(!(<ANYOBJ>this.$route.params).user){
                this.$route.name!=='user'&&this.$router.replace({name : 'user'});
                this.tabname=="更新个人资料"&&this.getUserinfo();
            }else{
                let {user}=this.$route.params;
                for(let attr in this.formData){
                    if(user[attr]==='——'){
                        if(attr=='isVip'||attr=='disable'){
                            this.formData[attr].value=false;
                        }else{
                            if(attr=='uimg'){
                                this.formData[attr].value=null;
                            }else{
                                this.formData[attr].value='';
                            }
                        }
                    }else{

                        this.formData[attr].value=user[attr];
                    }
                }
                let permission=Object.keys(RoleMap).filter(key=>{
                    return RoleMap[key]==(<ANYOBJ>user).identity;
                })[0];
                id_state=permission;
                this.formData.identity.value=permission;
                this.changeSelect(permission);
            }
            if(this.tabname!=="添加用户"){
                this.rules.password.required=false;
                this.rules.password.fields.value[0].required=false;
            }
            this.$on('getUserInfo',this.getUserinfo);
            this.$on('initUserInfo',()=>this.formData=initFields());
        }

        public changeSelect(val){
            if(val==='Administrator'||val==='Collaborator'){
                this.formData.birthday.state=false;
                this.formData.profile.state=false;
                this.formData.gender.state=false;
                this.formData.isVip.state=false;
                val==='Administrator'
                ?(this.formData.disable.state=false)
                :(this.formData.disable.state=true);
            }else{
                for (let attr in this.formData) {
                    this.formData[attr].state=true;
                    if(!this.formData[attr].value){
                        this.formData[attr].value=initFields()[attr].value;
                    }
                }
            }
        }

        public onSubmit(ref:string){
            (<ANYOBJ>this.$refs[ref]).validate(async (valid)=>{
                if(valid){
                    let {username,password,phone,
                        nickname,email,identity,
                        gender,uimg,profile,
                        birthday,isVip,disable}=this.formData;

                    let userSchema=this.fieldsClassified({username,password,phone,email,identity,disable});
                    let profileSchema=this.fieldsClassified({nickname,gender,uimg,profile,birthday,isVip});

                    let dispatch,responseData:ANYOBJ={data:{userSchema,profileSchema},idMod : id_state!=identity.value};
                    responseData.key=identity.value!="Customer"?'adminUser':'clientUser';
                    if(this.tabname==='添加用户'){
                        dispatch='user/addUser';
                    }else{
                        let uid=(<ANYOBJ>this.$route.params).user
                            ?(<ANYOBJ>this.$route.params).user.id
                            :this.$store.state.userInfo.data.id;
                        dispatch='user/updateUser';
                        responseData.params={id : uid};
                        this.tabname==="更新个人资料"&&this.$store.commit('userInfoModify',true);
                    }

                    let {msg}=await this.$store.dispatch(dispatch,{
                        ...responseData,
                        headers:{'Content-Type':'application/json'}
                    });
                    this.$alert(msg,'提示信息',{
                        confirmButtonText : '确定',
                        callback : ()=>{
                            this.resetForm();
                            if((<ANYOBJ>this.$route.params).user){
                                this.$router.replace({name : 'user'});
                            }else{
                                this.dispatch('User','switchTabs');
                            }
                        }
                    })
                }else{
                    this.$alert('您输入的信息有误，请检查后重新输入','提示信息',{
                        confirmButtonText : '确定'
                    });
                }
            })
        }

        public createdPwd(){
            this.c_password=true;
            let codes=[']','[','\\','$','#',2,3,5,7,1,'-',9,0,4,6,8,'+'];
            let str='';
            for (var i=0;i<codes.length;i++){
                str+=codes[Math.floor(Math.random()*codes.length)];
            }
            this.formData.password.value=str;
            this.formData.password.state=true;
        }

        public resetPwd(){
            this.c_password=false;
            this.formData.password.value='';
            this.formData.password.state=false;
        }

        public isShowPwd(){
            this.show_password=!this.show_password;
        }

        public resetForm(){
            this.formData=initFields();
        }

        public handleAvatarSuccess(res) {
            this.percenTage=0;
            this.formData.uimg.value = res.imgUrl;
            this.$message.success('头像上传成功');
        }

        public handleAvatarProgress(event,file){
            this.percenTage=Math.ceil(file.percentage);
        }

        public beforeAvatarUpload(file) {
            const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPGorPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPGorPNG && isLt2M;
        }

        public fieldsClassified(obj){
            let newObj={};
            Object.keys(obj).filter(key=>{
                return obj[key].value&&obj[key].state;
            }).forEach(key=>{
                if(key=='identity'){
                    newObj[key]=RoleMap[obj[key].value];
                }else {
                    newObj[key]=obj[key].value;
                }
            });

            return newObj;
        }

        public async getUserinfo(){
            this.formData.identity.state=false;
            this.formData.isVip.state=false;
            this.formData.disable.state=false;
            this.c_password=false;
            this.show_password=false;
            if(!Object.keys(this.$store.state.userInfo.data).length||this.$store.state.userInfo.modify){
                let {code}=await this.$store.dispatch('getUserInfoData');
                if(!code){
                    init.call(this);
                }
            }else{
                init.call(this);
            }
            function init(){
                let data=this.$store.getters['filterUserInfo'];
                for (let attr in this.formData){
                    if(attr=='uimg'&&data[attr]=='——'){
                        this.formData[attr].value=null;
                    }else{
                        this.formData[attr].value=data[attr];
                        if(!this.formData[attr].value){
                            this.formData[attr].value=initFields()[attr].value;
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .avatar-uploader{
        width: 150px;
        height: 150px;
        /deep/ .el-upload{
            width: 100%;
            height: 100%;
            cursor: pointer;
            position: relative;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            overflow: hidden;
            .el-progress{
                position: absolute;
                left: 0;
                top: 0;
            }
            &:hover{
                border-color: #409EFF;
            }
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }
    .avatar {
        width: 150px;
        height: 150px;
        display: block;
    }
    .el-form-item{
        margin-bottom: 25px;
    }
</style>