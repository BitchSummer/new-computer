<!--
  规格配置
 -->

<template>
  <toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
    <el-form :model="config.form" ref="form" :rules="rules" label-width="100px" class="view-form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="行业领域:" prop="industry">
            <el-select v-model="config.form.industry" placeholder="请选择" size="mini" multiple collapse-tags>
              <el-option :label="option.value" :value="option.value" v-for="(option,subIndex_) in industryOptions"
                         :key="subIndex_"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接口类型:" prop="apiClass">
            <el-select v-model="config.form.apiClass" placeholder="请选择" size="mini">
              <el-option :label="option.value" :value="option.value" v-for="(option,subIndex_) in apiClassOptions"
                         :key="subIndex_"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="接口名称:" prop="apiName">
            <el-input size="mini" v-model="config.form.apiName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专属应用:" prop="appId">
            <el-select v-model="config.form.appId" placeholder="请选择" size="mini">
              <el-option :label="option.appName" :value="option.id" v-for="(option,subIndex_) in appNameOptions"
                         :key="subIndex_"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口地址:" prop="apiUrl">
            <el-input size="mini" v-model="config.form.apiUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口说明:">
            <el-input size="mini" type="textarea" v-model="config.form.apiDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </toast>

</template>

<script>
  import {saveOrUpdateApi} from '../../../api/resourcemgr-apimgr.js'
  import {baseDataApi} from "../../../api/resourcemgr-apimgr.js"
  import {appListApi} from "../../../api/resourcemgr-apimgr.js"

  export default {
    props: ['config'],
    data() {
      return {
        rules: {
          industry: [{
            required: true,
            message: '请选择行业领域...',
            trigger: 'change',
          }],
          apiClass: [{
            required: true,
            message: '请选择接口分类...',
            trigger: 'change'
          }],
          apiName: [{
            required: true,
            message: '请输入接口名称...',
            trigger: 'change'
          }],
          appId: [{
            required: true,
            message: '请选择专属应用...',
            trigger: 'change'
          }],
          apiUrl: [{
            required: true,
            message: '请输入接口地址...',
            trigger: 'change'
          }]
        },
        industryOptions: {},
        apiClassOptions: {},
        appNameOptions: {}
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getSearchList({
          apiType: 'industry'
        }, (result) => {
          let temp = [];
          for (let item of  result.model) {
            temp.push({label: item.value, value: item.value, apiType: item.apiType});
          }
          this.industryOptions = temp
        });
        this.getSearchList({
          apiType: 'apiClass'
        }, (result) => {
          let temp = [];
          for (let item of  result.model) {
            temp.push({label: item.value, value: item.value, apiType: item.apiType});
          }
          this.apiClassOptions = temp
        });
        this.getAppList({
          apiType: 'appName'
        }, (result) => {
          this.appNameOptions = result.model
        })
      },
      getSearchList(params, cb = () => {
      }) {
        baseDataApi({
          Vue: this,
          params: params,
        }).then(result => {
          if ("function" == typeof(cb)) {
            cb(result);
          }
        });
      },
      getAppList(params, cb = () => {
      }) {
        appListApi({
          Vue: this,
          params: params,
        }).then(result => {
          if ("function" == typeof(cb)) {
            cb(result);
          }
        });
      },
      doSave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let tempForm = {...this.config.form}
            tempForm.industry = tempForm.industry.join(',');
            saveOrUpdateApi({
              Vue: this,
              params: tempForm
            }).then(res => {
              if (res.result) {
                this.config.dialogVisible = false;
                this.$emit("callback", this.config.form)
              }
            })
          }
        });
      },

    }
  }
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
  }
</style>
