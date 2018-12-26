<template>
	<div>
		<toolbar>
			<span slot="right">
					<el-select
					size="small"
					v-model="addOrderParam.orderId"
					filterable
					remote
					reserve-keyword
          v-show="editModel"
					placeholder="请输入订单号"
          @change="queryOrderDetail"
					:remote-method="queryOrderList">
					<el-option
						v-for="item in orderArr"
						:key="item.id"
						:label="item.orderCode"
						:value="item.id">
					</el-option>
					</el-select>
					<el-select
					size="small"
          v-show="editModel"
					v-model="addOrderParam.productDetailId"
					placeholder="请输入商品信息"
          @change="querySpec"
					>
					<el-option
						v-for="item in productArr"
						:key="item.productDetailId"
						:label="item.productName"
						:value="item.productDetailId">
					</el-option>
					</el-select>
					<el-select
					size="small"
          v-show="editModel"
					v-model="addOrderParam.specProductId"
					placeholder="请输入商品规格">
					<el-option
						v-for="item in productDetailArr"
						:key="item.id"
						:label="item.productSpec"
						:value="item.productDetailId">
					</el-option>
					</el-select>
				<el-button icon="el-icon-plus" v-show="editModel" size="small" style="width: 100px;" type="danger" @click="addOrder">添加</el-button>
			</span>
		</toolbar>
		<el-table ref="table" height="200" :data="tableData" style="width: 100%" >
			<el-table-column type="selection" align="center" width="50" />
			<el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号" />
			<el-table-column resizable show-overflow-tooltip property="orderTime" align="center" label="下单时间" width="110" />
			<el-table-column resizable show-overflow-tooltip property="productName" align="center" label="产品名称" />
			<el-table-column resizable show-overflow-tooltip property="productSpec" align="center" label="产品规格" />
			<el-table-column resizable show-overflow-tooltip property="orderAmount" align="center" label="订单数量"  v-if="!editModel"/>
			<el-table-column resizable show-overflow-tooltip property="deliveryActualAmount" align="center" label="订单数量"   v-else/>
			<el-table-column resizable show-overflow-tooltip property="unit" align="center" label="单位" />
			<el-table-column resizable show-overflow-tooltip property="undeliveredAmount" align="center" label="未发货数量" >
				<template slot-scope="scope">
				{{parseFloat(scope.row.undeliveredAmount)}}
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="deliverAmount" align="center" label="本次发货数量" >
					<template slot-scope="scope">
						<el-input-number :controls="false" size="small" v-model="scope.row.deliverAmount"  :disabled="!editModel" :precision="2" @change="calculated(scope.row)" placeholder="请输入本次发货" />
					</template>
				</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" >
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.remark" placeholder="请输入内容" :disabled="!editModel"/>
					</template>
				</el-table-column>
			<el-table-column label="操作" align="center" width="100">
				<template slot-scope="scope">
					<el-button size="mini" type="text" :disabled="!editModel" @click="deleteRow(scope.$index,scope.row)">移除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	import {
		orderList,
    detailList
	} from '../../../api/trademgr-ordermgr.js'
	export default {
		props: ['form','tableData','editModel','addOrderParam'],
		data() {
			return {
				orderDetailId:'',
				orderArr:[],
				productArr:[],
				productDetailArr:[]
			};
		},
		methods: {
      calculated(row){
				row.undeliveredAmount=row.deliveryActualAmount-row.deliverAmount
			 if(row.deliverAmount>row.deliveryActualAmount){
				  this.$message({
            message: '不能超过订单数量',
            type: 'warning'
          });
			 }
      },
			queryOrderList(keyword){
				if(this.form.customerId==null||this.form.customerId==0){
					this.$message({
						message: '请选择客户信息',
						type: 'warning'
					});
					return;
				}else{
					orderList({
						Vue: this,
						params: {
							status:'交易中',
							orderCode:keyword,
							customerId: this.form.customerId
						}
					}).then(res => {
						if (res.result) {
							this.orderArr = res.model
						}
					})
				}
			},
			addOrder(){
				if(this.addOrderParam.specProductId==null||this.addOrderParam.specProductId==0){
					this.$message({
						message: '请选择商品规格',
						type: 'warning'
					});
					return;
				}else{
					let orderTemp ={}
          orderTemp.orderCode=this.productDetailArr[0].orderCode
          this.orderArr.forEach((item)=>{if (item.productId=this.addOrderParam.specProductId){orderTemp.orderTime=item.orderTime;orderTemp.undeliveredAmount=this.productDetailArr[0].amount-item.sumDeliveryAmount} })
          orderTemp.productName=this.productDetailArr[0].productName
          orderTemp.productSpec=this.productDetailArr[0].productSpec
          orderTemp.orderAmount=this.productDetailArr[0].amount
					orderTemp.unit=this.productDetailArr[0].unit
					orderTemp.undeliveredAmount=this.productDetailArr[0].deliveryActualAmount-this.productDetailArr[0].deliverAmount
					//deliveryActualAmount deliverAmount
					orderTemp.deliveryActualAmount=this.productDetailArr[0].deliveryActualAmount
					this.tableData.splice(0,0,orderTemp);
				}
				  this.addOrderParam.orderId=null
          this.addOrderParam.specProductId=null
					this.addOrderParam.productDetailId=null
			},
			deleteRow(index, row) { //移除
				if(row.id==null||row.id==0)
					this.tableData.splice(index, 1);
				else
					this.$set(this.tableData[index],'deleted',true);
			},
      queryOrderDetail(){
        if(this.addOrderParam.orderId==null||this.addOrderParam.orderId==0){
          this.$message({
            message: '请选择订单信息',
            type: 'warning'
          });
          return;
        }else{
          detailList({
            Vue: this,
            params: {
							status:'交易中',
              orderId:this.addOrderParam.orderId,
              customerId: this.form.customerId
            }
          }).then(res => {
            if (res.result) {
							this.productArr = res.model
							this.productArr.forEach(item=>{
								this.orderDetailId=item.id
							})
								this.$emit('abc',this.orderDetailId)
						}  
          })
				}
      },
      querySpec(){
        if(this.addOrderParam.productDetailId==null||this.addOrderParam.productDetailId==0){
          this.$message({
            message: '请选择商品信息',
            type: 'warning'
          });
          return;
        }else{
          this.productDetailArr=[]
          this.productArr.forEach( (item) =>{
            if (this.addOrderParam.productDetailId==item.productDetailId)
              this.productDetailArr.push(item)
          })
        }
      }
		}
	}
</script>

