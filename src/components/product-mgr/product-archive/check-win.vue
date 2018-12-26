<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="doSearch">
			<el-table ref="table" :data="tableData" border style="width: 98%;margin:0 10px;">
				<el-table-column type="index" width="55" />
				<el-table-column property="spec" align="center" label="规格型号" />
			</el-table>
		</toast>

		
	</div>
</template>

<script>
	import {
		checkProductDetail
		} from '../../../api/productmgr-productarchive.js'
	export default {
		props: ['config'],
		data() {
			return {
				selItemArr: null,
				tableData: []
			}
		},
		methods: {
			/**
			 * 查询
			 */
			doSearch() {
				checkProductDetail({
					Vue: this,
					params: {
						productId : this.config.productId,
						configOptions: this.config.configItems
					}
				}).then(res => {
					if (res.result){
						this.tableData = res.model
					}
				})
				
			}
		}
	}
</script>

<style lang="less">

</style>
