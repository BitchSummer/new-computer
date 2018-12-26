import http from "./base.js"

export let receivablePage = (data, self)=>{
    return http.fetchPost('/trade-payable/page',data, self)
}
