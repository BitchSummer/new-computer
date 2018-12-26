import http from "./base.js"


//市场中心--市场管理
export let marketClassAndProductClassList = (data, self) => {
    return http.fetchPost('/unit-group/market-and-class-and-product', data, self)
}

export let modelPublicAttrList = (data, self) => {
    return http.fetchPost('/market-base/model-public-attr', data, self)
}

export let modelAttrList = (data, self) => {
    return http.fetchPost('/market-base/model-attr', data, self)
}

export let queryProduct = (data, self) => {
    return http.fetchPost('/market-base/query-product', data, self)
}

export let queryProductDetail = (data, self) => {
    return http.fetchPost('/market-base/query-product-detail', data, self)
}
//单位组下拉
export let ListUnitGroup = (data, self) => {
  return http.fetchPost('/unit-group/listUnitGroup', data, self)
}



// //市场名称列表
// export let MarketList = (data, self) => {
//   return http.fetchPost('/market-base/MarketList', data, self)
// }
// //市场分类列表
// export let ClassList = (data, self) => {
//   return http.fetchPost('/market-base/ClassList', data, self)
// }
// //分类下产品列表
// export let ProductList = (data, self) => {
//   return http.fetchPost('/market-base/ProductList', data, self)
// }
// // 当前模型详情
// export let findProduct = (data, self) => {
//     return http.fetchPost('/market-base/findProduct', data, self)
// }

// 单位组
export let listUnitGroup = (data, self) => {
    return http.fetchPost('/unit-group/listUnitGroup', data, self)
}
//新增
export let saveOrUpdate = (data,self) => {
  return http.fetchPostJson('/unit-group/save-or-update', data , self)
}
