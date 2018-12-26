import http from "./base.js"

//设备中心--设备模型
export let apiPage = (data, self) => {
    return http.fetchPost('/resource-api/page', data, self)
}

export let saveOrUpdateApi = (data, self) => {
    return http.fetchPost('/resource-api/save-or-update', data, self)
}


export let deleteApi = (data, self) => {
    return http.fetchPost('/resource-api/delete', data, self)
}

export let baseDataApi = (data ,self) => {
    return http.fetchPost('/baseData/api', data, self)
}

export let appListApi = (data ,self) => {
    return http.fetchPost('/baseData/appList', data, self)
}
