import http from "./base.js"

//市场中心--市场管理
export let unitGroupList = (data, self) => {
    return http.fetchPost('/unit-group/list', data, self)
}

export let saveOrUpdateUnitGroup = (data, self) => {
    return http.fetchPostJson('/unit-group/save-or-update', data, self)
}

export let deleteUnitGroup = (data, self) => {
    return http.fetchPost('/unit-group/delete', data, self)
}

export let ableOrDisableUnitGroup = (data, self) => {
    return http.fetchPost('/unit-group/able-or-disable', data, self)
}


