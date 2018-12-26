import http from "./base.js"

//市场中心--市场管理
export let productPage = (data, self) => {
    return http.fetchPost('/product-info/page', data, self)
}

export let saveOrUpdateProduct= (data, self) => {
    return http.fetchPostJson('/product-info/save-or-update', data, self)
}

export let deleteProduct = (data, self) => {
    return http.fetchPost('/product-info/delete', data, self)
}

export let ableOrDisableProduct = (data, self) => {
    return http.fetchPost('/product-info/able-or-disable', data, self)
}

export let productDetailList = (data, self) => {
    return http.fetchPostJson('/product-info/product-detal/list', data, self)
}

export let ableOrDisableProductDetail = (data, self) => {
    return http.fetchPost('/product-info/product-detal/able-or-disable', data, self)
}

export let deleteProductDetail = (data, self) => {
    return http.fetchPost('/product-info/product-detal/delete', data, self)
}

export let checkProductDetail = (data, self) => {
    return http.fetchPostJson('/product-info/product-detal/check', data, self)
}

export let buildProductDetails = (data, self) => {
    return http.fetchPostJson('/product-info/product-detal/build-product-details', data, self)
}

////


export let productResourceList = (data, self) => {
    return http.fetchPost('/product-info/resource/list', data, self)
}
export let bindImgsProductDetails = (data, self) => {
    return http.fetchPost('/product-info/product-detail/bind-img', data, self)

}


// 失焦
export let updateDetials1 = (data, self) => {
    return http.fetchPostJson('/product-info/updateDetials', data, self)

}