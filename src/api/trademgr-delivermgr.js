import http from "./base.js"

export let matterPage = (data, self)=>{
    return http.fetchGet('/trade-delivery/matter-page',data, self)
}

export let matterDetailList = (data, self)=>{
    return http.fetchGet('/trade-delivery/matter-detail/list',data, self)
}

export let grantPage = (data, self)=>{
    return http.fetchGet('/trade-delivery/grant-page',data, self)
}

export let filePage = (data, self)=>{
    return http.fetchGet('/trade-delivery/file-page',data, self)
}

export let deliveryAdd = (data, self)=>{
  return http.fetchPostJson('/trade-delivery/deliveryAdd',data, self)
}

export let orderCustom = (data, self)=>{
  return http.fetchPost('/trade-delivery/orderCustom',data, self)
}
