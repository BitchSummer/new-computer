<template>
	<div>
			<toolbar class="custom-toolbar">
					<span slot="right">
						<el-button size="small" type="primary" :disabled ="false" icon="el-icon-plus" @click="doAdd">新增调价</el-button>
					</span>
					<span slot="left">
						<el-radio-group v-model="queryParam.isValid" size="small">
							<el-radio-button label="">全部</el-radio-button>
							<el-radio-button label="未归档">只显示未归档</el-radio-button>
							<el-radio-button label="已归档">只显示已归档</el-radio-button>
						</el-radio-group>
					<el-input size="small" style="width: 180px;" placeholder="产品编码搜索...." v-model="queryParam.providerName"/>
					<el-input size="small" style="width: 180px;" placeholder="产品名称搜索...." v-model="queryParam.providerName"/>
		
					<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
					<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
				</span>
				</toolbar>
		<el-card>
		<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%">
			<el-table-column type="index" width="55" />
			<el-table-column resizable show-overflow-tooltip property="isAble" align="center" label="归档标识" width="100">
				<template slot-scope="scope">
					<el-tag size="medium" :type="scope.row.isValid=='已归档'?'success':'danger'">{{ scope.row.isValid }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="validDate" align="center" label="归档时间" width="180" />
			<el-table-column resizable show-overflow-tooltip property="priceNo" align="center" label="调价单号" width="150" />
			<el-table-column resizable show-overflow-tooltip property="effectDate" align="center" label="生效日期" width="100" />
			<el-table-column resizable show-overflow-tooltip property="priceTime" align="center" label="调价时间" width="180" />
			<el-table-column resizable show-overflow-tooltip property="priceUser" align="center" label="调价人" />
			<el-table-column resizable show-overflow-tooltip property="productCount" align="center" label="产品数" width="100" />
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" />
			<el-table-column label="操作" align="center" width="200">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
					<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
					<el-button size="mini" type="text"  @click="doAble(scope.row.id)">归档</el-button>
				</template>
			</el-table-column>
			
			
		</el-table>
		<div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
		</el-card>
		<price-record-form-win :config="priceRecordConfig" ref="FormWin"></price-record-form-win>
	</div>
</template>
<script>
	import {
		priceRecordPage,
		deletePriceRecord,
		ablePriceRecord
	} from "../../../api/productmgr-productprice.js"
	import PriceRecordFormWin from './price-record-form-win.vue'
	export default {
		components: {
			PriceRecordFormWin
		},
		data() {
			return {
				queryParam:{
          			isValid:''
				},
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: [],
				priceRecordConfig: {
					title: '产品调价记录', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1300px', //弹窗宽
					form:{
					},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				}
			}
		},
		methods: {
			doAdd(){
				this.$refs['FormWin'].empt()
				this.priceRecordConfig.form ={}
				this.priceRecordConfig.dialogVisible = true;
			},
			doEdit(row){
				this.priceRecordConfig.form ={...row}
				this.priceRecordConfig.dialogVisible = true;
			},
			doDel(id){
				this.$confirm("您确认删除产品调价单？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deletePriceRecord({
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
			doAble(id){
				this.$confirm("您确认归档产品调价单？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						ablePriceRecord({
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
			doSearch(page) {
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
				priceRecordPage({
					Vue: this,
					params: queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
					}
				})
			}
		}
	}
</script>
<style lang="less">
</style>
