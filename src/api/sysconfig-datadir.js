import http from "./base.js"

//设备中心--设备模型
//获取业务大类列表
export let businessClassList = (data, self) => {
    return http.fetchPostJson('/sysDir/ListClass', data, self)
}
//新增编辑业务大类
export let saveOrUpdateBusinessClass = (data, self) => {
    return http.fetchPost('/sysDir/saveOrUpdateClass', data, self)
}
//根据业务大类获取数据字典
export let dataDirList = (data, self) => {
    return http.fetchPost('/sysDir/listDir', data, self)
}
//根据数据字典获取数据定义树
export let dataDefineList = (data) => {
    console.log(data)
    return http.fetchPost('/sysDir/ListDefine', data)
}
//删除业务大类
export let removeRecoder = (data, self) => {
    return http.fetchPost('/sysDir/removeRecoder', data, self)
}
//新增编辑数据字典
export let saveOrUpdateDir= (data, self) => {
    return http.fetchPost('/sysDir/saveOrUpdateDir', data, self)
}
//新增编辑数据定义
export let saveOrUpdateDefine= (data, self) => {
    return http.fetchPost('/sysDir/saveOrUpdateDefine', data, self)
}
//删除数据字典
export let removeDir= (data, self) => {
    return http.fetchPost('/sysDir/removeDir', data, self)
}
//删除数据字典
export let removeDefine= (data, self) => {
    return http.fetchPost('/sysDir/removeDefine', data, self)
}
//启停接口
export let enableDir= (data, self) => {
    return http.fetchPost('/sysDir/enableDir', data, self)
}
export let listDefineCode = (data, self) => {
    return http.fetchPost('/sysDir/ListDefineCode', data, self)
}