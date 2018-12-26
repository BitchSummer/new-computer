import http from "./base.js"

//分页查询
export let appPage = (data, self) => {
    return http.fetchPost('/resource-app/page', data, self)
}
//行业领域(下拉)
export let appSurveyList = (data, self) => {
    return http.fetchPost('/baseData/industry', data, self)
}
//应用分类（下拉）
export let appClass = (data, self) => {
    return http.fetchPost('/baseData/app', data, self)
}
//编辑接口
export let selectByEdit = (data, self) => {
    return http.fetchPost('/resource-app/selectByEdit', data, self)
}
//显示树
export let appMenuList = (data, self) => {
    return http.fetchPost('/resource-app/app-menu-list', data, self)
}
export let appCompanyPage = (data, self) => {
    return http.fetchPost('/resource-app/app-company-page', data, self)
}
export let appMenuBtnList = (data, self) => {
    return http.fetchPost('/resource-app/app-btn-list', data, self)
}
//app应用维护新增
export let saveOrUpdateApp = (data, self) => {
    return http.fetchPost('/resource-app/app/save-or-update', data, self)
}

export let deleteApp = (data, self) => {
    return http.fetchPost('/resource-app/app/delete', data, self)
}

export let saveOrUpdateMenu = (data, self) => {
    return http.fetchPost('/resource-app/menu/save-or-update', data, self)
}

export let deleteMenu = (data, self) => {
    return http.fetchPost('/resource-app/menu/delete', data, self)
}
//应用按钮保存更新
export let saveOrUpdateBtn = (data, self) => {
    return http.fetchPostJson('/resource-app/btn/save-or-update', data, self)
}
export let appBtnList = (data, self) => {
    return http.fetchPost('/resource-app/app-btn-list', data, self)
}