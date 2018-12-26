import http from "./base.js"

//市场中心--市场管理
export let productPricePage = (data, self) => {
    return http.fetchPost('/product-price/page', data, self)
}

export let productPriceHistoryPage= (data, self) => {
    return http.fetchPost('/product-price/history/page', data, self)
}

export let unitConvert= (data, self) => {
    return http.fetchPost('/product-price/unit-convert', data, self)
}

export let priceRecordPage= (data, self) => {
    return http.fetchPost('/product-price/price-record/page', data, self)
}

export let priceRecordDetailList = (data, self) => {
    return http.fetchPost('/product-price/price-record/detail-list', data, self)
}

export let saveOrUpdatePriceRecord = (data, self) => {
    return http.fetchPostJson('/product-price/price-record/save-or-update', data, self)
}

export let deletePriceRecord= (data, self) => {
    return http.fetchPost('/product-price/price-record/delete', data, self)
}

export let ablePriceRecord = (data, self) => {
    return http.fetchPost('/product-price/price-record/able', data, self)
}


