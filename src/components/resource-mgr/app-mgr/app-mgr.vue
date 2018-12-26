<template>
	<div>
		<toolbar>
			<span slot="left">
				<!-- <el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="服务商搜索..."></el-input> -->
				<el-input size="small" style="width: 150px;" v-model="queryParam.appName" placeholder="应用名称搜索"></el-input>
		
	<!-- 			<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedStorage" placeholder="支持云存储搜索..."></el-input> -->
  <el-select size="small" style="width: 150px;" v-model="queryParam.isNeedStorage"  placeholder="支持云存储搜索">
    <el-option v-for="item in arrList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
    </el-option>
  </el-select>
<!-- 			 	<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedMsg" placeholder="支持短信搜索"></el-input>   -->
   <el-select  size="small" style="width: 150px;" v-model="queryParam.isNeedMsg" placeholder="支持短信搜索">
    <el-option v-for="item in msgList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
    </el-option>
  </el-select>
        <el-select size="small" style="width: 150px;" v-model="queryParam.isPublish" placeholder="发布标识搜索">
    <el-option v-for="item in rageList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
    </el-option>
  </el-select>
				<!-- <el-input size="small" style="width: 150px;" v-model="queryParam.isPublish" placeholder="发布标识搜索"></el-input> -->
				<el-button icon="el-icon-search" size="small" style="width: 120px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
			</span>

			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" @click="doAdd">新增APP</el-button>
			</span>
		</toolbar>
		<el-card style="clear:both;">
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doView">
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="industry" align="center" label="行业领域" width="120" />
				<el-table-column resizable show-overflow-tooltip property="appClass" align="center" label="应用分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="应用名称" />
				<el-table-column resizable show-overflow-tooltip property="isNeedStorage" align="center" label="支持云存储" width="120" />
				<el-table-column resizable show-overflow-tooltip property="isNeedMsg" align="center" label="支持短信" width="120" />
				<el-table-column resizable show-overflow-tooltip property="isPublish" align="center" label="发布标识" width="120" />
				<el-table-column resizable show-overflow-tooltip property="publishTime" align="center" label="发布时间" width="180" />
				<el-table-column resizable show-overflow-tooltip property="historyAuthCompanyCount" align="center" label="累计授权"
				 width="120" />
				<el-table-column resizable show-overflow-tooltip property="authCompanyCount" align="center" label="当前授权" width="120" />
				<el-table-column label="操作" align="center" width="200">						
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
						<el-button size="mini" type="text" @click="doMenuMaintain(scope.row.id)">菜单维护</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
		<app-view-win :config="viewConfig" />
		<app-win :config="appConfig" ref="appWin" @doSave="doSave"/>
		<menu-win :config="menuConfig" />
	</div>
</template>
<script>
import {
  appPage,
  deleteApp,
  selectByEdit,
  saveOrUpdateApp
} from "../../../api/resourcemgr-appmgr.js";
import AppWin from "./app-win.vue";
import AppViewWin from "./app-view-win.vue";
import MenuWin from "./menu-win.vue";
export default {
  props: ["config"],
  data() {
    return {
      arrList:[
        {
          value:1,
          label:'是'
        },
        {
          value:0,
          label:'否'
        },
      ],
      rageList:[
       {
          value:0,
          label:"未发布"
        },
        {
          value:1,
          label:"已发布"
        },
      ],
      msgList:[
        {
          value:1,
          label:'是'
        },
        {
          value:0,
          label:'否'
        },
      ],
      tempForm: {},
      queryParam: {},
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      appClassMap: null,
      appConfig: {
        title: "APP应用维护", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "1000px", //弹窗宽
        form: {
          appName: null,
          appClass: null,
          industry: null,
          appUrl: null,
          authUrl: null,
          appDesc: null,
          isNeedStorage: null,
          isNeedMsg: null,
          appImgUrl: null
        },
        rules: {
          appName: [
            {
              required: true,
              message: "请输入应用名称",
              trigger: "blur"
            }
          ],
          appClass: [
            {
              required: true,
              message: "请选择应用分类",
              trigger: "change"
            }
          ],
          industry: [
            {
              required: true,
              message: "请选择行业领域",
              trigger: "change"
            }
          ],
          appUrl: [
            {
              required: true,
              message: "请输入应用地址",
              trigger: "blur"
            }
          ],
          authUrl: [
            {
              required: true,
              message: "请输入授权地址",
              trigger: "blur"
            }
          ],
          appImgUrl: [
            {
              required: true,
              message: "请上传应用图片",
              trigger: "change"
            }
          ]
        },
        btnData: [
          {
            isShow: true,
            name: "取消",
            bgColor: "dialog-normal",
            method: "cancel"
          },
          {
            isShow: true,
            name: "保存",
            bgColor: "dialog-deep-blue",
            method: "doSave"
          }
        ]
      },
      viewConfig: {
        title: "APP应用查看", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "1000px", //弹窗宽
        form: {},
        btnData: [
          {
            isShow: true,
            name: "关闭窗口",
            bgColor: "dialog-normal",
            method: "cancel"
          }
        ]
      },
      menuConfig: {
        title: "应用菜单维护", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "1000px", //弹窗宽
        form: {

        },
        btnData: [
          {
            isShow: true,
            name: "关闭窗口",
            bgColor: "dialog-normal",
            method: "cancel"
          }
        ]
      }
    };
  },
  watch: {
    //   tempForm:{
    // 	  deep:true,
    // 	  handler:()=>{
    // 		  console.log(222,this.tempForm)
    // 	  }
    //   }
  },
  methods: {
    doSave(page) {
      this.$refs["appWin"].$refs["appForm"].$refs["form"].validate(valid => {
        if (valid) {
          let tempForm = { ...this.appConfig.form };
          tempForm.industry = tempForm.industry.join(",");
          this.value1 = tempForm.industry;
          this.value2 = tempForm.appClass;
          console.log(this.value1, this.value2, "value1value2");

          saveOrUpdateApp({
            Vue: this,
            params: tempForm
          }).then(res => {
            if (res.result) {
			  this.$set(this.appConfig, "dialogVisible", false);
			  this.config[0].value=this.value1
	          this.config[1].value=this.value2
	          this.doSearch(page)
            }
          });
        }
	  });

    },
    doAdd() {
      this.appConfig.menuList = [];
      this.appConfig.form = {
        industry: [],
        isNeedStorage: "false",
        isNeedMsg: "false"
      };
      this.appConfig.dialogVisible = true;
    },
    doEdit(row) {
      this.appConfig.dialogVisible = true;
      console.log(row, row.id, "pppppppppp");
      selectByEdit({
        Vue: this,
        params: {
          id: row.id
        }
      }).then(res => {
        this.appConfig.form = {
          ...res.model
        };
        console.log(this.appConfig.form);
        this.appConfig.form.industry = this.appConfig.form.industry.split(",");
      });

      /* 	this.appConfig.form = { ...row
				};
				this.appConfig.form.industry = this.appConfig.form.industry.split(',')
				this.appConfig.dialogVisible = true; */
    },
    doView(row) {
      this.viewConfig.form = {
        ...row
      };
     this.viewConfig.form.industry = this.viewConfig.form.industry.split(',')  
      this.viewConfig.dialogVisible = true;
    },
    doDel(id) {
      this.$confirm("您确认删除应用APP？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteApp({
          Vue: this,
          params: {
            id: id
          }
        }).then(res => {
          if (res.result) this.doSearch();
        });
      });
    },
    //应用菜单维护打开
    doMenuMaintain(appId) {
      this.menuConfig.appId = appId;
      this.menuConfig.dialogVisible = true;
    },
    doSearch(page) {
      let param = { ...this.queryParam };
      param.industry = this.config[0].value;
      param.appClass = this.config.length == 2 ? this.config[1].value : "";
      if (page == null || page.pageNo == null) {
        this.page.pageNo = 1;
      }
      param.pageNo = this.page.pageNo;
      param.pageSize = this.page.pageSize;
      appPage({
        Vue: this,
        params: param
      }).then(res => {
        if (res.result) {
          this.tableData = res.model.items;
          this.page.total = res.model.numRows;
        }
      });
    }
  },
  components: {
    AppWin,
    MenuWin,
    AppViewWin
  }
};
</script>
<style lang="less">
</style>
