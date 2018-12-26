<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<toolbar style="margin: 10px auto;">
			<span slot="left">
				<el-input size="small" style="width: 150px;" v-model="queryParam.apiName" placeholder="API名称搜索..."></el-input>
        <el-select size="small" v-model="queryParam.isPublish" @change="doSearch" placeholder="发布标识搜索..."><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
				<el-button icon="el-icon-search" size="small" style="width: 120px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="clean">清空条件</el-button>
			</span>
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" @click="doAdd">新增API</el-button>
			</span>
		</toolbar>

		<el-card>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doEdit">
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="isPublish" align="center" label="发布标识" width="120" />
				<el-table-column resizable show-overflow-tooltip property="publishTime" align="center" label="发布时间" width="180" />
				<el-table-column resizable show-overflow-tooltip property="industry" align="center" label="行业领域" width="120" />
				<el-table-column resizable show-overflow-tooltip property="apiClass" align="center" label="接口分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="apiName" align="center" label="API名称" width="150" />
				<el-table-column resizable show-overflow-tooltip property="apiDesc" align="center" label="接口描述" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="专属应用" width="150" />
				<el-table-column label="操作" align="center" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
						<span v-show="scope.row.isPublish =='未发布'">
				<!-- 		<el-button size="mini" type="text" @click="doPublish(scope.row.id,scope.row.isPublish)">发布</el-button> -->
						</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
		<form-win :config="formConfig" @callback="callBack"/>
	</div>
</template>
<script>
	import {
		apiPage,
		deleteApi,
		baseDataApi,
	} from '../../api/resourcemgr-apimgr.js'
	import FormWin from '../../components/resource-mgr/api-mgr/form-win.vue'
	export default {
		props: [''],
		data() {
			return {
        options: [{
          value: 'true',
          label: '已发布'
        },{
          value: 'false',
          label: '未发布'
        }],
				isDisable:true,
				classifiedConfig: [{
					title: '行业领域:',
					options: []
				}, {
					title: '接口分类:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				queryParam: {
				},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				apiClassMap: null,
				formConfig: {
					title: "API接口维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "800px", //弹窗宽
					form:{
					},
					btnData: [{
							isShow: true,
							name: "取消",
							bgColor: "dialog-normal",
							method: "cancel"
						}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}
					]
				},
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init(){
				this.getSearchList({
					apiType:'industry'
			  },(result)=>{
          let temp = [];
          for(let item of  result.model){
            temp.push({label: item.value,value: item.value,apiType: item.apiType});
          }
          this.classifiedConfig[0].options = temp;
          this.selectedItems[0].value=this.classifiedConfig[0].options[0].value;
          this.queryParam.industry=this.classifiedConfig[0].options[0].value;
          this.doSearch();
        });
        this.getSearchList({
            apiType: "apiClass"
        },(result)=>{
          let temp = [];
          for(let item of  result.model){
            temp.push({label: item.value,value: item.value,apiType: item.apiType});
          }
          this.classifiedConfig[1].options = temp;
          this.selectedItems[1].value=this.classifiedConfig[1].options[0].value;
          this.queryParam.apiClass =this.classifiedConfig[1].options[0].value;
          this.doSearch();
        });
      },
      clean(){
			  this.queryParam.apiName=null;
			  this.queryParam.isPublish=null
      },
			getSearchList(params,cb= ()=>{}){
        baseDataApi({
          Vue:this,
          params:params
        }).then(result =>{
          if("function" == typeof(cb))cb(result);
        });
			},
			doAdd(){
				this.formConfig.form ={
					industry:[]
				};
				this.formConfig.dialogVisible=true;
			},
			doEdit(row) {
				this.formConfig.form ={...row};
				this.formConfig.form.industry = this.formConfig.form.industry.split(',');
				this.formConfig.dialogVisible=true;
			},
			doDel(id) {
				this.$confirm("您确认删除Api接口？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteApi({
							Vue: this,
							params: {
								ids: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doClickHandler(index, option) {
				if (index == 0) {
					this.queryParam.industry =option.value;
					this.doSearch()
				} else if (index == 1) {
					this.queryParam.apiClass =option.value;
					this.doSearch()
				}
			},
			callBack(data){
			  this.selectedItems[0].value=data.industry[0];
        this.selectedItems[1].value=data.apiClass;
        this.queryParam.industry=data.industry[0];
        this.queryParam.apiClass=data.apiClass;
				this.doSearch()
			},
			doSearch(page) {
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo;
				param.pageSize = this.page.pageSize;
        apiPage({
          Vue: this,
          params: param
        }).then(res => {
          if (res.result) {
            this.tableData = res.model.items;
            this.page.total = res.model.numRows;
          }
        })
			}
		},
		components: {
			FormWin
		}
	}
</script>
<style lang="less">

</style>
