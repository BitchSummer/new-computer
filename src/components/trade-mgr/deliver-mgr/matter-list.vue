<template>
	<div>
		<toolbar>
			<span slot="left">
				<el-radio-group v-model="queryParam.status" size="small" @change="doSearch" >
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="待签收">待签收</el-radio-button>
					<el-radio-button label="拒签收">拒签收</el-radio-button>
					<el-radio-button label="已签收">已签收</el-radio-button>
				</el-radio-group>
				<el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="服务商搜索..."  />
				<el-input size="small" style="width: 150px;" v-model="queryParam.customerName" placeholder="客户信息搜索..."  />
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="doReset">清空条件</el-button>
			</span>
			<span slot="right">
					<el-button icon="el-icon-plus" size="small" style="width: 110px;" type="primary" @click="doAdd">新增发货</el-button>
			</span>
		</toolbar>
		  <el-table  ref="table" height="600" :data="tableData" style="width: 100%" @row-dblclick="doView" @row-click="tableRowClick">
			<el-table-column resizable show-overflow-tooltip property="status" align="center" label="流程状态" />
		  <el-table-column resizable show-overflow-tooltip property="customerName"  label="客户信息" align="center"/>
			<el-table-column resizable show-overflow-tooltip property="deliverAddrStr"  label="收货地址" align="center"/>
			<el-table-column resizable show-overflow-tooltip label="发货信息" align="center">
				<el-table-column resizable show-overflow-tooltip property="deliverTime" align="center" label="发货时间"  />
				<el-table-column resizable show-overflow-tooltip property="deliverUser" align="center" label="发货人"  />
				<el-table-column resizable show-overflow-tooltip property="orderCount" align="center" label="订单数量"  />
				<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注"  />
				</el-table-column>
				<el-table-column resizable show-overflow-tooltip label="收货信息" align="center">
				<el-table-column resizable show-overflow-tooltip property="signInTime" align="center" label="签收时间" />
				<el-table-column resizable show-overflow-tooltip property="signInUser" align="center" label="签收人" />
				</el-table-column>
		  </el-table>
		  <div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		  </div>
			<deliver-win ref="deliverWin" @callback="callback"/>
	</div>
</template>

<script>
	import {
		matterPage,
		signInOrRefuseDeliver
	} from '../../../api/trademgr-delivermgr.js'
	import DeliverWin from './deliver-win.vue'
	export default {
		data() {
			return {
				tableData:[],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				queryParam:{
					status:''
				}
			};
		},
		methods:{
			doReset(){
				this.queryParam.providerName=''
				this.queryParam.customerName=''
			},
			doAdd(){
				this.$refs.deliverWin.show({},true);
			},
			doSearch(page) {
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				matterPage({Vue:this,params:param}).then(res=>{
						if(res.result){
							this.page.total= res.model.numRows
							this.tableData = res.model.items;
						}
				})
			},
			doView(row){
				this.$refs.deliverWin.show(row,false);
			},
			tableRowClick(row) {
				if (row) {
					this.$refs.table.toggleRowSelection(row,false);
				} else {
					this.$refs.table.clearSelection();
				}
			},
      callback(){
        this.doSearch();
      }
		},

		components: {
			DeliverWin
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
