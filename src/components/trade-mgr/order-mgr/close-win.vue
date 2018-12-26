<template>
	<toast :config="winConfig" @doSave="doSave" @close="winConfig.dialogVisible=false">
		<el-form :model="form" status-icon ref="form" label-width="100px">
			<el-form-item label="关闭类型:" prop="companyName">
				<el-radio-group v-model="form.closeType" >
					<el-radio :label="item.value" v-for="item in closeTypeOption">{{item.value}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="备注:" >
				<el-input size="small" v-model="form.remark" placeholder="请输入变更原因" type="textarea" :rows="4"></el-input>
			</el-form-item>
		</el-form>
	</toast>
</template>
<script>
	import {
		close
	} from '../../../api/trademgr-ordermgr.js'

	export default {
		data() {
			return {
				form:{
					orderId:0,
					orderDetailId:0,
					closeType:'交易完成',
					remark:''
				},
				closeTypeOption: [{
					value: '交易完成'
				}, {
					value: '交易中止'
				}],
				rules: {
					companyName: [{
						required: true,
						message: '请输入企业名称',
						trigger: 'blur'
					}]
				},
				winConfig: { //办结弹窗数据
					title: "交易关闭", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "600px", //弹窗宽
					btnData: [{
						name: '取消', //按钮名
						method: 'close', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '提交确认', //按钮名
						method: 'doSave', //回调函数
						bgColor: 'dialog-bule' //按钮背景
					}]
				}
			}
		},
		methods: {
			show(orderId,orderDetailId) {
				this.form.orderId = orderId;
				this.form.orderDetailId = orderDetailId;
				this.winConfig.dialogVisible = true;
				this.form.closeType='交易完成'
				this.form.remark=''
			},
			doSave() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm("您确认交易关闭？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								close({
									Vue: this,
									params: this.form
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
<style lang="less">
	.el-form-item {
		margin-bottom: 12px;
	}

	.avatar-uploader {
		float: left;
		padding-left: 10px;

		.el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}

		.el-upload:hover {
			border-color: #409EFF;
		}
	}


	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 300px;
		height: 200px;
		line-height: 200px;
		text-align: center;
	}
</style>
