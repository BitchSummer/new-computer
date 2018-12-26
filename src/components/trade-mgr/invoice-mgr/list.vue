<template>
  <div>
    <toolbar>
			<span slot="left">
				<el-radio-group v-model="queryParam.status" size="small" @change="doSearch">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="待开票">待开票</el-radio-button>
					<el-radio-button label="待签收">待签收</el-radio-button>
					<el-radio-button label="拒签收">拒签收</el-radio-button>
					<el-radio-button label="已签收">已签收</el-radio-button>
				</el-radio-group>
				<el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="客户名称搜索..."/>
				<el-input size="small" style="width: 150px;" v-model="queryParam.invoiceNo" placeholder="票据单号搜索..."/>
				<el-button icon="el-icon-search" size="small" style="width: 70px;" type="primary"
                   @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 90px;" @click="doReset">清空条件</el-button>
			</span>
    </toolbar>
    <el-table ref="table" height="600" :data="tableData" style="width: 100%" @row-dblclick="doView">
      <el-table-column type="selection" align="center" width="50"/>
      <el-table-column resizable show-overflow-tooltip property="status" align="center" label="流程状态"/>
      <el-table-column resizable show-overflow-tooltip property="customerName" label="客户名称" align="center"/>
      <el-table-column resizable show-overflow-tooltip label="开票申请" align="center">
        <el-table-column resizable show-overflow-tooltip property="applyTime" label="申请时间" width="110"/>
        <el-table-column resizable show-overflow-tooltip property="orderCount" align="center" label="订单数"/>
        <el-table-column resizable show-overflow-tooltip property="invoiceMoney" align="center" label="申请金额"/>
        <el-table-column resizable show-overflow-tooltip property="invoiceType" align="center" label="开票类型"/>
        <el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注"/>
      </el-table-column>
      <el-table-column resizable show-overflow-tooltip label="商户签发" align="center">
        <el-table-column resizable show-overflow-tooltip property="signOutTime" align="center" label="签发时间"/>
        <el-table-column resizable show-overflow-tooltip property="invoiceNo" align="center" label="票据号"/>
      </el-table-column>
      <el-table-column resizable show-overflow-tooltip label="客户签收" align="center">
        <el-table-column resizable show-overflow-tooltip property="signInTime" align="center" label="签收时间"/>
        <el-table-column resizable show-overflow-tooltip property="signInUser" align="center" label="签收人"/>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" :disabled="!(scope.row.status=='待开票'||scope.row.status=='拒签收')"
                     @click="doSignOut(scope.row)">发票签发
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="my-pagination">
      <page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
    </div>

    <invoice-win ref='invoiceWin' @callback="callback"/>

    <Toast :config="detailConfig" @close="close">
      <div>
        <el-form :model="form" label-width="110px">
          <el-row :gutter="4">
            <el-col :span="8">
              <el-form-item label="申请时间:" prop="applyTime">
                <el-date-picker size="small" v-model="form.applyTime" type="date" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择申请时间" disabled>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人:" prop="applyUser">
                <el-input size="small" v-model="form.applyUser" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务商:" prop="providerId" disabled>
                <el-input size="small" v-model="form.providerName" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="票据类型:" prop="invoiceType" disabled>
                <el-input size="small" v-model="form.invoiceType"  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="票据金额:">
               <el-input size="small" v-model="form.invoiceMoney" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开票信息:" prop="invoiceAddrId">
               <el-input size="small" v-model="form.invoiceAddrId" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="开票详情:">
                <el-input size="small" v-model="form.invoiceAddrStr" disabled type="textarea" :rows="2"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input size="small" v-model="form.remark" type="textarea" :rows="2" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table ref="table" height="200" :data="detailData" style="width: 100%">
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column resizable show-overflow-tooltip property="orderCode" align="center" label="订单号"/>
          <el-table-column resizable show-overflow-tooltip property="orderTime" label="下单时间" width="110"/>
          <el-table-column resizable show-overflow-tooltip property="orderMoney" align="center" label="订单金额"/>
          <el-table-column resizable show-overflow-tooltip property="noPayInvoice" align="center" label="已开票总额"></el-table-column>
          <el-table-column resizable show-overflow-tooltip property="noPayInvoice" align="center" label="未开票总额"/>
          <el-table-column resizable property="payInvoice" align="center" label="本次开票" width="140"></el-table-column>
          <el-table-column resizable align="center" label="备注" property="remark" width="140"></el-table-column>
        </el-table>
      </div>
    </Toast>
  </div>
</template>

<script>
  import {
    invoicePage,
    invoiceDetailList
  } from '../../../api/trademgr-invoicemgr.js'

  import InvoiceWin from './invoice-win.vue'

  export default {
    data() {
      return {
        detailData: [],
        tableData: [],
        form: {
          applyTime: '',
          applyUser: '',
          providerId: '',
          invoiceType: '',
          invoiceMoney: '',
          invoiceAddrId: '',
          invoiceAddrStr: '',
          remark: ''
        },
        detailConfig: {
          //办结弹窗数据
          title: "开票申请", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "1300px", //弹窗宽
          btnData: [{
            name: '关闭', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-white' //按钮背景
          }]
        },
        page: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          status: ''
        }
      };
    },
    methods: {
      callback(){
        this.doSearch()
      },
      close() {
        this.detailConfig.dialogVisible = false
      },
      doView(row) {
        invoiceDetailList({
          Vue: this,
          params: {
            invoiceId: row.id
          }
        }).then(res => {
          if (res.result) {
            this.detailData=[]
            res.model.forEach(item => {
              this.detailData.push(item)
            })
          }
        });
        console.log(row, 'row')
        this.detailConfig.dialogVisible = true
        this.form = {...row}
      },
      doReset() {
        this.queryParam.providerName = null;
        this.queryParam.invoiceNo = null
      },
      doSignOut(row) {
        let form = {...row}
        this.$refs.invoiceWin.show(form);
      },
      refuseSignIn(id) {
        this.$prompt('请输入拒签理由', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          this.doSignInOrRefuse(id, '拒签收', value)
        })
      },
      doSignInOrRefuse(id, status, remark) {
        signInInvoice({
          Vue: this,
          params: {
            id: id,
            status: status,
            remark: remark
          }
        }).then(res => {
          if (res.result)
            this.doSearch()
        })
      },
      doSearch(page) {
        let param = {
          ...this.queryParam
        }
        if (page == null || page.pageNo == null) {
          this.page.pageNo = 1
        }
        param.pageNo = this.page.pageNo
        param.pageSize = this.page.pageSize
        invoicePage({Vue: this, params: param}).then(res => {
          if (res.result) {
            this.page.total = res.model.numRows
            this.tableData =res.model.items;
          }
        })
      }
    },
    components: {
      InvoiceWin
    }
  }
</script>

<style lang="less">
  .flexbox {
    display: flex;
    .text {
      margin-top: 5px;
      color: #666;
      font: 12px/1.5 tahoma, arial, Hiragino Sans GB, \\5B8B\4F53, sans-serif;
    }
    .orderTime {
      width: 180px;
    }
    .orderCode {
      width: 130px;
    }
    .providerName {
      flex: 1;
    }
    .orderMoney {
      width: 100px;
    }
    .sumDeliveryAmount {
      width: 100px;
    }
    .sumInvMoney {
      width: 100px;
    }
    .sumBalanceMoney {
      width: 100px;
    }
    .status {
      width: 130px;
    }
    .btn {
      width: 100px;
    }
  }
</style>
