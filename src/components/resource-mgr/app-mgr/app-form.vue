<!--
  规格配置
 -->

<template>
  <el-form :model="config.form" ref="form" :rules="config.rules" label-width="100px" class="view-form">
    <el-row>
      <el-col :span="12">
        <el-form-item label="应用名称:" prop="appName">
          <el-input size="mini" v-model="config.form.appName"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="应用类型:" prop="appClass">
          <el-select size="mini" v-model="config.form.appClass" placeholder="请选择应用类型">
            <el-option v-for="item in appClassOption" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="行业领域:" prop="industry" style="margin-top:20px">
          <el-select size="mini" v-model="config.form.industry" style="width: 98%;" multiple placeholder="请选择行业领域">
            <el-option v-for="item in industryOption" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="应用地址:" prop="appUrl" style="margin-top:20px">
          <el-input size="mini" v-model="config.form.appUrl"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="授权地址:" prop="authUrl" style="margin-top:20px">
          <el-input size="mini" v-model="config.form.authUrl"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="应用说明:" style="margin-top:20px">
          <el-input size="mini" type="textarea" v-model="config.form.appDesc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="支持云存储:" style="margin-top:20px">
          <el-radio-group size="mini" v-model="config.form.isNeedStorage">
            <el-radio-button label="true">必须具备</el-radio-button>
            <el-radio-button label="false">暂无需求</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="支持短信:" style="margin-top:20px">
          <el-radio-group size="mini" v-model="config.form.isNeedMsg">
            <el-radio-button label="true">必须具备</el-radio-button>
            <el-radio-button label="false">暂无需求</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="应用图标:" prop="appImgUrl" style="margin-top:20px">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="uploadImg"
            :before-upload="imageUploadCheck">
            <img v-if="config.form.appImgUrl " :src="config.form.appImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="imgTips">建议尺寸:80*80;且不超过500kb </span>
          <el-input size="mini" type="textarea" v-model="config.form.appImgUrl" style="display:none"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {
    imageUploadCheck
  } from "../../../api/fileupload-base.js";
  import {
    saveOrUpdateApp,
    appSurveyList,
    appClass,
    appPage
  } from "../../../api/resourcemgr-appmgr.js";
  	import {uploadUrl} from '../../../api/common.js'
  export default {
    props: ["config"],
    data() {
      return {
        industryOption: [],
        appClassOption: [],
        uploadUrl: uploadUrl
      };
    },
    methods: {
      uploadImg(res, file) {
          this.$nextTick(_ => {
            this.$set(this.config.form, "appImgUrl", res.fileUrl);
          });
      },
      imageUploadCheck(file) {
        return imageUploadCheck(file);
      }
      //app应用维护保存
      // doSave(){
      // 	this.$refs['form'].validate((valid) => {
      // 		if(valid) {
      // 			let tempForm = {...this.config.form}
      // 			tempForm.industry = tempForm.industry .join(',')
      // 			this.value1=tempForm.industry
      // 			this.value2=tempForm.appClass
      // 			this.tempForm=tempForm;
      // 			console.log(0,this.tempForm)
      // 			console.log(this.value1,this.value2,"value1value2")

      // 			saveOrUpdateApp({
      // 				Vue: this,
      // 				params: tempForm
      // 			}).then(res => {
      // 				if (res.result) {
      // 				  	this.$set(this.config,'dialogVisible',false)
      // 					this.$emit("appSave",tempForm );
      // 				}

      // 			})
      // 		}
      // 	});

      // }
    },
    mounted() {
      //行业领域下拉
      appSurveyList({
          Vue: this,
          params: {
            type: "industry"
          }
        }).then(res => {
          this.industryOption = res.model;
          console.log(res, "res1");
        }),
        //应用分类下拉
        appClass({
          Vue: this,
          params: {
            appType: "appClass"
          }
        }).then(res => {
          this.appClassOption = res.model;
          console.log(res, "res2");
        });
    }
  };

</script>
<style lang="less">
  .view-form {
    margin: auto 20px;

    h1 {
      font-size: 15px;
      margin: 15px auto;
    }

    .el-form-item {
      margin-bottom: 5px;
    }

    .avatar-uploader {
      float: left;
      padding-left: 10px;

      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .avatar {
        width: 80px;
        height: 80px;
      }

      .el-upload:hover {
        margin-left: 20px;
        border-color: #409eff;
      }
    }

    .imgTips {
      font-size: 12px;
      color: #666;
      margin-left: 10px;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 78px;
      text-align: center;
    }
  }

</style>
