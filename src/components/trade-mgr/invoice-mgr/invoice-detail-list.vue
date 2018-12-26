<template>
	<div>
		<el-table ref="table" height="200" :data="tableData" style="width: 100%" >
			<el-table-column type="selection" align="center" width="50" />
			<el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号" />
			<el-table-column resizable show-overflow-tooltip property="orderTime" label="下单时间" width="110" />
			<el-table-column resizable show-overflow-tooltip property="orderMoney" align="center" label="订单金额" />
			<el-table-column resizable show-overflow-tooltip align="center" label="已开票总额" >
					<template slot-scope="scope">
						{{scope.row.orderMoney-scope.row.noPayInvoice}}
					</template>
				</el-table-column>
				
			<el-table-column resizable show-overflow-tooltip property="noPayInvoice" align="center" label="未开票总额" />
			<el-table-column resizable property="payInvoice" align="center" label="本次开票" width="140" />
			<el-table-column resizable  align="center" label="备注" width="140" />
		</el-table>
	</div>
</template>

<script>
	export default {
		props: ['tableData']
	}
</script>

