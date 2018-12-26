<template>
	<div>
		<toolbar>
			<span slot="left">
				<el-radio-group v-model="queryParam.status" size="small" @change="doSearch1" >
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="未结清">未结清</el-radio-button>
					<el-radio-button label="已结清">已结清</el-radio-button>
				</el-radio-group>
				<el-input size="small" style="width: 150px;" v-model="queryParam.name" placeholder="客户名称搜索..."  />
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary" @click="doSearch2">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="doReset">清空条件</el-button>
			</span>
		</toolbar>
		  <el-table  ref="table" height="600" :data="tableData" style="width: 100%" border stripe @selection-change="tableSelectChanged" @row-click="tableRowClick">
			<el-table-column type="selection" align="center" width="50" />
		  	<el-table-column resizable show-overflow-tooltip property="customerName"  label="客户名称" align="center"/>
			<el-table-column resizable show-overflow-tooltip property="lastTradeDate"  label="最近交易日" width="110" align="center"/>

			<el-table-column resizable show-overflow-tooltip label="订单信息" align="center">
				<el-table-column resizable show-overflow-tooltip property="finishOrderCount" align="center" label="完成订单"  />
				<el-table-column resizable show-overflow-tooltip property="processOrderCount" align="center" label="交易中" />
				<el-table-column resizable show-overflow-tooltip property="allOrderCount" align="center" label="小计" />
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip label="开票信息" align="center">
				<el-table-column resizable show-overflow-tooltip property="processOrderInvoice" align="center" label="流程中" />
				<el-table-column resizable show-overflow-tooltip property="payedOrderInvoice" align="center" label="已开票" />
				<el-table-column resizable show-overflow-tooltip property="noPayOrderInvoice" align="center" label="未开票" />
				<el-table-column resizable show-overflow-tooltip property="allOrderInvoice" align="center" label="小计"  />
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip label="结算信息" align="center">
				<el-table-column resizable show-overflow-tooltip property="processOrderBalance" align="center" label="流程中"  />
				<el-table-column resizable show-overflow-tooltip property="payedOrderBalance" align="center" label="已结算" />
				<el-table-column resizable show-overflow-tooltip property="noPayOrderBalance" align="center" label="未结算"  />
				<el-table-column resizable show-overflow-tooltip property="allOrderBalance" align="center" label="小计"  />
			</el-table-column>
		  </el-table>
		  <div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		  </div>
		
	</div>
</template>

<script>
	import {
		receivablePage
	} from '../../../api/trademgr-receivablemgr.js'
	
	export default {
		data() {
			return {
				selRow:null,
				tableData:[],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				queryParam:{
					status:'',
					name:''
				}
			};
		},
		methods:{
			tableRowClick(row) {
				this.currSelItem = row;
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			},
			tableSelectChanged(selectRows){
				if (selectRows.length === 1) {
					this.selRow = selectRows[0]
				} else {
				this.selRow = null
				}
			},
			doReset(){
			 this.queryParam.name = null;
			},
/* 			doSearch(){
				receivablePage({Vue:this,params:{
						keywords:this.searchData
				}}).then(res=>{
						if(res.result){
							this.page.total= res.model.numRows
							this.tableData = res.model.items;
						}
				})
			}, */
			doSearch(page){
				let param = {}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
				receivablePage({
					Vue:this,
					params:param
				}).then(res=>{
						if(res.result){
							this.page.total= res.model.numRows
							this.tableData = res.model.items;
						}
				})
			},
			doSearch1(page){
					let param = {
				...this.queryParam
					}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
					delete param.name
				receivablePage({
					Vue:this,
					params:param
				}).then(res=>{
						if (res.result) {
						 if(res.model&&res.model.numRows){
							 this.tableData = res.model.items
							 this.page.total = res.model.numRows
						 }	else{
							 this.tableData = ''
						 }	
					}
				})

			},
			doSearch2(page){
				let param = {
				...this.queryParam
					}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
				receivablePage({
					Vue:this,
					params:param
				}).then(res=>{
						if (res.result) {
						 if(res.model&&res.model.numRows){
							 this.tableData = res.model.items
							 this.page.total = res.model.numRows
						 }	else{
							 this.tableData = ''
						 }	
					}
				})

			},
		}
	}
</script>

<style lang="less">
	.flexbox{
		display: flex;
		.text{
			margin-top: 5px;
			color: #666;
			font: 12px/1.5 tahoma,arial,Hiragino Sans GB,\\5B8B\4F53,sans-serif;
		}
		.orderTime{
			width:180px;
		}
		.orderCode{
			width:130px;
		}
		.providerName{
			flex:1;
		}
		.orderMoney{
			width: 100px;
		}
		.sumDeliveryAmount{
			width: 100px;
		}
		.sumInvMoney{
			width: 100px;
		}
		.sumBalanceMoney{
			width: 100px;
		}
		.status{
			width: 130px;
		}
		.btn{
			width:100px;
		}
	}
</style>
