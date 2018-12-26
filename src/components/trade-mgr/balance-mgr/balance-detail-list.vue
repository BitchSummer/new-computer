<template>
	<div>
		<el-table ref="table" height="200" :data="tableData" style="width: 100%" >
			<el-table-column type="selection" align="center" width="50" />
			<el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号" />
			<el-table-column resizable show-overflow-tooltip property="orderTime" align="center" label="下单时间" width="110" />
			<el-table-column resizable show-overflow-tooltip property="orderMoney" align="center" label="订单金额" />
			<el-table-column resizable show-overflow-tooltip align="center" label="已结算总额" >
				<template slot-scope="scope">
				{{scope.row.orderMoney-scope.row.noPayBalance}}
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="noPayBalance" align="center" label="未结算总额" />
			<el-table-column resizable show-overflow-tooltip property="payBalance" align="center" label="本次结算额" />
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" />

		</el-table>
	</div>
</template>

<script>
	export default {
		props: ['tableData']
	}
</script>

