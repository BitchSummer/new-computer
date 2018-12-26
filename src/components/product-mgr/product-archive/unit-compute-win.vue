<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="doSearch">
			<el-table ref="table" :data="tableData" border style="width: 98%;margin:0 10px;" >
				<el-table-column type="selection" width="55" />
				<el-table-column property="unit" align="center" label="单位" />
				<el-table-column property="isStandard" align="center" label="是否基准" />
				<el-table-column property="unitRate" align="center" label="数量换算比" />
			</el-table>
		</toast>

		
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState({
				ports: "ports"
			})
		},
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
				this.$http.post(
					this.ports + "/product-publish/unit/list",{
						unitGroupId : this.config.unitGroupId
					}, {
						
					},
					data => {
						this.tableData = data;
					},
					this
				);
			}
		}
	}
</script>

<style lang="less">

</style>
