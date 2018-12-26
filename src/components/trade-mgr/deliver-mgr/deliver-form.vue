<template>
  <el-form :rules="rules" ref="form" :model="form" label-width="110px">
    <el-row :gutter="4">
      <el-col :span="8">
        <el-form-item label="发货时间:" prop="deliverTime" >
          <el-date-picker size="small" v-model="form.deliverTime" type="date" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          :disabled="!editModel"/>
         </el-form-item>
       </el-col>
      <el-col :span="8">
        <el-form-item label="发货人:" prop="deliverUser">
          <el-input size="small" v-model="form.deliverUser" :disabled="!editModel"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="客户信息:" prop='customerId' v-show="!editModel" >
          <el-select
            size="small"
            style="width: 95%;"
            :disabled="!editModel"
            v-model="form.customerName"
            @change="addCustomName"
            placeholder="请输入客户信息">  
            <el-option
              v-for="item in customerArr"
              :key="item.id"
              :label="item.customerName"
              :value="item.customerId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户信息:" prop='customerName' v-show="editModel">
          <el-select
            size="small"
            style="width: 95%;"
            :disabled="!editModel"
            v-model="form.customerId"
            @change="addCustomName"
            placeholder="请输入客户信息">  
            <el-option
              v-for="item in customerArr"
              :key="item.id"
              :label="item.customerName"
              :value="item.customerId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="收货地址:" prop="deliverAddrStr" style="margin-top:10px">
          <el-select
            size="small"
            style="width: 95%;"
            :disabled="!editModel"
            v-model="form.deliverAddrStr"
            placeholder="请输入商品信息"
          >
            <el-option
              v-for="item in deliverAddrStrArr"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注:" style="margin-top:10px">
          <el-input size="small" v-model="form.remark" :disabled="!editModel" type="textarea" :rows="2"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {
    orderCustom,
    deliveryAdd
  } from '../../../api/trademgr-delivermgr.js'

  export default {
    props: ['form', 'editModel','tableData','winConfig','addOrderParam','orderDetailId'],
    data() {
      return {
        deliverAddrStrArr:[],
        customerArr:[],
        rules: {
          deliverTime: [{
            required: true,
            message: '请选择发货时间',
            trigger: 'change'
          }],
          deliverUser: [{
            required: true,
            message: '请输入发货人',
            trigger: 'change'
          }],
          customerId: [{
            required: true,
            message: '请输入客户信息',
            trigger: 'blur'
          }],
          deliverAddrStr: [{
            required: true,
            message: '请输入发货地址',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      addCustomName(value){
        console.log(value,'value')
        console.log(this.customerArr,'this.customerArr')
        this.customerArr.forEach((item)=>{if (item.customerId==value){this.form.customerName=item.customerName} })
      },
      resetForm(){
        this.$refs['form'].resetFields()
        let param = {}
        orderCustom({
          Vue: this,
          params: param
        }).then(res => {
          if (res.result) {
            this.customerArr=res.model.tradeOrder
            this.deliverAddrStrArr=res.model.addr
          }
        })
      },
      doSave(orderDetailId) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm("您确定发货？", "系统提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
                let param = {...this.form}
             
                param.detailList = JSON.parse(JSON.stringify(this.tableData))
                for(let attr in param.detailList){
                  console.log(param.detailList,'param.detailList')
                  param.detailList[attr].orderDetailId=this.orderDetailId
                  param.detailList[attr].deliverNumber=param.detailList[attr].deliverAmount
                  delete param.detailList[attr].deliverAmount
                }
                console.log(param,'***')
                deliveryAdd({
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
    },

  }
</script>
