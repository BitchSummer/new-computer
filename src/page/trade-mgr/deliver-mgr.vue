<template>
	<el-row class="trade-mgr">
		<el-col :span="24"  class="trade-mgr-main" >
			<el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane label="实物收货" name="matter-list">
					<matter-list ref="matterList"></matter-list>
				</el-tab-pane>
				<el-tab-pane label="授权开通" name="grant-list">
					<grant-list ref="grantList"></grant-list>
				</el-tab-pane>
				<el-tab-pane label="资源下载" name="file-list">
					<file-list ref="fileList"></file-list>
				</el-tab-pane>
			</el-tabs>
		</el-col>
	</el-row>
</template>
<script>
	import MatterList from "../../components/trade-mgr/deliver-mgr/matter-list.vue"
	import GrantList from "../../components/trade-mgr/deliver-mgr/grant-list.vue"
	import FileList from "../../components/trade-mgr/deliver-mgr/file-list.vue"
	export default {
		data() {
			return {
				activeName: 'matter-list'
			}
		},
		methods: {
			tabClick() {
				if (this.activeName == 'matter-list')
					this.$refs.matterList.doSearch()
				else if (this.activeName == 'grant-list')
					this.$refs.grantList.doSearch()
				else
					this.$refs.fileList.doSearch()
			}
		},
		mounted() {
			this.tabClick();
		},
		components: {
			MatterList,
			GrantList,
			FileList
		}
	}
</script>
<style lang="less">
	.trade-mgr {
		background-color: #f0f2f5;

		.trade-mgr-main {
			background-color: white;
		}

		.el-tabs__content {
			border: none;
			position: relative;
		}

		.el-input-group__append {
			cursor: pointer;
		}

		.search-more {
			margin-left: 10px;
		}

		.search-more-body {
			margin-top: 20px;
		}

		.fade-enter-active,
		.fade-leave-active {
			transition: opacity .2s;
		}

		.fade-enter,
		.fade-leave-to

		/* .fade-leave-active below version 2.1.8 */
			{
			opacity: 0;
		}

		.table-body {
			margin-top: 24px;
		}
	}
</style>
