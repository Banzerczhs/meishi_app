<template>
    <div class="category-form">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="别名" prop="alias">
                <el-input v-model="formData.alias" placeholder="“别名”是在URL中使用的别称，它可以令URL更美观"></el-input>
            </el-form-item>
            <el-form-item label="父级分类列表" prop="parent">
                <el-select v-model="formData.pid" placeholder="请选择父级分类目录">
                    <el-option label="无" :value="0"></el-option>
                    <el-option v-for="item in parentData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">{{show?'创建':'更新'}}</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {Vue,Component,Prop} from "vue-property-decorator";

    interface FROMDATA{
        name: string,
        alias: string,
        pid: number
    }

    @Component
    export default class Edit extends Vue {
        @Prop({type : Boolean,default : false}) readonly show: boolean;

        private formData: FROMDATA = {
            name: '',
            alias: '',
            pid: 0
        };
        private rules: Object = {
            name: [
                { required: true, message: '这个是菜品的类别名称', trigger: 'blur' },
                { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
            ],
            alias: [
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
                {pattern : /^[a-z,A-Z,0-9]+$/,message : '通常使用小写，只能包含字母或数字，以字母开头',trigger: 'blur'}
            ],
            parent: [
                {validator : this.filterPid,trigger : 'blur'}
            ]
        };

        created(){
            if(Object.keys(this.$route.params).length){
                let {name,alias,pid,id}=this.$route.params;
                this.formData.name=name;
                this.formData.alias=alias;
                this.formData.pid=Number((pid=='0'?id:pid));
            }else{
                this.$route.name!='category'&&this.$router.replace({name : 'category'});
            }
        }

        get parentData(){
            return this.$store.getters['cate/generateTree'];
        }

        public filterPid(rule:any, value:any, callback:Function){
            let {id}=this.$route.params;

            if(id==(<ANYOBJ>this.formData).pid){
                callback(new Error('选择的父级id与该分类id相同'));
            }else{
                callback();
            }
        }

        public submitForm(formName:string) {
            (<ANYOBJ>this.$refs[formName]).validate(async (valid:boolean)=>{
                if(valid){
                    let {name,pid,alias}=<FROMDATA>this.formData;
                    alias=alias?alias:name;
                    let requestData,dispatch;
                    if(this.show){
                        dispatch='cate/addCategory';
                        requestData={
                            data:{name,pid,alias},
                            headers:{'Content-Type':'application/json'}
                        }
                    }else{
                        dispatch='cate/updateCategory';
                        requestData={
                            data:{name,pid,alias},
                            headers:{'Content-Type':'application/json'},
                            params : {id : (<ANYOBJ>this.$route.params).id}
                        }
                    }
                    let {msg}=await this.$store.dispatch(dispatch,requestData);
                    this.alertMsg(msg,'提示信息',valid);
                }else{
                    this.alertMsg('数据信息填写有误，请检查后重新填写','错误信息',valid);
                }
            })
        }

        public resetForm(formName:string) {
            (<ANYOBJ>this.$refs[formName]).resetFields();
        }

        public alertMsg(msg:string,title:string,valid:boolean){
            this.$alert(msg, title, {
                confirmButtonText: '确定',
                callback : ()=>{
                    if(valid){
                        this.$emit('switchTabs');
                    }
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    .category-form{
        padding: 40px 20px 0px 20px;
        .form-tip{
            font-size: 14px;
            margin: 0;
            padding: 0;
        }
    }
</style>