<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="doSearch">
			<el-table ref="table" :data="tableData" border style="width: 98%;margin:0 10px;" >
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="isValid" align="center" label="生效标识" width="100">
				<template slot-scope="scope">
					<el-tag size="medium" :type="scope.row.isValid=='未生效'?'warning':scope.row.isValid=='已生效'?'success':'danger'">{{ scope.row.isValid }}</el-tag>
				</template>
			</el-table-column>
				<el-table-column resizable show-overflow-tooltip property="validDate" align="center" label="生效日期" width="120" />
				<el-table-column resizable show-overflow-tooltip property="invalidDate" align="center" label="失效日期" width="120" />
				<el-table-column resizable show-overflow-tooltip property="priceNo" align="center" label="调价单号" width="150" />
				<el-table-column resizable show-overflow-tooltip property="unitGroupName" align="center" label="单位组" width="100" />
				<el-table-column resizable show-overflow-tooltip property="standardUnit" align="center" label="基准单位" width="100" />
				<el-table-column resizable show-overflow-tooltip property="price" align="center" label="调整前" width="100" />
				<el-table-column resizable show-overflow-tooltip property="modifyPrice" align="center" label="调整后" width="100" />

				<el-table-column label="操作" align="center" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="unitPriceConvert(scope.row)" >单位换算</el-button>
					</template>
				</el-table-column>
		
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</toast>
		<unit-price :config="unitPriceConfig" />
		
	</div>
</template>

<script>
	import {
		productPriceHistoryPage
	} from "../../../api/productmgr-productprice.js"
	import UnitPrice from './unit-price-win.vue'
	export default {
		components:{UnitPrice},
		props: ['config'],
		data() {
			return {
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: [],
				unitPriceConfig:{
					title: '单位价格换算参考', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '800px', //弹窗宽
					productDetailId:0,
					unitGroupId:0,
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
			/**
			 * 查询
			 */
			doSearch(page) {
				let queryParam = { 
					productDetailId:this.config.productDetailId
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
				productPriceHistoryPage({
					Vue: this,
					params:queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
					}
				})
			},
			unitPriceConvert(row){
				this.unitPriceConfig.productDetailId = row.id
				this.unitPriceConfig.unitGroupId = row.unitGroupId
				this.unitPriceConfig.dialogVisible = true;
			}
		}
	}
</script>

<style lang="less">

</style>
