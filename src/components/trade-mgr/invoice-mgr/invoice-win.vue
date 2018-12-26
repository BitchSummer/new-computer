<template>
	<toast :config="winConfig" @doSave="doSave" @close="winConfig.dialogVisible=false" class="invoice-win">
		<el-card style="margin: 5px 10px;">
			<h1>发票签发</h1>
		<sign-out-form ref="form" :form="form" :winConfig="winConfig"  @callback="callback"/>
		</el-card>
		<el-card style="margin: 5px 10px;">
			<h1>发票申请</h1>
			<apply-form  :form="form" />
		</el-card>
		<el-card style="margin: 5px 10px;">
		<invoice-detail :tableData="tableData" />
		</el-card>

	</toast>
</template>
<script>
	import {
		invoiceDetailList
	} from '../../../api/trademgr-invoicemgr.js'
	import SignOutForm from './sign-out-form.vue'
	import ApplyForm from './apply-form.vue'
	import InvoiceDetail from './invoice-detail-list.vue'
	export default {
		data() {
			return {
				form:{},
				tableData: [],
				winConfig: { //办结弹窗数据
					title: "开票签发", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1300px", //弹窗宽
					btnData: [{
						name: '取消', //按钮名
						method: 'close', //回调函数
						bgColor: "dialog-normal"

					}, {
						name: '确定签发', //按钮名
						method: 'doSave', //回调函数
						bgColor: 'dialog-deep-blue'

					}]
				},
			}
		},
		methods: {
			show(form) {
				this.form = form;
				invoiceDetailList({
					Vue: this,
					params: {
						invoiceId:this.form.id
					}
				}).then(res => {
					if (res.result) {
						console.log(res.model)
						this.tableData = res.model;
						this.winConfig.dialogVisible = true;
					}
				})

			},
			doSave() {
				this.$refs.form.doSave();
			},
			callback(){
				this.$emit("callback")
			}

		},
		components:{
			ApplyForm,
			SignOutForm,
			InvoiceDetail
		}
	}
</script>
<style lang="less">
	.invoice-win{
		h1{
			margin: 10px 0px 10px 20px;
			font-size: 15px;
			color: #409EFF;
		}
		.el-form-item {
			margin-bottom: 12px;
		}
		.el-card__body {
			padding: 0px;
		}
	}

</style>
