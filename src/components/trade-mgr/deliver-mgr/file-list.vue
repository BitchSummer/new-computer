<template>
	<div>
		<toolbar>
			<span slot="left">
				<el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="服务商搜索..." />
				<el-input size="small" style="width: 150px;" v-model="queryParam.orderCode" placeholder="订单号搜索..." />
				<el-input size="small" style="width: 150px;" v-model="queryParam.productName" placeholder="资源名称搜索..." />
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="queryParam={}">清空条件</el-button>
			</span>
		</toolbar>
		<el-table ref="table" height="600" :data="tableData" style="width: 100%">
			<el-table-column type="selection" align="center" width="50" />
			<el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号"  />
			<el-table-column resizable show-overflow-tooltip property="providerName" label="服务商" align="center" />
			<el-table-column resizable show-overflow-tooltip property="customerName" label="客户信息" align="center" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称"  />
			<el-table-column resizable show-overflow-tooltip property="productSpec" align="center" label="产品规格"  />
			<el-table-column resizable show-overflow-tooltip property="deliverTime"  align="center" label="授权时间" width="110"/>
			<el-table-column resizable show-overflow-tooltip property="status" align="center" label="授权标识" />
			<el-table-column resizable show-overflow-tooltip property="downLoadCount" align="center" label="下载次数" />

			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="scope">
					<el-button size="mini" type="text">下载</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
	</div>
</template>

<script>
	import {
		filePage
	} from '../../../api/trademgr-delivermgr.js'

	export default {
		data() {
			return {
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				queryParam: {
					status: ''
				}
			};
		},
		methods: {
			doSearch(page) {
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				filePage({Vue:this,params:param}).then(res=>{
						if(res.result){
							this.page.total= res.model.numRows
							this.tableData = res.model.items;
						}
				})
			}
		}
	}
</script>

<style lang="less">
	.flexbox {
		display: flex;

		.text {
			margin-top: 5px;
			color: #666;
			font: 12px/1.5 tahoma, arial, Hiragino Sans GB, \\5B8B\4F53, sans-serif;
		}

		.orderTime {
			width: 180px;
		}

		.orderCode {
			width: 130px;
		}

		.providerName {
			flex: 1;
		}

		.orderMoney {
			width: 100px;
		}

		.sumDeliveryAmount {
			width: 100px;
		}

		.sumInvMoney {
			width: 100px;
		}

		.sumBalanceMoney {
			width: 100px;
		}

		.status {
			width: 130px;
		}

		.btn {
			width: 100px;
		}
	}
</style>
