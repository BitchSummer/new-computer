import http from "./base.js"

//设备中心--设备模型
export let dataDefineIndustryList = (data, self) => {
    return http.fetchPost('/data-define/listByDirCode', data, self)
}

export let devModelList = (data, self) => {
    return http.fetchPost('/dev-model/model/list', data, self)
}


export let deleteDevModel = (data, self) => {
    return http.fetchPost('/dev-model/model/delete', data, self)
}

export let devModelPublicAttrList = (data, self) => {
    return http.fetchPost('/dev-model/attr/public-attr-list', data, self)
}





export let devModelPublicParamList = (data, self) => {
    return http.fetchPost('/dev-model/param/public-param-list', data, self)
}

export let devModelPrivateParamList = (data, self) => {
    return http.fetchPost('/dev-model/param/private-param-list', data, self)
}

export let saveOrUpdatePrivateParam = (data) => {
    return http.fetchPostJson('/dev-model/param/save-or-update', data)
}



export let saveOrUpdateFilter = (data, self) => {
    return http.fetchPostJson('/dev-model/filter/save-or-update', data, self)
}



export let saveOrUpdateResolution = (data, self) => {
    return http.fetchPostJson('/dev-model/resolution/save-or-update', data, self)
}

// syx
export let findIndustry = (data) => {
    return http.fetchPost('/baseData/industry', data)
}
export let findDevClass = (data) => {
    return http.fetchPost('/dev-model/model/findDevClass', data)
}
export let findBrand = (data) => {
    return http.fetchPost('/dev-model/model/findBrand', data)
}
export let findSpec = (data) => {
    return http.fetchPost('/dev-model/model/findSpec', data)
}
export let findProductDate = (data) => {
    return http.fetchPost('/dev-model/model/findProductDate', data)
}
export let findPlcBrand = (data) => {
    return http.fetchPost('/dev-model/model/findPlcBrand', data)
}
export let findPlcSpec = (data) => {
    return http.fetchPost('/dev-model/model/findPlcSpec', data)
}
export let findModel = (data) => {
    return http.fetchPost('/dev-model/model/findModel', data)
}
export let saveOrUpdateDevModel = (data) => {
    return http.fetchPost('/dev-model/model/save-or-update', data)
}
export let devModelAttrList = (data) => {
    return http.fetchPost('/dev-model/attr/attr-list', data)
}
export let saveOrUpdatePrivateAttr = (data) => {
    return http.fetchPostJson('/dev-model/attr/save-or-update', data)
}
export let devModelParamList= (data) => {
    return http.fetchPost('/dev-model/param/param-list', data)
}
export let devModelFilterList = (data) => {
    return http.fetchPost('/dev-model/filter/list', data)
}
export let devModelResolutionList = (data, self) => {
    return http.fetchPost('/dev-model/resolution/list', data)
}