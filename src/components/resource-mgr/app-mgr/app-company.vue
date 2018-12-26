<template>
	<div>
		<toolbar>
			
			<span slot="left">
				<el-input size="small" style="width: 150px;" v-model="queryParam.province" placeholder="省份搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.city" placeholder="市县搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.authType" placeholder="认证类型搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.industry" placeholder="行业领域搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.companyName" placeholder="企业名称搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.companyNature" placeholder="企业性质搜索..."></el-input>
				<el-button icon="el-icon-search" size="small" style="width: 120px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
			</span>
		</toolbar>

		<div>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doView">
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="industry" align="center" label="行业领域" width="120" />
				<el-table-column resizable show-overflow-tooltip property="appClass" align="center" label="应用分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="应用名称"  />
				<el-table-column resizable show-overflow-tooltip property="province" align="center" label="省份" width="120" />
				<el-table-column resizable show-overflow-tooltip property="city" align="center" label="所在市" width="120" />
				<el-table-column resizable show-overflow-tooltip property="authType" align="center" label="认证类型" width="100" />
				<el-table-column resizable show-overflow-tooltip property="companyName" align="center" label="企业名称" />
				<el-table-column resizable show-overflow-tooltip property="isValid" align="center" label="有效标识" width="120" />
				<el-table-column resizable show-overflow-tooltip property="validDate" align="center" label="有效日期" width="120" />
				<el-table-column resizable show-overflow-tooltip property="invalidDate" align="center" label="失效日期" width="120" />
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</div>
	</div>
</template>
<script>
	import {
			appCompanyPage
		} from '../../../api/resourcemgr-appmgr.js'
	export default {
		props: ['config'],
		data() {
			return {
				queryParam: {
					province: ''
				},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				}
			}
		},
		methods: {
			doView(row) {
				this.viewConfig.form = { ...row
				};
				this.viewConfig.dialogVisible = true;
			},
			doSearch(page) {

				let param = { ...this.queryParam
				}
				param.industry = this.config.length == 1 ? this.config[0] : '';
				param.appClass = this.config.length == 2 ? this.config[1] : '';
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				appCompanyPage({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;

					}
				})

			}
		}
	}
</script>
<style lang="less">

</style>
