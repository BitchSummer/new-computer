import http from "./base.js"

export let invoicePage = (data, self)=>{
    return http.fetchGet('/trade-invoice/page',data, self)
}

export let invoiceApply = (data, self)=>{
    return http.fetchGet('/trade-invoice/apply',data, self)
}

export let signOutInvoice = (data, self)=>{
    return http.fetchPost('/trade-invoice/sign-out',data, self)
}

export let invoiceDetailList = (data, self)=>{
    return http.fetchPost('/trade-invoice/detail/list',data, self)
}