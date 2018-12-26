<template>
  <toast :config="winConfig" @doSave="doSave" @close="winConfig.dialogVisible=false" class="invoice-win">
    <el-card style="margin: 5px 10px;">
      <deliver-form ref="form" :form="form" :tableData="tableData" :addOrderParam="addOrderParam" :orderDetailId='orderDetailId' :editModel="editModel" :winConfig="winConfig" @callback="callback"/>
    </el-card>
    <el-card style="margin: 5px 10px;">
      <deliver-detail-list :form="form" :tableData="tableData" :addOrderParam="addOrderParam" :editModel="editModel" @abc='abc'/>
    </el-card>

  </toast>
</template>
<script>
  import {
    matterDetailList
  } from '../../../api/trademgr-delivermgr.js'

  import DeliverForm from './deliver-form.vue'
  import DeliverDetailList from './deliver-detail-list.vue'

  export default {
    data() {
      return {
        orderDetailId:'',
        addOrderParam:{},
        form: {
          deliverTime:'',
          deliverUser:'',
          customerId:'',
          deliverAddrStr:'',
          remark:''
        },
        editModel: true,
        tableData: [],
        winConfig: { //办结弹窗数据
          title: "发货单信息", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "1300px", //弹窗宽
          btnData: [{
            name: '确认保存', //按钮名
            method: 'doSave', //回调函数
            bgColor: 'dialog-deep-blue' //按钮背景
          }, {
            name: '取消', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-normal' //按钮背景
          }]
        }
      }
    },
    methods: {
      abc(orderDetailId){
       this.orderDetailId=orderDetailId
      },
      show(row,flag,orderDetailId) {
        this.addOrderParam={};
        this.tableData=[];
        if (row.id != null && row.id > 0) {
          //查看操作
          this.editModel = flag;
          this.form={...row};
          matterDetailList({
            Vue: this,
            params: {
              deliveryId: row.id
            }
          }).then(res => {
            if (res.result) {
              this.tableData = res.model
              this.winConfig.dialogVisible = true;
              this.winConfig.btnData=[{
                name: '取消', //按钮名
                method: 'close', //回调函数
                bgColor: 'dialog-normal' //按钮背景
              }]
            }
          })
        } else {
          //新增操作
          this.editModel = flag;
          this.winConfig.dialogVisible = true;
         /*  this.winConfig.btnData=[{
            name: '确认保存', //按钮名
            method: 'doSave', //回调函数
          },{
            name: '取消', //按钮名
            method: 'close', //回调函数
          }] */
          setTimeout(()=>{
            this.form={}
            this.$refs.form.resetForm();
          },10);
        }

      },
      doSave(){
        this.$refs.form.doSave();
      },
      callback(){
        this.$emit("callback")
      }

    },
    components: {
      DeliverForm,
      DeliverDetailList
    }
  }
</script>
<style lang="less">
  .invoice-win {
    .el-form-item {
      margin-bottom: 12px;
    }

    .el-card__body {
      padding: 0px;
    }
  }
</style>
