//交易变更
<template>
	<toast :config="winConfig" @doSave="doSave" @close="winConfig.dialogVisible=false">
		<el-form :model="form1" status-icon ref="form1" label-width="140px">
			<el-form-item label="变更类型:" prop="companyName">
				<el-radio-group v-model="form.changeType" >
					<el-radio :label="item.value" v-for="item in changeTypeOption">{{item.value}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<h1>变更前:</h1>
			<el-row>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="单位组:">
						<el-input size="small" v-model="form.unitGroupName" disabled placeholder="请选择单位组"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品数量:">
						<el-input size="small" v-model="form.oldAmount" disabled placeholder="请输入数量"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品单位:">
						 <el-input size="small" v-model="form.oldUnit=='undefined'?null:form.oldUnit" disabled ></el-input>  
						<!-- {{form.oldUnit=='undefined'?null:form.oldUnit}} -->
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="单位单价:">
						<el-input size="small" v-model="form.oldPrice" disabled placeholder="请输入单价"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品总价:">
						<el-input size="small" v-model="form.oldSumPrice" disabled placeholder="请输入总价"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='交期变更'">
					<el-form-item label="计划交期:">
						<el-input size="small" v-model="form.oldPlanDate" disabled placeholder="请输入计划交期"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<h1>变更后:</h1>
			<el-row>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="单位组:" >

						<el-input size="small" v-model="form.unitGroupName" disabled></el-input>
					</el-form-item>

				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品单位:"  :rules="[{ required: true, message: '产品单位不能为空'}]" prop='newUnit'>
						<el-select size="small" collapse-tags v-model="form1.newUnit" placeholder="请选择单位" @change="doUnitChange">
							<el-option v-for="item in unitArr" :key="item.id" :label="item.alias" :value="item.alias">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品数量:" :rules="[{ required: true, message: '产品数量不能为空',trigger: 'blur'}]" prop='newAmount'>
						<el-input size="small" v-model="form1.newAmount" placeholder="请输入数量" @change="companySumPrice"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="单位单价:" >
						<el-input size="small" v-model="form.oldPrice" placeholder="请输入单价" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="form.changeType=='数量变更'">
					<el-form-item label="产品总价:" >
					 	<el-input size="small"   v-model="form.newSumPrice" placeholder="0" disabled></el-input> 
				<!-- 	{{form1.newAmount*form.oldPrice}} -->
					</el-form-item>

				</el-col>

				<el-col :span="8" v-show="form.changeType=='交期变更'">
					<el-form-item label="计划交期:" >
						<el-date-picker size="small" v-model="form.newPlanDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请输入计划交期" />
					</el-form-item>
				</el-col>
			</el-row>
	 	<el-form-item label="备注:" >
				<el-input size="small" v-model="form1.remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>
			</el-form-item>
		</el-form>
	</toast>
</template>
<script>
	import {
		queryPrice
	} from "../../../api/businessmgr-marketbase.js"

	import {
		submitChange,
		listUnit
	} from '../../../api/trademgr-ordermgr.js'

	export default {
		props: ['form'],
		data() {
			return {
				form1:{
					remark:''
				},
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
					title: "交易变更", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "800px", //弹窗宽
					btnData: [{
						name: '取消', //按钮名
						method: 'close', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '提交变更', //按钮名
						method: 'doSave', //回调函数
						bgColor: 'dialog-bule' //按钮背景
					}]
				}
			}
		},
		methods: {
			doUnitChange(value) {
/* 				let unit = this.unitArr.filter(item => item.id == this.form.n )[0]; */
				let index=this.unitArr.findIndex(item=>item.alias==value)
				let newUnitId=this.unitArr[index].id
				console.log(newUnitId,'newUnitId')
				this.$set(this.form, 'newUnitId',newUnitId)
		/* 		this.$set(this.form, 'newComputeRatio', unit.computeFormula)
				this.$set(this.form, 'newPrice', this.priceRecord.price * unit.computeFormula) */
				this.companySumPrice();
			},
			companySumPrice() {
				/* if (this.form.newPrice != null && this.form.newAmount != null) */
				/* this.form.newSumPrice=this.form1.newAmount*this.form.oldPrice */
				this.$set(this.form, 'newSumPrice', Number(this.form.oldPrice) * Number(this.form1.newAmount));
			},
			show(unitGroupId,oldUnit) {
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.form.newSumPrice=0
				this.form1.remark=''
             	this.$set(this.form1,'newUnit','')
				this.$set(this.form1,'newAmount','')
				listUnit({
					Vue: this,
					params: {
					id:unitGroupId
					}
				}).then(res => {
					if (res.result) {
					this.unitArr = res.model;
					}
				})    
			
					this.winConfig.dialogVisible = true;
			},
			 doSave() {
				 if(this.form.changeType=='交期变更'){
					 let arr={}
					 arr.oldPlanDate=this.form.oldPlanDate
					 arr.newPlanDate=this.form.newPlanDate
					 arr.remark=this.form1.remark
					 arr.orderDetailId=this.form.orderDetailId
					 arr.orderId=this.form.orderId
					 arr.changeType=this.form.changeType
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm("您确认提交变更？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								submitChange({
									Vue: this,
									params: arr
								}).then(res => {
									if (res.result) {
										this.winConfig.dialogVisible = false;
										this.$emit('callback');
									}
								})
							})

					}else {
                  console.log('error submit!!');
                  return false;
                }
				});
				 }else{
 
					this.$set(this.form, 'newAmount',this.form1.newAmount)
					this.$set(this.form, 'newUnit',this.form1.newUnit)
				
					this.$set(this.form, 'newSumPrice',this.form.newSumPrice)
		             this.$set(this.form, 'remark',this.form1.remark)
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm("您确认提交变更？", "系统提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								submitChange({
									Vue: this,
									params: this.form
								}).then(res => {
									if (res.result) {
										this.winConfig.dialogVisible = false;
										this.$emit('callback');
									}
								})
							})

					}else {
                  console.log('error submit!!');
                  return false;
                 }
				});
				 }

	
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
