import http from "./base.js"

//市场中心--市场管理
export let marketClassAndProductClassList = (data, self) => {
    return http.fetchPost('/market-base/market-and-class-and-product', data, self)
}

export let modelPublicAttrList = (data, self) => {
    return http.fetchPostJson('/market-base/model-public-attr', data, self)
}

export let modelAttrList = (data, self) => {
    return http.fetchPostJson('/market-base/model-attr', data, self)
}

export let queryProduct = (data, self) => {
    return http.fetchPostJson('/market-base/query-product', data, self)
}

export let queryProductDetail = (data, self) => {
    return http.fetchPostJson('/market-base/query-product-detail', data, self)
}

export let queryUnitGroup = (data, self) => {
    return http.fetchPostJson('/market-base/unit-group', data, self)
}

export let queryPrice = (data, self) => {
    return http.fetchPostJson('/market-base/prodect-unit-price', data, self)
}

