<template>
	<div>
		<el-table height="600" border stripe ref="table" :data="tableData.items" style="width: 100%" @selection-change="tableSelectChanged"
		 @row-click="tableRowClick">
			<el-table-column type="selection" width="55" />
			<el-table-column resizable show-overflow-tooltip property="status" align="center" label="发布标识" width="100">
				<template slot-scope="scope">
					<el-tag size="medium" :type="scope.row.status=='发布成功'?'success':'warning'">{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="marketName" align="center" label="发布时间" width="120" />
			<el-table-column resizable show-overflow-tooltip property="productCode" align="center" label="产品编码" width="150" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称" />
			<el-table-column resizable show-overflow-tooltip property="spec" align="center" label="产品规格" />
			<el-table-column resizable show-overflow-tooltip property="unitGroupName" align="center" label="单位组" width="100" />
			<el-table-column resizable show-overflow-tooltip property="standardUnit" align="center" label="基准单位" width="100" />
			<el-table-column resizable show-overflow-tooltip property="price" align="center" label="单位价格" width="100" />
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="unitPriceConvert(scope.row)">单位换算</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
		<unit-price :config="unitPriceConfig" />
	</div>
</template>
<script>
	import {
		publishRecordDetailList
		
	} from "../../../api/productmgr-productpublish.js"
	import UnitPrice from '../product-price/unit-price-win.vue'
	export default {
		components: {
			UnitPrice
		},
		props: ['queryParam'],
		data() {
			return {
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: [],
				unitPriceConfig: {
					title: '单位价格换算参考', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '800px', //弹窗宽
					productDetailId: 0,
					unitGroupId: 0,
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
			doSearch(page) {
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
				publishRecordDetailList({
					Vue: this,
					params: queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
						this.page.total = res.model.numRows;
					}
				})
			},
			unitPriceConvert(row) {
				this.unitPriceConfig.productDetailId = row.productDetailId
				this.unitPriceConfig.unitGroupId = row.unitGroupId
				this.unitPriceConfig.dialogVisible = true;
			},
			tableSelectChanged(selection) {
				this.$emit("setSelectRows",selection)
			},
			tableRowClick(row) {
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
