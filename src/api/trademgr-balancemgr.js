import http from "./base.js"

export let balancePage = (data, self)=>{
    return http.fetchPost('/trade-balance/page',data, self)
}

export let signInOrRefuseBalance = (data, self)=>{
    return http.fetchPost('/trade-balance/sign-in-or-refuse',data, self)
}

export let balanceDetailList = (data, self)=>{
    return http.fetchPost('/trade-balance/detail/list',data, self)
}