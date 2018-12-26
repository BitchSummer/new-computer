<template>
	<el-form ref="form" :model="form" label-width="110px">
		<el-row :gutter="4">
			<el-col :span="8">
				<el-form-item label="申请时间:" >
					<el-date-picker size="small" v-model="form.applyTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="申请客户:" >
					<el-input size="small" v-model="form.customerName" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="申请人:" >
					<el-input size="small" v-model="form.applyUser" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="票据类型:">
					<el-input size="small" v-model="form.invoiceType" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="票据金额:">
					<el-input size="small" v-model="form.invoiceMoney" disabled />
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="开票信息:">
					<el-input size="small" v-model="form.invoiceAddrStr" disabled type="textarea" :rows="2" />
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
	export default {
		props: ['form']
	}
</script>
