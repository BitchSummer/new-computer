<template>


	<el-form ref="form" :model="form" :rules="rules" label-width="90px">
		<el-row :gutter="0">
			<el-col :span="8">
				<el-form-item label="签发时间:" prop="signOutTime">
					<el-date-picker size="small" v-model="form.signOutTime" type="datetime" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"
					disabled>
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="签发人:" prop="signOutUser">
					<el-input size="small" v-model="form.signOutUser" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="客户信息:" prop="providerId">
					<el-input size="small" v-model="form.customerName" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="付款方式:" prop="balanceType">
					<el-input size="small" v-model="form.balanceType" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="结算金额:">
					<el-input size="small" v-model="form.balanceMoney" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="备注:">
					<el-input size="small" v-model="form.remark" disabled type="textarea" :rows="2" />
				</el-form-item>
			</el-col>
		</el-row>

	</el-form>

</template>
<script>
	import {
		providerList
	} from '../../../api/trademgr-ordermgr.js'
	export default {
		props: ['form'],
		data() {
			return {
				balanceTypeOptions: [{
					value: '银行转账'
				}, {
					value: '现金支付'
				}, {
					value: '其他'
				}],
				providerArr:[],
				rules: {
					signOutTime: [{
						required: true,
						message: '请输入签发时间',
						trigger: 'blur'
					}],
					signOutUser: [{
						required: true,
						message: '请输入签发人',
						trigger: 'blur'
					}],
					providerId: [{
						required: true,
						message: '请输入服务商',
						trigger: 'blur'
					}],
					balanceType: [{
						required: true,
						message: '请选择付款方式',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			doSave() {
				this.$refs.form.validate((valid) => {
					if(valid){
						this.$emit('callback')
					}

				});
			},
			setProviderArr(providerArr){
				this.providerArr = providerArr;
			},
			queryProviderList(providerName) {
				providerList({
					Vue: this,
					params: {
						providerName: providerName
					}
				}).then(res => {
					if (res.result) {
						this.providerArr = res.model
					}
				})
			}
		}
	}
</script>
