import http from "./base.js"

//市场中心--市场管理
export let publishRecordList = (data, self) => {
    return http.fetchPost('/product-publish/list', data, self)
}

export let publishRecordDetailList = (data, self) => {
    return http.fetchPost('/product-publish/detail/list', data, self)
}

export let offShelfDetail = (data, self) => {
    return http.fetchPostJson('/product-publish/detail/off-shelf', data, self)
}

export let addPublishRecord = (data, self) => {
    return http.fetchPostJson('/product-publish/add', data, self)
}

export let deletePublishRecord = (data, self) => {
    return http.fetchPostJson('/product-publish/delete', data, self)
}

export let submitPublishRecord = (data, self) => {
    return http.fetchPost('/product-publish/submit', data, self)
}

export let revokePublishRecord = (data, self) => {
    return http.fetchPost('/product-publish/revoke', data, self)
}


