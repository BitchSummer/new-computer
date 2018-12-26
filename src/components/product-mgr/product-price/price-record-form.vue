<template>
			<el-form ref="form" :model="config.form" :rules="rules" label-width="90px" label-position="right" style="margin: 10px;">
				<el-row>
					<el-col :span="8">
						<el-form-item label="调价时间:" prop="priceTime">
							<el-date-picker size="mini" v-model="config.form.priceTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="调价人:" prop="priceUser">
							<el-input size="mini" v-model="config.form.priceUser"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="生效日期:" prop="validDate">
							<el-date-picker size="mini" v-model="config.form.validDate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
							placeholder="选择日期时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注:" prop="remark">
							<el-input size="mini" type="textarea" v-model="config.form.remark"></el-input>
						</el-form-item>
					</el-col>
					
				</el-row>
			</el-form>
</template>
<script>
// 	import {
// 		modelAttrList
// 	} from "../../../api/productmgr-base.js"
// 	import {
// 		saveOrUpdateProduct
// 	} from "../../../api/productmgr-productarchive.js"
	export default {
		props: ['config'],
		data() {
			return {
				rules: {
					priceTime: [{
						required: true,
						message: '请输入调价时间',
						trigger: 'change'
					}],
					priceUser: [{
						required: true,
						message: '请输入调价人',
						trigger: 'change'
					}],
					validDate: [{
						required: true,
						message: '请输入生效日期',
						trigger: 'change'
					}],
					remark:[{
						required:true,
						message:'备注不能为空',
						trigger:'change'
					}]
				}
			}
		},
		methods: {
			empty(){
				if(this.$refs['form']!=undefined){
					this.$refs['form'].resetFields()
				}
			}
			// doSave() {
			// 	this.$refs['form'].validate((valid) => {
			// 		if(valid) {
			// 			saveOrUpdateProduct({
			// 				Vue: this,
			// 				params: this.config.form
			// 			}).then(res => {
			// 				if (res.result) {
			// 					this.config.dialogVisible = false;
			// 					this.$emit("callback")
			// 				}
			// 			})
			// 		}
			// 	});
			// }
		}
	}
</script>
<style lang="less">
	.product-define {
		h1 {
			line-height: 40px;
		}

		.el-tag {
			margin-right: 10px;
			margin-bottom: 10px;
			padding: 0 20px;
		}
	}
</style>
