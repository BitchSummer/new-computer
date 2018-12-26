<template>
	<div>
	<toolbar>
			<span slot="left">
				<el-radio-group v-model="queryParam.orderStatus" size="small" @change="doSearch2" v-show="queryParam.searchType=='order-search'">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="订单确认">订单确认</el-radio-button>
					<el-radio-button label="交易中">交易中</el-radio-button>
					<el-radio-button label="订单关闭">订单关闭</el-radio-button>
				</el-radio-group>
				<el-radio-group v-model="queryParam.status" size="small" @change="doSearch3" v-show="queryParam.searchType!='order-search'">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="订单确认">订单确认</el-radio-button>
					<el-radio-button label="交易中">交易中</el-radio-button>
					<el-radio-button label="业务确认">业务确认</el-radio-button>
					<el-radio-button label="中止确认">中止确认</el-radio-button>
					<el-radio-button label="完成确认">完成确认</el-radio-button>
					<el-radio-button label="交易中止">交易中止</el-radio-button>
					<el-radio-button label="交易完成">交易完成</el-radio-button>
				</el-radio-group>
				<el-input size="small" style="width: 150px;" v-model="queryParam.productName" placeholder="商品名称搜索..." v-show="queryParam.searchType=='product-search'" />
				<el-input size="small" style="width: 150px;" v-model="queryParam.orderCode" placeholder="订单号搜索..." v-show="queryParam.searchType=='order-search'" />
			<!-- 	<el-input size="small" style="width: 150px;" v-model="queryParam.province" placeholder="服务商搜索..." v-show="queryParam.searchType=='order-search'"  /> -->
			     <el-select  size="small" style="width: 150px;"  v-model="queryParam.providerId" placeholder="服务商搜索..." v-show="queryParam.searchType=='order-search' " clearable>
					<el-option
						v-for="item in provinceArr"
						:key="item.providerId"
						:label="item.providerName"
						:value="item.providerId">
					</el-option>
			     </el-select>
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary" @click="doSearch1" v-show="queryParam.searchType=='order-search'">查询</el-button>
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary" @click="doSearch3" v-show="queryParam.searchType!='order-search'">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="doReset" v-show="queryParam.searchType=='product-search'">清空条件</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="doReset1" v-show="queryParam.searchType=='order-search'">清空条件</el-button>
				<el-button size="small" type="text" @click="one();queryParam.searchType=queryParam.searchType=='order-search'?'product-search':'order-search'">
				{{queryParam.searchType=='order-search'?'商品搜索':'订单搜索'}}
				</el-button>
			</span>
		</toolbar>
		<el-card class="box-card" v-for="order in tableData" style="clear: both;margin: 10px;">
		  <div slot="header" class="flexbox clearfix">
			<span class="orderTime text">订单时间:{{order.createTime}}</span>
			<span class="orderCode text">订单号:{{order.orderCode}}</span>
			<span class="providerName text">客户信息:{{order.customerName}}</span>
			<span class="orderMoney text">订单金额:{{order.orderMoney}}</span>
			<span class="sumInvMoney text">发票进度:{{order.sumInvMoney}}</span>
			<span class="sumBalanceMoney text">结算进度:{{order.sumBalanceMoney}}</span>
			<span class="status text">订单状态:{{order.status}}</span>
			<span class="btn">
				<el-button size="small" type="danger" v-if="order.status=='订单确认'" @click="doOrderSure(order.id)">批量确认</el-button>
			</span>
		  </div>
		
			  <el-table  ref="table" :data="order.detailList" style="width: 100%">
			<el-table-column type="selection" width="55" />
		  	<el-table-column resizable show-overflow-tooltip property="isStandard"  label="商品详情" >
		  		<template slot-scope="scope">
					<img :src="scope.row.productImgUrl" width="64px" height="64px" /> {{scope.row.productName}}
		  		</template>
		  	</el-table-column>
		  	<el-table-column resizable show-overflow-tooltip property="productSpec" align="center" label="规格型号" width="100" />
			<el-table-column resizable show-overflow-tooltip property="unit" align="center" label="单位" width="100" >
						 	<template slot-scope="scope">
				    {{scope.row.unit=='undefined'?null:scope.row.unit}}   
				</template> 
			</el-table-column>
		  	<el-table-column resizable show-overflow-tooltip property="price" align="center" label="单价" width="100" />
			<el-table-column resizable show-overflow-tooltip property="amount" align="center" label="数量" width="100" />
			<el-table-column resizable show-overflow-tooltip property="deliverAmount" align="center" label="发货数量" width="100" >
				<template slot-scope="scope">
					{{scope.row.deliverAmount}}/{{scope.row.amount}}
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="sumPrice" align="center" label="总价" width="100" />
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" >
			 	<template slot-scope="scope">
				    {{scope.row.remark=='undefined'?null:scope.row.remark}}   
				</template>  
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="deliveryPlanDate" align="center" label="计划交货日期" width="110" />
			<el-table-column resizable show-overflow-tooltip property="status" align="center" label="交易状态" width="100" />
		  	<el-table-column label="操作" align="center" width="85">

		  		<template slot-scope="scope">
					<el-button size="mini" type="text" v-show="scope.row.status=='订单确认'" @click="doOrderDetailSure(scope.row)" style="margin-left: 10px">订单确认</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status=='交易中'" @click="doTradeChange(scope.row)" style="margin-left: 10px">交易变更</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status=='业务确认'&&scope.row.providerId==companyId" @click="doTradeSure(scope.row)">变更确认</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status=='交易中'" @click="doTradeClose(scope.row)">交易关闭</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status=='中止确认'&&scope.row.providerId==companyId" @click="doSureFinish(scope.row)">中止确认</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status=='完成确认'&&scope.row.providerId==companyId" @click="doSureFinish(scope.row)">完成确认</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status!='交易确认'" @click="doTradeChangeList(scope.row)">变更记录</el-button>
					<el-button size="mini" type="text" v-show="scope.row.status!='交易确认'"  @click="doDeliveryRecord(scope.row)">发货记录</el-button>
		  		</template>
		  	</el-table-column>
		</el-table>
		</el-card>
			<toast :config='finishConfig' @agree='agree' @disagree="disagree">
         <div>
			 <template slot-scope="scope">
			 <span v-show="scope.row.status=='完成确认'">是否完成确认</span>
			 <span v-show="scope.row.status=='中止确认'">是否中止确认</span>
			 </template>
         </div>
		</toast>
			<toast :config='finishConfig' @agree='agree' @disagree="disagree">
         <div>
			 <template slot-scope="scope">
			 <span v-show="scope.row.status=='完成确认'">是否完成确认</span>
			 <span v-show="scope.row.status=='中止确认'">是否中止确认</span>
			 </template>
         </div>
		</toast>
		<toast  :config='recordConfig' @closeRecord='closeRecord'>		 
		  <el-table  ref="table" height="600" :data="tableData2" style="width: 100%">
			<el-table-column resizable show-overflow-tooltip property="status" align="center" label="流程状态" />
			<el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号" />
			<el-table-column resizable show-overflow-tooltip property="orderTime" align="center" label="下单时间" width="110" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称" />
			<el-table-column resizable show-overflow-tooltip property="productSpec" align="center" label="产品规格" />
			<el-table-column resizable show-overflow-tooltip property="deliveryActualAmount" align="center" label="订单数量" />
			<el-table-column resizable show-overflow-tooltip property="unit" align="center" label="单位" />
			<el-table-column resizable show-overflow-tooltip property="undeliveredAmount" align="center" label="未发货数量"/>
			<el-table-column resizable show-overflow-tooltip property="deliverAmount" align="center" label="本次发货数量"/> 
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注"/> 
		  </el-table>
		</toast>
		<div class="my-pagination">
		<page-tool @doSearch3="doSearch3"  @doSearch1="doSearch1"   @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
		<change-win :form="changeForm" ref='changeWin' @callback='callback'/>
		<change-list-win :form="changeForm" ref="changeListWin" />
		<close-win ref="closeWin" @callback='callback'/>
		<sure-win ref="sureWin" :form="changeForm"  @callback='callback'/>
	    </div>
</template>
<script>
	import {
		providerList,
		orderPage,
		orderSure,
		sureClose,
		shipOrReceipt,
		findCompanyId
	} from '../../../api/trademgr-ordermgr.js'
	
	import ChangeWin from './change-win.vue'
	import ChangeListWin from './change-list-win.vue'
	import CloseWin from './close-win.vue'
	import SureWin from './sure-win.vue'
	export default {
		data() {
			return {
				orderDetailId:'',
				orderId:'',
				companyId:'',
				row:'',
				provinceArr:[],
				changeForm:{},
				tableData:[],
				tableData2:[],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				queryParam:{
					searchType:'product-search',
					orderStatus:'',
					status:''
				},
				finishConfig:{ //办结弹窗数据
					title: "提示消息", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "300px", //弹窗宽
					btnData: [{
						name: '驳回', //按钮名
						method: 'disagree', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '同意', //按钮名
						method: 'agree', //回调函数
						bgColor: 'dialog-bule' //按钮背景
					}]
				},
				recordConfig:{ //办结弹窗数据
					title: "发货记录", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1200px", //弹窗宽
					btnData: [{
						name: '关闭', //按钮名
						method: 'closeRecord', //回调函数
						bgColor: 'dialog-bule' //按钮背景
					}]
				},
			};
		},
		mounted(){
		  this.providerList(),
		    findCompanyId({
					Vue:this,
					params:{}
					}).then(res=>{
					if(res.result){
						this.companyId=res.model[0].companyId
						console.log(this.companyId,'res.model')
					}
				})
		},
		methods:{
				//点击不同类型搜索刷新页面操作
			one(page){
				if(this.queryParam.searchType=='order-search'){
					this. doSearch3(page)
				}else if(this.queryParam.searchType=='product-search'){
					this. doSearch1(page)
				}
            
			},
			//发货记录关闭
			closeRecord(){
            this.recordConfig.dialogVisible=false
			},
			//发货记录
			doDeliveryRecord(row){
			this.recordConfig.dialogVisible=true
			shipOrReceipt({
						Vue:this,
						params:{
							id:row.id,
						}
						}).then(res=>{
						if(res.result){
                    this.tableData2=res.model
						}
				})
			},
			//服务商下拉
			providerList(){
				providerList({
					Vue:this,
						}).then(res=>{
						if(res.result){
							this.provinceArr=res.model
							/* this.page.total= res.model.numRows
							this.tableData = res.model.items; */
						}
				})
			},
			doOrderSure(orderId,page){
				this.$confirm('订单信息无误，您确认?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					orderSure({
						Vue: this,
						params: {
							orderId: orderId,
						}
					}).then(res => {
						if (res.result)
							this.doSearch(page)
					})
				})
			},
			agree(row,page){
			this.finishConfig.dialogVisible=false
	        if(this.row.status=='完成确认'){
                sureClose({
						Vue:this,
						params:{
							customerId:this.row.customerId,
							id:this.row.id,
							orderId:this.row.orderId,
							status:"交易完成",
							providerId:this.row.providerId,
							remark:this.row.remark
						}
						}).then(res=>{
						if(res.result){
						 this.doSearch(page)
						}
				})
					}else{
                     sureClose({
						Vue:this,
						params:{
							customerId:this.row.customerId,
							id:this.row.id,
							orderId:this.row.orderId,
							status:'交易中止',
							providerId:this.row.providerId,
							remark:this.row.remark
						}
						}).then(res=>{
						if(res.result){
						 this.doSearch(page)
						}
				  })
					}
			},
			disagree(row,page){
			this.finishConfig.dialogVisible=false
	        if(this.row.status=='完成确认'){
                sureClose({
						Vue:this,
						params:{
							customerId:this.row.customerId,
							id:this.row.id,
							orderId:this.row.orderId,
							status:"交易中",
							providerId:this.row.providerId,
							remark:this.row.remark
						}
						}).then(res=>{
						if(res.result){
						 this.doSearch(page)
						}
				})
					}else{
                     sureClose({
						Vue:this,
						params:{
							customerId:this.row.customerId,
							id:this.row.id,
							orderId:this.row.orderId,
							status:'交易中',
							providerId:this.row.providerId,
							remark:this.row.remark
						}
						}).then(res=>{
						if(res.result){
						 this.doSearch(page)
						}
				  })
					}
			},
			//完成确认，中止确认
			doSureFinish(row,page){
			this.finishConfig.dialogVisible=true
			this.row=row
			},
			callback(page){
            this.doSearch(page)
			},
			doOrderDetailSure(row,page){
				console.log(row,'row')
				this.$confirm('订单明细信息无误，您确认?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					orderSure({
						Vue: this,
						params: {
							orderId:row.orderId,
							orderDetailId:row.id
						}
					}).then(res => {
						if (res.result)
							this.doSearch(page)
					})
				})
			},
		/* 	sureOrderOrOrderDetail(row){
				console.log(row,orderDetailId,'row,orderDetailId')
					orderSure({
						Vue: this,
						params: {
							orderId: row,orderId,
							orderDetailId:row.orderDetailId
						}
					}).then(res => {
						if (res.result)
							this.doSearch()
					})
			}, */
			//交易变更
			doTradeChange(row){
				console.log(row,'rowwwwwwww')
				this.changeForm={
					changeType:'数量变更',
					orderId: row.orderId,
					orderDetailId: row.id,
					unitGroupId:row.unitGroupId,
					unitGroupName: row.unitGroupName,
					productId:row.productId,
					productDetailId: row.productDetailId,
					oldSumPrice:row.sumPrice,
					oldPrice: row.price,
					oldAmount: row.amount,
					oldUnitId:row.unitId,
					oldComputeRatio:row.computeRatio,
					oldPlanDate: row.deliveryPlanDate,
					oldProductName:row.productName,
					oldSpec: row.productSpec,
					oldUnit:row.unit,
					newSumPrice:row.newSumPrice,
					newPrice: row.price,
				/* 	newAmount:row.newAmount,
					newUnitId:row.newUnitId,
				    newUnit:row.newUnit, */
				}
				this.$refs.changeWin.show(row.unitGroupId,row.unit);
			},
			//变更确认
			doTradeSure(row){
					this.changeForm={
					changeType:'数量变更',
					orderId: row.orderId,
					orderDetailId: row.id,
					unitGroupId:row.unitGroupId,
					unitGroupName: row.unitGroupName,
					productId:row.productId,
					productDetailId: row.productDetailId,
					oldSumPrice:row.sumPrice,
					oldPrice: row.price,
					oldAmount: row.amount,
					oldUnitId:row.unitId,
					oldComputeRatio:row.computeRatio,
					oldPlanDate: row.deliveryPlanDate,
					oldProductName:row.productName,
					oldSpec: row.productSpec,
					oldUnit:row.unit,
					newAmount:''
				}
             this.$refs.sureWin.show(row.id);
			},
			//交易关闭
			doTradeClose(row){
				this.$refs.closeWin.show(row.orderId,row.id);
			},
			//变更记录
			doTradeChangeList(row){
				this.$refs.changeListWin.show(row.orderId,row.id);
			},
				//清空
			doReset(){
			this.$nextTick(()=>{
             this.queryParam.productName = '';
              })
			},
			//清空
			doReset1(){
					if(this.queryParam.providerId!==null&&this.queryParam.orderCode==null)
					{this.queryParam.providerId = null }
				else if(this.queryParam.orderCode!==null&&this.queryParam.providerId==null)
				    { this.queryParam.orderCode = null}
				else if (this.queryParam.providerId!==null&&this.queryParam.orderCode!==null){
					this.queryParam.providerId = null 
					this.queryParam.orderCode = null
				  }
			    },
			//刷新页面
		    doSearch(page){
				let param = {}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
				   orderPage({
						Vue:this,
						params:param
						}).then(res=>{
						if(res.result){
							this.page.total= res.model.numRows
							this.tableData = res.model.items;
						}
				})
			},
			 doSearch1(page){
				let param = {
				...this.queryParam
					}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
					delete param.status
					delete param.searchType 
					orderPage({Vue: this, params: param}).then(res => {
						if (res.result) {
						 if(res.model){
							 this.tableData = res.model.items
							 this.page.total = res.model.numRows
						 }	else{
							 this.tableData = ''
							 this.page.total = res.model.numRows
						 }	
					}
					})
				} ,
			 doSearch2(page){ 
				let param = {
				...this.queryParam
					}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
					delete param.status
					delete param.searchType 
					orderPage({Vue: this, params: param}).then(res => {
						if (res.result) {
						 if(res.model){
							 this.tableData = res.model.items
							 this.page.total = res.model.numRows
						 }	else{
							 this.tableData = ''
							 this.page.total = res.model.numRows
						 }	
					}
					})
				},
				doSearch3(page){ 
				let param = {
				...this.queryParam
					}
					if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
					}
					param.pageNo = this.page.pageNo
					param.pageSize = this.page.pageSize
					delete param.orderStatus
					delete param.searchType 
					orderPage({Vue: this, params: param}).then(res => {
						if (res.result) {
						 if(res.model){
							 this.tableData = res.model.items
							 this.page.total = res.model.numRows
						 }	else{
							 this.tableData = ''
							 this.page.total = res.model.numRows
						 }	
					}
					})
				},
		},
	components: {
			ChangeWin,
			ChangeListWin,
			CloseWin,
			SureWin
		}
	}
</script>

<style lang="less">
	.flexbox{
		display: flex;
		.text{
			margin-top: 5px;
			color: #666;
			font: 12px/1.5 tahoma,arial,Hiragino Sans GB,\\5B8B\4F53,sans-serif;
		}
	    .orderTime{
			width:192px;
		}
		.orderCode{
			width:140px;
		}
		.providerName{
			flex:1;
		}
		.orderMoney{
			width: 100px;
		}
		.sumDeliveryAmount{
			width: 100px;
		}
		.sumInvMoney{
			width: 100px;
		}
		.sumBalanceMoney{
			width: 100px;
		}
		.status{
			width: 130px;
		}
		.btn{
			width:100px;
		}
	}
</style>
