<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="110px">
		<el-row :gutter="4">
			<el-col :span="8">
				<el-form-item label="签发日期:" prop="signOutTime">
					<el-date-picker size="small" v-model="form.signOutTime" type="datetime" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"  />
				</el-form-item>
			</el-col>
		
			<el-col :span="8">
				<el-form-item label="签发人:" prop="signOutUser">
					<el-input size="small" v-model="form.signOutUser" />
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="票据号:" prop="invoiceNo">
					<el-input size="small" v-model="form.invoiceNo" type="textarea" :rows="2" />
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>

</template>
<script>
	import {
		signOutInvoice
	} from '../../../api/trademgr-invoicemgr.js'
	export default {
		props: ['form','winConfig'],
		data() {
			return {
				invoiceTypeOptions: [{
					value: '增值税发票'
				}, {
					value: '普通发票'
				}],
				providerArr: [],
				rules: {
					signOutTime: [{
						required: true,
						message: '请选择签发时间',
						trigger: 'change'
					}],
					signOutUser: [{
						required: true,
						message: '请输入签发人',
						trigger: 'change'
					}],
					invoiceNo: [{
						required: true,
						message: '请输入票据信息',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			doSave() {
				this.$refs.form.validate((valid) => {
					if(valid){
						
						this.$confirm("您确认签发票据？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								let param = {...this.form}
								signOutInvoice({
									Vue: this,
									params: param
								}).then(res => {
									if (res.result) {
										this.winConfig.dialogVisible = false;
										this.$emit('callback');
									}
								})
							})
					}
					
				});
			}
		}
	}
</script>
