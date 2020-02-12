<template>
    <div class="product_form">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
            <el-form-item label="食品名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="成品图上传" prop="cover" class="cover">
                <el-input type="hidden" v-model="formData.cover"></el-input>
                <el-upload
                    class="upload-btn"
                    action="http://localhost:9000/api/assets/cover"
                    :with-credentials="true"
                    :show-file-list="false"
                    :before-upload="coverBeforeUpload"
                    :on-success="handleSuccess"
                    :on-exceed="coverExceed"
                    :on-progress="handleProgress"
                    multiple
                    :limit="10">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">可批量上传图片，最多上传10张</div>
                </el-upload>
                <p class="upload_tip cover_tip"></p>
                <template #error="{error}">
                    <div class="el-form-item__error">{{error}}</div>
                </template>
                <section class="cover-list" v-show="filelist.cover.length">
                    <div v-for="(img,c) in filelist.cover" class="cover-card" :key="c">
                        <el-progress v-show="img.percenTage" :percentage="img.percenTage" type="circle" :width="145" :stroke-width="8"></el-progress>
                        <img :src="img.url" v-show="img.url"/>
                        <div class="cover-mask">
                            <el-button icon="el-icon-delete" circle size="medium" @click="delCover(c)"></el-button>
                        </div>
                    </div>
                </section>
            </el-form-item>
            <el-form-item label="独家产品" prop="isSole">
                <el-switch v-model="formData.isSole"></el-switch>
            </el-form-item>
            <el-form-item label="描述" prop="desc" class="desc">
                <el-input type="textarea" :rows="6" v-model="formData.desc" placeholder="请输入食品描述"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="cate">
                <el-select v-model="formData.cid" placeholder="请选择所属分类">
                    <el-option v-for="item in categoryData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="食材明细" prop="ingredients" class="ingredients">
                <el-input type="hidden" v-model="formData.ingredients.mainstuff.name"></el-input>
                <template #error="{error}">
                    <div class="el-form-item__error">{{error}}</div>
                </template>
                <div class="ingredients_item" v-for="(ingredient,key,index) in formData.ingredients">
                    <template v-if="index<=1">
                        <span>
                            {{ingredient.name}}：
                            <el-button
                                class="el-icon-edit"
                                circle
                                style="border:none;"
                                @click="editItemName(key,ingredient.name)"
                            ></el-button>
                        </span>
                        <div class="input_wrap" v-for="(item,n) in ingredient.data">
                            <el-input type="text" v-model="item.name" placeholder="食材名"></el-input>
                            <el-input type="text" v-model="item.value" placeholder="用量"></el-input>
                            <el-button
                                v-if="n!=0"
                                @click.prevent="removeItem(item,key)"
                                class="el-icon-delete"
                                style="border:none;"
                            ></el-button>
                        </div>
                        <el-button @click="addItem(key)" class="el-icon-plus" style="border:none;"></el-button>
                    </template>
                </div>
                <div class="ingredients_item" v-for="(ingredient,k) in formData.ingredients.rest" v-if="formData.ingredients.rest[k].data.length">
                    <span>
                        {{ingredient.name}}：
                        <el-button
                            class="el-icon-edit"
                            circle
                            style="border:none;"
                            @click="editItemName('rest',ingredient.name,k)"
                        ></el-button>
                    </span>
                    <div class="input_wrap" v-for="(item,n) in ingredient.data">
                        <el-input type="text" v-model="item.name" placeholder="食材名"></el-input>
                        <el-input type="text" v-model="item.value" placeholder="用量"></el-input>
                        <el-button
                            @click.prevent="removeItem(item,k,n)"
                            class="el-icon-delete"
                            style="border:none;"
                        ></el-button>
                    </div>
                    <el-button @click="addItem('rest',k)" class="el-icon-plus" style="border:none;"></el-button>
                </div>
                <el-button type="primary" @click="addIngredient">添加新食材组</el-button>
            </el-form-item>
            <el-form-item label="制作步骤" prop="step" class="step">
                <el-row>
                    <el-col :span="16" class="step_file">
                        <el-upload
                            class="upload_btn"
                            action="http://localhost:9000/api/assets/step"
                            :with-credentials="true"
                            :before-upload="stepBeforeUpload"
                            :on-progress="handleProgress"
                            :on-success="handleSuccess"
                            :show-file-list="false"
                            multiple>
                            <el-button size="small" type="primary" slot="trigger">批量上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <p class="upload_tip step_tip"></p>
                        <section v-for="(img,n) in formData.step">
                            <el-col :span="6" class="upload_wrap">
                                <el-upload
                                    class="upload_file"
                                    action="http://localhost:9000/api/assets/step"
                                    :show-file-list="false"
                                    :with-credentials="true"
                                    :before-upload="(file)=>stepBeforeUpload(file,n)"
                                    :on-progress="handleProgress"
                                    :on-success="handleSuccess">
                                    <el-progress v-show="filelist.step[n].percenTage" :percentage="filelist.step[n].percenTage" type="circle" :width="145" :stroke-width="8"></el-progress>
                                    <img v-if="img.url" :src="img.url" class="images">
                                    <template v-if="!img.url&&!filelist.step[n].percenTage">
                                        <i class="el-icon-plus uploader-icon"></i>
                                        <div class="el-upload__text"><em>点击上传步骤图片</em></div>
                                    </template>
                                </el-upload>
                            </el-col>
                            <el-col :span="12" :push="1" class="input_wrap">
                                <el-input type="textarea" placeholder="请输入步骤描述" v-model="img.content"></el-input>
                            </el-col>
                            <el-col :span="3" :push="1" style="margin-left: 10px;" class="control-btn">
                                <el-button size="small" @click="stepMove(n,'up')"><i class="el-icon-arrow-up"></i>上移一步</el-button>
                                <el-button size="small" @click="stepMove(n,'down')"><i class="el-icon-arrow-down"></i>下移一步</el-button>
                                <el-button size="small" @click="stepDelete(n)"><i class="el-icon-delete"></i>删除本步</el-button>
                                <el-button size="small" @click="stepPlus(n)"><i class="el-icon-plus"></i>添加一步</el-button>
                            </el-col>
                        </section>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="小窍门" prop="tips">
                <el-input type="textarea" :rows="6" v-model="formData.tips" placeholder="请输入相关小窍门"></el-input>
            </el-form-item>
            <el-button type="primary" @click="handleSubmit('ruleForm')" class="submit_btn">
                <slot name="submit_btnText"></slot>
            </el-button>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Prop} from "vue-property-decorator";

    interface DATAVALUE{
        name : string,
        value : string
    }

    interface FORMDATA{
        name : string,
        isSole : boolean,
        desc : string,
        cover : number,
        cid : number,
        ingredients : {
            mainstuff : {
                name : string,
                data : Array<DATAVALUE>
            },
            seconedstuff : {
                name : string,
                data : Array<DATAVALUE>
            },
            rest : Array<{
                name : string,
                data : Array<DATAVALUE>
            }>
        },
        step : Array<object>,
        tips : string
    }

    function changeProgress(arr,file){
        arr.forEach(item=>{
            if(item.uid==file.uid){
                if(file.response){
                    item.url=file.response.imgUrl;
                    item.percenTage=0;
                }else{
                    item.percenTage=Math.ceil(file.percentage);
                }
            }
        })
    }

    function initFormData() {
        return {
            name : '',
            isSole : false,
            cover : 0,
            desc : '',
            cid : 1,
            ingredients : {
                mainstuff :{
                    name : '主料',
                    data : [{
                        name : '',
                        value : ''
                    }]
                },
                seconedstuff : {
                    name : '辅料',
                    data : [{
                        name : '',
                        value : ''
                    }]
                },
                rest : [{
                    name : '其他食材',
                    data : [{
                        name : '',
                        value : ''
                    }]
                }]
            },
            step : [...new Array(3).fill(3).map(item=>({url : '',content : ''}))],
            tips : ''
        };
    }

    @Component
    export default class Edit extends Vue{
        private formData:FORMDATA = initFormData();
        private rules:object={
            name : [
                {required : true,message : '请输入食品名称',trigger : 'blur'}
            ],
            desc : [
                {min : 20,max : 1000,message : '最少不低于20字，最大不超过1000字',trigger : 'blur'}
            ],
            tips : [
                {min : 10,max : 1000,messgae : '最少不低于10个字，最大不超过1000字',trigger : 'blur'}
            ],
            cover : [
                {required : true,message : '请上传成品图',trigger : 'change'},
                {type : 'number',min : 1,message : '请最少上传1张图片',trigger : 'change'}
            ],
            ingredients : {
                type : 'object',
                required : true,
                validator(rule,value,callback){
                    let {mainstuff,seconedstuff,rest}=value;
                    rest=rest.map(item=>item.data);
                    let data=mainstuff.data.concat(seconedstuff.data,...rest);
                    if(!data.filter(item=>item.name&&item.value).length){
                        callback(new Error('请填写所需要的食材'));
                    }else{
                        callback();
                    }
                }
            }
        };
        private filelist:ANYOBJ={
            cover : [],
            step : [{},{},{}]
        };

        @Prop({type : Object,default : ()=>initFormData()}) productData;

        async created(){
            await this.$store.dispatch('cate/getCategory');
            if(this.productData.data){
                this.formData={...this.productData.data};
                this.filelist.step=[...this.productData.data.step];
                this.filelist.cover=[...this.productData.filelist.cover];
            }
        }

        get categoryData(){
            let data=this.$store.getters['cate/generateTree'];
            let newData=[];
            function deep(arr:Array){
                arr.forEach(cate=>{
                    if(cate.children.length){
                        deep(cate.children);
                    }
                    newData.push(cate);
                });
            }
            deep(data);
            return newData;
        }

        public editItemName(...rest){
            this.$prompt('请输入新的组名', '更改名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '邮箱格式不正确',
                closeOnClickModal: false,
                inputValue : rest[1]
            }).then(({ value })=>{
                rest[2]!==undefined?
                this.formData.ingredients[rest[0]][rest[2]].name=value:
                this.formData.ingredients[rest[0]].name=value;
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }

        public removeItem(item,key) {
            var ingredients;
            if(typeof key=="number"){
                ingredients=this.formData.ingredients.rest[key];
            }else{
                ingredients=this.formData.ingredients[key];
            }
            let index=ingredients.data.indexOf(item);
            if(index !== -1){
                ingredients.data.splice(index,1);
            }
        }

        public addItem(...rest){
            let ingredients;
            if(rest.length>1){
                ingredients=this.formData.ingredients[rest[0]][rest[1]];
            }else{
                ingredients=this.formData.ingredients[rest[0]];
            }
            ingredients.data.push({
                name : '',
                value : ''
            })
        }

        public delCover(id){
            this.filelist.cover.splice(id,1);
            this.formData.cover=this.filelist.cover.length;
        }

        public addIngredient(){
            this.formData.ingredients.rest.push({
                name : '其他食材',
                data : [{
                    name : '',
                    value : ''
                }]
            })
        }

        public stepMove(n,flag){
            let formDataItem,filelistItem,start;
            start=flag=='down'?n+1:n-1;

            if(start>=this.formData.step.length) {
                start=this.formData.step.length-1;
            }else if(start<0){
                start=0;
            }

            formDataItem=this.formData.step.splice(start,1,this.formData.step[n]);
            this.formData.step.splice(n,1,formDataItem[0]);
            filelistItem=this.filelist.step.splice(start,1,this.filelist.step[n]);
            this.filelist.step.splice(n,1,filelistItem[0]);
        }

        public stepDelete(n){
            this.formData.step=[...this.formData.step.filter((item,index)=>index!=n)];
        }

        public stepPlus(n){
            this.formData.step.splice(n+1,0,{
                url : '',
                content : ''
            })
            this.filelist.step.splice(n+1,0,{
                url : '',
                percenTage : 0
            })
        }

        public handleProgress(event,file){
            let tmpArr=this.filelist.cover.concat(this.filelist.step);
            changeProgress(tmpArr,file);
        }

        public coverBeforeUpload(file){
            this.beforeUploadFile(file,'cover');
        }

        public stepBeforeUpload(file,id){
            this.beforeUploadFile(file,'step',id);
        }

        public beforeUploadFile(file,key,id='undefined'){
            let result=false;
            const JPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if(!JPGorPNG){
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if(!isLt2M){
                this.$message.error('上传图片大小不能超过 2MB!');
            }

            if(JPGorPNG && isLt2M){
                if(key=="step"&&this.filelist.step.filter(item=>item.url!==undefined).length<this.formData.step.length){
                    if(id!=='undefined'){
                        this.filelist.step.splice(id,1,{
                            name : file.name,
                            uid : file.uid,
                            url : '',
                            percenTage : 0
                        });
                    }else{
                        this.filelist.step.unshift({
                            name : file.name,
                            uid : file.uid,
                            url : '',
                            percenTage : 0
                        });
                        this.filelist.step.pop();
                    }
                }else{
                    if(id!=='undefined'){
                        this.filelist[key].splice(id,1,{
                            name : file.name,
                            uid : file.uid,
                            url : '',
                            percenTage : 0
                        });
                    }else {
                        this.filelist[key].push({
                            name: file.name,
                            uid: file.uid,
                            url: '',
                            percenTage: 0
                        });
                        if(key=="step"){
                            this.formData.step.push({
                                url : '',
                                content : ''
                            });
                        }
                    }
                }
                result=true;
            }else{
                result=false;
            }

            return result;
        }

        public coverExceed(files,fileList){
            this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        }

        public handleSuccess(res,file,fileList){
            let $:JQueryStatic=(<any>this).$jq;
            if(this.filelist.cover.length){
                $('.cover_tip')
                .html(`本次共上传了${fileList.length}个文件，
                上传成功了${fileList.filter(item=>item.percentage==100).length}个`);
                this.formData.cover=fileList.length;
            }else{
                $('.cover_tip').html('');
            }

            if(this.filelist.step.filter(item=>item.uid).length){
                $('.step_tip')
                .html(`本次共上传了${fileList.length}个文件，
                上传成功了${fileList.filter(item=>item.percentage==100).length}个`);
            }else{
                $('.step_tip').html('');
            }

            let tmpArr=this.filelist.cover.concat(this.filelist.step);
            changeProgress(tmpArr,file);
            this.filelist.step.forEach((item,index)=>{
                item.url&&(this.formData.step[index].url=item.url);
            });
        }

        public handleSubmit(ref){
            this.$refs[ref].validate((valid) => {
                if (valid) {
                    let {formData,filelist}=this;
                    if(this.$route.name=='add_product'){
                        this.$emit('addProduct',{formData,filelist});
                    }else{
                        this.$emit('editProduct',{formData,filelist});
                    }
                } else {
                    this.$alert('你输入的信息有误，请检查后重新输入','提示信息',{
                        cancelButtonText : '确定'
                    });
                }
            });
        }
    }
</script>

<style lang="less" scoped>
    .product_form{
        padding: 0px 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        /deep/ .el-form-item__label{padding: 0;}
        /deep/ .el-form-item__content{line-height: normal;}
        .upload_tip{
            font-size: 12px;
            margin: 0 0 10px 0;
            line-height: normal;
            color: #00bf0f;
        }
        .desc{
            /deep/ textarea{
                resize: none;
            }
        }
        .cover{
            /deep/ .el-upload{
                width: auto;
                line-height: normal;
                height: auto;
                border: none;
                background-color: transparent;
            }
            .cover-list{
                .cover-card{
                    width: 145px;
                    height: 145px;
                    position: relative;
                    float: left;
                    border:dashed 1px #d9d9d9;
                    -webkit-border-radius: 4px;
                    -moz-border-radius: 4px;
                    border-radius: 4px;
                    margin-right: 10px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .el-progress{
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .cover-mask{
                        display: none;
                        background-color: rgba(0,0,0,0.4);
                        position: absolute;
                        left: 0px;
                        top: 0px;
                        width: 100%;
                        height: 100%;
                        .el-button{
                            background-color: transparent;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            border:none;
                            color: #fff;
                            font-size: 16px;
                            -webkit-transform: translate(-50%,-50%);
                            -moz-transform: translate(-50%,-50%);
                            -ms-transform: translate(-50%,-50%);
                            -o-transform: translate(-50%,-50%);
                            transform: translate(-50%,-50%);
                        }
                    }
                    &:hover{
                        .cover-mask{
                            display: block;
                        }
                    }
                }
                &::after{
                    content: '';
                    display: block;
                    clear: both;
                }
            }
        }
        .ingredients{
            .ingredients_item{
                position: relative;
                .el-icon-plus{
                    position: absolute;
                    top: 5px;
                    left: 872px;
                }
                .el-icon-edit{
                    opacity: 0;
                    -webkit-transition: all .3s;
                    -moz-transition: all .3s;
                    -ms-transition: all .3s;
                    -o-transition: all .3s;
                    transition: all .3s;
                    &:hover{
                        opacity: 1;
                    }
                }
                .el-icon-delete{
                    display: inline-block;
                    margin-left: 5px;
                }
                .input_wrap{
                    margin: 5px 0px;
                    .el-input{
                        width: 30%;
                        display: inline-block;
                        &:nth-of-type(1){
                            /deep/ input{
                                -webkit-border-radius: 4px 0px 0px 4px;
                                -moz-border-radius: 4px 0px 0px 4px;
                                border-radius: 4px 0px 0px 4px;
                            }
                        }
                        &:nth-of-type(2){
                            /deep/ input{
                                -webkit-border-radius: 0px 4px 4px 0px;
                                -moz-border-radius: 0px 4px 4px 0px;
                                border-radius: 0px 4px 4px 0px;
                            }
                        }
                    }
                }
            }
        }
        .step{
            .step_file {
                section {
                    line-height: normal;
                    height: 180px;
                    margin-bottom: 30px;
                    .upload_wrap,.input_wrap{
                        height: 100%;
                    }
                    .upload_file {
                        position: relative;
                        /deep/ .el-upload {
                            width: 100%;
                            height: 182px;
                            border: 1px dashed #d9d9d9;
                            border-radius: 6px;
                            cursor: pointer;
                            position: relative;
                            overflow: hidden;
                            .el-progress{
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%,-50%);
                            }
                            &:hover{
                                border-color: #409EFF;
                            }
                        }
                        .el-upload__text{
                            position: absolute;
                            width: 100%;
                            height: 30px;
                            bottom: 0px;
                            left: 0px;
                        }
                        .uploader-icon {
                            font-size: 28px;
                            color: #8c939d;
                            width: 100%;
                            line-height: 180px;
                            text-align: center;
                        }
                        .images {
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                    }
                    .el-textarea{
                        height: 100%;
                        /deep/ textarea{
                            height: 100%;
                            resize: none;
                        }
                    }
                    .control-btn{
                        .el-button{
                            margin: 0 0 5px 0;
                            position: relative;
                            i{
                                margin-left: -8px;
                                margin-right: 5px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>