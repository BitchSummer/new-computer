//变更记录
<template>
<div>
	<toast :config="winConfig" @close="winConfig.dialogVisible=false">
		<el-table  ref="table" :data="tableData" style="margin-bottom: 20px;">
			<el-table-column type="index" width="55" />
			<el-table-column resizable show-overflow-tooltip property="status"  label="流程状态" />
			<el-table-column resizable show-overflow-tooltip property="changeType" align="center" label="变更类型" width="100" />
			<el-table-column resizable show-overflow-tooltip property="changeTime" align="center" label="发起时间" width="180" />
			<el-table-column resizable show-overflow-tooltip property="changeCompanyName" align="center" label="发起单位"  />
			<el-table-column resizable show-overflow-tooltip property="sureTime" align="center" label="确认时间" width="180" />
			<el-table-column resizable show-overflow-tooltip property="sureCompanyName" align="center" label="确认单位"  />
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注"  />
			<el-table-column label="操作" align="center" width="85">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click='detail(scope.row)'>详情</el-button>
				</template>
			</el-table-column>
		</el-table>
	</toast>
	<toast :config="winConfig1" @close1='close1'>
		<el-form  status-icon :data="tableData1" label-width="140px" :model='form'>
			<el-form-item label="变更类型:" prop="companyName"  v-show="tableData1.changeType=='交期变更'">交期变更
				</el-form-item>
			 <el-form-item label="变更类型:" prop="companyName"  v-show="tableData1.changeType=='数量变更'">数量变更
				</el-form-item>
			<h1>变更前:</h1>
			<el-row>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="单位组:">
						<el-input size="small" v-model="tableData1.unitGroupName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品数量:">
						<el-input size="small" v-model="tableData1.oldAmount" disabled ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品单位:">
						<el-input size="small" v-model="tableData1.oldUnit" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="单位单价:">
						<el-input size="small" v-model="tableData1.oldPrice" disabled></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品总价:">
						<el-input size="small" v-model="tableData1.oldSumPrice" disabled ></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-show="tableData1.changeType=='交期变更'">
					<el-form-item label="计划交期:">
						<el-input size="small" v-model="tableData1.oldPlanDate" disabled ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<h1>变更后:</h1>
			<el-row>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="单位组:" >
						<el-input size="small" v-model="tableData1.unitGroupName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品单位:" >
					<!--  <el-select size="small" collapse-tags v-model="form.newUnitId" placeholder="请选择单位" disabled>
							<el-option v-for="item in unitArr" :key="item.id" :label="item.alias" :value="item.id">
							</el-option>
						</el-select>    -->
						<el-input size="small" v-model="tableData1.newUnitId"   disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品数量:" >
						<el-input size="small" v-model="tableData1.newAmount"    disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="单位单价:" >
						<el-input size="small" v-model="tableData1.oldPrice"  disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='数量变更'">
					<el-form-item label="产品总价:" >
					 <el-input size="small" v-model="tableData1.newSumPrice" disabled></el-input> 
					<!-- 	{{tableData1.newAmount*tableData1.oldPrice}} -->
					</el-form-item>
				</el-col>
				<el-col :span="8" v-show="tableData1.changeType=='交期变更'">
					<el-form-item label="计划交期:" >
						<el-date-picker size="small" disabled v-model="tableData1.newPlanDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注:">
				<el-input size="small" v-model="tableData1.remark"  type="textarea" :rows="2" disabled></el-input>
			</el-form-item>
		</el-form>
	</toast>
</div>
</template>
<script>

	import {
		changeRecordList
	} from '../../../api/trademgr-ordermgr.js'

	export default {
			props: ['form'],
		data() {
			return {
				orderDetailId:'',
				tableData: [],
				tableData1:[],
				winConfig: { //办结弹窗数据
					title: "变更记录", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1100px", //弹窗宽
					btnData: [{
						name: '关闭窗口', //按钮名
						method: 'close', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}]
				},
				winConfig1: { //办结弹窗数据
					title: "详情", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1100px", //弹窗宽
					btnData: [{
						name: '关闭窗口', //按钮名
						method: 'close1', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}]
				}

			}
		},
		methods: {
			close1(){
            this.winConfig1.dialogVisible=false
			},
			detail(row,orderDetailId){
			 changeRecordList({
					Vue: this,
					params: {
						changeRecordId:row.id,
						orderDetailId:this.orderDetailId
					}
				}).then(res => {
					if (res.result) {	
						res.model.forEach(item => {
							this.tableData1 = item;
							this.tableData1.oldSumPrice=this.tableData1.oldAmount*this.tableData1.oldPrice
							this.tableData1.newSumPrice=this.tableData1.newAmount*this.tableData1.oldPrice
							if(this.tableData1.unitGroupName=='undefined'||this.tableData1.oldUnit==='undefined'){
							 this.$set(this.tableData1,'unitGroupName','0')
							 this.$set(this.tableData1,'oldUnit','0')  
								}
							/* 	else if(this.tableData1.newAmount*this.tableData1.oldPrice==NaN){
                                let this.tableData1.newAmount*this.tableData1.oldPrice=''
								} */
						})
						this.winConfig1.dialogVisible = true
					}
				})
			},
			show(orderId,orderDetailId) {
				this.orderDetailId=orderDetailId
				changeRecordList({
					Vue: this,
					params: {
					/* 	type: "变更待确认", */
						orderDetailId: orderDetailId
					}
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
						this.winConfig.dialogVisible = true;
					}
				})

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
