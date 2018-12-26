<template>
	<div>
		<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @selection-change="tableSelectChanged">
			<el-table-column type="selection" width="55"/>
			<el-table-column resizable show-overflow-tooltip property="isAble" align="center" label="启停标识" width="100">
				<template slot-scope="scope">
					<el-tag size="medium" :type="scope.row.isAble=='已启用'?'success':'danger'">{{ scope.row.isAble }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="productCode" align="center" label="产品编码" width="100" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称" />
			<el-table-column resizable show-overflow-tooltip property="resources" align="center" label="关联资源" width="150"  />
			<el-table-column resizable show-overflow-tooltip property="deliver" align="center" label="交付方式" width="150" />
			<el-table-column resizable show-overflow-tooltip property="unitGroupName" align="center" label="单位组" width="100" />
			<el-table-column resizable show-overflow-tooltip property="ableCount" align="center" label="启用规格数" width="100" />
			<el-table-column resizable show-overflow-tooltip property="disableCount" align="center" label="停用规格数" width="100" />

			<el-table-column label="操作" align="center" width="300">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
					<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
					<el-button size="mini" type="text">产品介绍</el-button>
					<el-button size="mini" type="text" @click="doAbleOrDisable(scope.row.isAble=='已启用'?'已停用':'已启用',scope.row.id)">{{scope.row.isAble=='已启用'?'已停用':'已启用'}}</el-button>
					<el-button size="mini" type="text" @click="doSpecConfig(scope.row)">规格配置</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
		<spec-config-win :config="specConfigWinConfig" 	@callback="doSearch"></spec-config-win>
	</div>
</template>
<script>
	import {
		productPage,
		deleteProduct,
		ableOrDisableProduct,
		productResourceList
	} from "../../../api/productmgr-productarchive.js"
	import SpecConfigWin from './spec-config-win.vue'
	export default {
		props: ['queryParam', 'productConfig','privateAttrs','configAttrs'],
		data() {
			return {
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: [],
				specConfigWinConfig: {
					title: '规格配置维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1500px', //弹窗宽
					productId : 0,
					configItems:[],//产品配置项 格式：[{title: '设备大类',options:[]}]
					configSelResult:[],
					productResourceList:[],
					btnData: [{
						isShow: true,
						disabled: false,
						name: '关闭窗口', //按钮名
						method: 'cancel', //回调函数
					}]
				}
			}
		},
		methods: {
			tableSelectChanged(selection){
				this.$emit("setSelectRows",selection)
			},
			doSpecConfig(_row){
				if(_row.configAttrs&&_row.configAttrs.length>0){
					this.specConfigWinConfig.productId =_row.id;
					console.log(_row.configAttrs)
					let configAttrs = JSON.parse(_row.configAttrs);//[{title: '设备大类',options:[]}]
					let configItems =[];
					let configSelResult =[];
					for(let configAttr in configAttrs){
						this.$set(this.specConfigWinConfig.configSelResult)
            // console.log(configAttr,configAttrs)
            let configAttrTemp = this.configAttrs.filter(item=>configAttr==item.id)[0]
            console.log(configAttr,this.configAttrs)
            configSelResult.push({title:configAttrTemp.alias,value:[]});
						configItems.push({
							title:configAttrTemp.alias,
							options:configAttrs[configAttr]
						})
					}
					this.specConfigWinConfig.configSelResult = configSelResult;
					this.$set(this.specConfigWinConfig,'configSelResult',configSelResult)
					this.specConfigWinConfig.configItems = configItems;
					
					if(_row.resource!='无'){
						productResourceList({
							Vue: this,
							params: {
								productId: _row.id
							}
						}).then(res => {
							if (res.result){
								this.specConfigWinConfig.productResourceList= res.model
								this.specConfigWinConfig.dialogVisible = true;
							}
								
						})
					}else
						this.specConfigWinConfig.dialogVisible = true;
					
				}else{
					this.$message({
						message: '该产品尚未维护规格配置...',
						type: 'warning'
					});
				}
			},
			doEdit(row) {
				let form = { ...row
				}
				if (form.publicAttrs == null || form.publicAttrs == '')
					form.publicAttrs = {}
				else
					form.publicAttrs = JSON.parse(form.publicAttrs);

				if (form.privateAttrs == null || form.privateAttrs == '')
					form.privateAttrs = {}
				else
					form.privateAttrs = JSON.parse(form.privateAttrs);

				if (form.configAttrs == null || form.configAttrs == '')
					form.configAttrs = {}
				else
					form.configAttrs = JSON.parse(form.configAttrs);
					
				this.productConfig.form = form
				if(row.resource!='无'){
					productResourceList({
						Vue: this,
						params: {
							productId: row.id
						}
					}).then(res => {
						if (res.result){
							this.productConfig.form.resourceList= res.model
							this.productConfig.dialogVisible = true;
						}
							
					})
				}else
					this.productConfig.dialogVisible = true;
				
			},
			doDel(id){
				this.$confirm("您确认删除产品档案？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteProduct({
							Vue: this,
							params: {
								id: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doAbleOrDisable(_op,id){
				this.$confirm("您确认" + _op.replace(/^已/,"") + "产品档案？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						ableOrDisableProduct({
							Vue: this,
							params: {
								id: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					}).catch(() => {

                	});
			},
      clearTable(){
        this.tableData.splice(0,this.tableData.length)
        this.page.total = 0;
        this.page.pageNo= 1;
      },
			doSearch(page) {
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
				productPage({
					Vue: this,
					params: queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
					}
				})
			}
		},
		components:{SpecConfigWin}
	}
</script>
<style lang="less">
</style>
