<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="doSearch">
			<el-table ref="table" :data="tableData" border style="width: 98%;margin:0 10px;" >
				<el-table-column type="index" width="55" />
				<el-table-column property="unit" align="center" label="单位" />
				<el-table-column property="price" align="center" label="单价" />
				<el-table-column property="computeType" align="center" label="计算方式" />
				<el-table-column property="computeRatio" align="center" label="计算系数" />
				<el-table-column property="computePrecision" align="center" label="计算精度" />
			</el-table>
		</toast>
	</div>
</template>

<script>
	import {
		unitConvert
	} from "../../../api/productmgr-productprice.js"
	export default {
		props: ['config'],
		data() {
			return {
				tableData: []
			}
		},
		methods: {
			/**
			 * 查询
			 */
			doSearch() {
				unitConvert({
					Vue: this,
					params: {
						productDetailId:this.config.productDetailId,
						unitGroupId:this.config.unitGroupId,
						price:this.config.price
					}
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
					}
				})
			}
		}
	}
</script>

<style lang="less">

</style>
