<template>
	<div>
		<el-table height="400" border stripe ref="table" :data="config.tableData" style="width: 100%"
		>
			<el-table-column type="index" width="55" />
			<el-table-column resizable show-overflow-tooltip property="marketName" align="center" label="市场名称" width="120" />
			<el-table-column resizable show-overflow-tooltip property="marketClassName" align="center" label="市场大类" width="120" />
			<el-table-column resizable show-overflow-tooltip property="productClassName" align="center" label="产品大类" width="120" />
			<el-table-column resizable show-overflow-tooltip property="productCode" align="center" label="产品编码" width="120" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称" />
			<el-table-column resizable show-overflow-tooltip property="spec" align="center" label="产品规格" />
			<el-table-column resizable show-overflow-tooltip property="unitGroupName" align="center" label="单位组" width="100" />
			<el-table-column resizable show-overflow-tooltip property="standardUnit" align="center" label="基准单位" width="100" />
			<el-table-column resizable show-overflow-tooltip property="price" align="center" label="单位价格" width="100" />
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="doRemove(scope.$index)">移除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	export default {
		props: ['config'],
		methods: {
			doRemove(index){
					this.config.tableData.splice(index,1)
			}
		}
	}
</script>
<style lang="less">
</style>
