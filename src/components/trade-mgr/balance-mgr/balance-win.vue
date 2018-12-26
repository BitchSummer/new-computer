<template>
	<toast :config="winConfig" @close="winConfig.dialogVisible=false" class="invoice-win">
		<el-card>
			<balance-form :form="form" />
		</el-card>
		<el-card style="margin: 10px auto;">
			<balance-detail-list :tableData="tableData"  />
		</el-card>

	</toast>
</template>
<script>
	import {
		balanceDetailList
	} from '../../../api/trademgr-balancemgr.js'

	import BalanceForm from './balance-form.vue'
	import BalanceDetailList from './balance-detail-list.vue'
	export default {
		data() {
			return {
				form: {
					signOutTime:'',
					signOutUser:'',
					providerId:0,
					balanceType:''
				},
				tableData: [],
				winConfig: { //办结弹窗数据
					title: "结算单信息", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1300px", //弹窗宽
					btnData: [{
						name: '关闭窗口', //按钮名
						method: 'close', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}]
				}
			}
		},
		methods: {
			show(form) {
				this.form = form;
				balanceDetailList({
					Vue: this,
					params: {
						balanceId:this.form.id
					}
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
						this.winConfig.dialogVisible = true;
					}
				})
				
			
			}

		},
		components: {
			BalanceForm,
			BalanceDetailList
		}
	}
</script>
<style lang="less">
	.invoice-win {
		.el-form-item {
			margin-bottom: 12px;
		}

		.el-card__body {
			padding: 0px;
		}
	}
</style>
