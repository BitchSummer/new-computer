<!--
  规格配置
 -->

<template>
	<div>
			<el-table ref="table" :data="config.tableData" border style="width: 98%;margin:0 10px;" @selection-change="tableSelectChanged" @row-click="tableRowClick">
				<el-table-column type="selection" width="55" />
				<el-table-column resizable show-overflow-tooltip property="marketName" align="center" label="市场名称" width="100" />
				<el-table-column resizable show-overflow-tooltip property="marketClassName" align="center" label="市场分类" width="100" />
				<el-table-column resizable show-overflow-tooltip property="productClassName" align="center" label="产品大类" width="100" />
				<el-table-column resizable show-overflow-tooltip property="productCode" align="center" label="产品编码" width="100" />
				<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称"  />
				<el-table-column resizable show-overflow-tooltip property="spec" align="center" label="规格型号" width="100"/>
				<el-table-column resizable show-overflow-tooltip property="unitGroupName" align="center" label="单位组" width="100" />
				<el-table-column resizable show-overflow-tooltip property="standardUnit" align="center" label="基准单位" width="100" />
				<el-table-column resizable show-overflow-tooltip property="price" align="center" label="调整前价格" width="100" />
					
				<el-table-column resizable property="modifyPrice" align="center" label="调整后价格" width="120" >
						<template slot-scope="scope">
							<el-input-number  v-model="scope.row.modifyPrice"
							style="width: 100px;"
							size="mini" :precision="2" :controls="false"></el-input-number>
						</template>
					</el-table-column>
				<el-table-column label="操作" align="center" width="140">
					<template slot-scope="scope">
						<el-button size="mini" type="text"  @click="unitPriceConvert(scope.row)">单位换算</el-button>
						<el-button size="mini" type="text" @click="doRemove(scope.$index)">移除</el-button>
					</template>
				</el-table-column>
		
			</el-table>
		
			
		
	</div>
</template>

<script>
	
	export default {
		props: ['config','unitPriceConfig'],
		methods: {
			doRemove(index){
					this.config.tableData.splice(index,1)
			},
			unitPriceConvert(row){
				this.unitPriceConfig.price = row.modifyPrice
				this.unitPriceConfig.productDetailId = row.productDetailId
				this.unitPriceConfig.unitGroupId = row.unitGroupId
				this.unitPriceConfig.dialogVisible = true;
			},
      tableSelectChanged(selection){
				this.config.selectRows = selection;

			},
			tableRowClick(row){
				this.currSelItem = row;
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			}
		}
	}
</script>

<style lang="less">

</style>
