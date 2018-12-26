import http from "./base.js"

export let orderPage = (data, self)=>{
    return http.fetchGet('/trade-order/page',data, self)
}
//交易变更申请
export let submitChange = (data, self)=>{
    return http.fetchGet('/trade-order/change-record/sumbit',data, self)
}
//服务商下拉

export let providerList = (data, self)=>{
    return http.fetchPost('/trade-order/provider/list',data, self)
}
//同意驳回接口

export let changSure = (data, self)=>{
    return http.fetchPost('/trade-order/changSure',data, self)
}
//关闭
export let close = (data, self)=>{
    return http.fetchPost('/trade-order/close',data, self)
}
//中止确认
export let sureClose = (data, self)=>{
    return http.fetchPost('/trade-order/sureClose',data, self)
}
export let changeRecordList = (data, self)=>{
    return http.fetchPost('/trade-order/change-record/list',data, self)
}
export let orderList = (data, self)=>{
    return http.fetchPost('/trade-order/list',data, self)
}
//订单确认
export let orderSure = (data, self)=>{
    return http.fetchPost('/trade-order/sure',data, self)
}
//收发货记录查询
export let shipOrReceipt = (data, self)=>{
    return http.fetchPost('/trade-order/shipOrReceipt',data, self)
}
//订单详情
export let detailList = (data, self)=>{
    return http.fetchPost('/trade-order/detail/list',data, self)
  }
//单位下拉
export let listUnit = (data, self)=>{
    return http.fetchPost('/trade-order/listUnit',data, self)
}
//获取companyId
export let findCompanyId = (data, self)=>{
    return http.fetchPost('/trade-order/findCompanyId',data, self)
}