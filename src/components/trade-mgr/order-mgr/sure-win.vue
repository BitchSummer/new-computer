//变更确认
<template>
	<toast :config="winConfig" @agree="agree" @disagree="disagree">
		<el-form :model="form1" status-icon ref="form1" label-width="140px">
		<!-- 	<el-form-item label="变更类型:" prop="companyName">
				<el-radio-group v-model="form.changeType" >
					<el-radio :label="item.value" v-show="form.changeType=='交期变更'">交期变更</el-radio>
				</el-radio-group>
			</el-form-item> -->
			<el-form-item label="变更类型:" prop="companyName"  v-show="form1.changeType=='交期变更'">交期变更
				</el-form-item>
			 <el-form-item label="变更类型:" prop="companyName"  v-show="form1.changeType=='数量变更'">数量变更
				</el-form-item>
			<h1>变更前:</h1>
			<el-row>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="单位组:">
						<el-input size="small" v-model="form1.unitGroupName" disabled  ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品数量:">
						<el-input size="small" v-model="form1.oldAmount" disabled  ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品单位:">
				 <el-input size="small" v-model="form1.oldUnit=='undefined'?null:form1.oldUnit" disabled ></el-input>  
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="单位单价:">
						<el-input size="small" v-model="form1.oldPrice" disabled  ></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品总价:">
						<el-input size="small" v-model="form1.oldSumPrice" disabled  ></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-show="form1.changeType=='交期变更'">
					<el-form-item label="计划交期:">
						<el-input size="small" v-model="form1.oldPlanDate" disabled  ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<h1>变更后:</h1>
			<el-row>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="单位组:" >
						<el-input size="small" v-model="form1.unitGroupName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品单位:" >
						<!-- <el-select size="small" collapse-tags v-model="form1.newUnitId"  @change="doUnitChange" disabled>
							<el-option v-for="item in unitArr" :key="item.id" :label="item.alias" :value="item.id">
							</el-option>
						</el-select> -->	<el-input size="small" v-model="form1.newUnit" disabled  ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品数量:" >
						<el-input size="small" v-model="form1.newAmount"  @change="companySumPrice" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="单位单价:" >
						<el-input size="small" v-model="form1.oldPrice"   disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='数量变更'">
					<el-form-item label="产品总价:" >
					 <el-input size="small" v-model="form1.newSumPrice"   disabled></el-input> 
						<!-- {{form.newAmount*form.oldPrice}} -->
					<!-- 	{{form.newSumPrice}} -->
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form1.changeType=='交期变更'">
					<el-form-item label="计划交期:" >
						<el-date-picker size="small" disabled v-model="form1.newPlanDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请输入计划交期" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注:">
				<el-input size="small" v-model="form1.remark"   type="textarea" :rows="2"></el-input>
			</el-form-item>
		</el-form>
	</toast>
</template>
<script>
	import {
		queryPrice
	} from "../../../api/businessmgr-marketbase.js"

	import {
        changeRecordList,
        changSure
	} from '../../../api/trademgr-ordermgr.js'

	export default {
		data() {
			return {
				form1:{},
				item:{},
				priceRecord: null,
				unitArr: [],
				productDetailArr: [],
				changeTypeOption: [{
					value: '数量变更'
				}, {
					value: '交期变更'
				}],
				rules: {
					companyName: [{
						required: true,
						message: '请输入企业名称',
						trigger: 'blur'
					}]
				},
				winConfig: { //办结弹窗数据
					title: "变更确认", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "800px", //弹窗宽
					btnData: [{
						name: '驳回', //按钮名
						method: 'disagree', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '同意', //按钮名
						method: 'agree', //回调函数
						bgColor: 'dialog-bule' //按钮背景
					}]
				}
			}
		},
		methods: {
			doUnitChange() {
				let unit = this.unitArr.filter(item => item.id == this.form.newUnitId)[0];
				this.$set(this.form, 'newComputeRatio', unit.computeFormula)
				this.$set(this.form, 'newPrice', this.priceRecord.price * unit.computeFormula)
				this.companySumPrice();
			},
			companySumPrice() {
			/* 	if (this.form.newPrice != null && this.form.newAmount != null)
				 this.$set(this.form, 'newSumPrice', Number(this.form.newPrice) * Number(this.form.newAmount))
			 	console.log(this.form.newSumPrice,'222333')	 */		 
			},
			show(orderDetailId,form) {
				this.winConfig.dialogVisible = true;
			changeRecordList({
					Vue: this,
					params: {
					  	type: "变更待确认",  
						orderDetailId: orderDetailId
					}
				}).then(res => {
					if (res.result) {
						res.model.forEach(item => {
						console.log(item,'item')
						this.form1=item
						})
						this.tableData = res.model;
						this.winConfig.dialogVisible = true;
					}
				})


			},
			agree(form1) {
				this.$refs.form1.validate((valid) => {
					if (valid) {
						this.$confirm("您确认提交变更？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								changSure({
									Vue: this,
									params: {
                                        orderDetailId:this.form1.orderDetailId,
                                        status:'变更生效',
                                        remark: this.form1.remark 
                                        }
								}).then(res => {
									if (res.result) {
										this.winConfig.dialogVisible = false;
										this.$emit('callback');
									}
								})
							})

					}
				});
            },
             disagree(form1) {
				this.$refs.form1.validate((valid) => {
					if (valid) {
						this.$confirm("您确认提交变更？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								changSure({
									Vue: this,
									params: {
                                        orderDetailId:this.form1.orderDetailId,
                                        status:'变更驳回',
                                        remark: this.form1.remark 
                                        }
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
