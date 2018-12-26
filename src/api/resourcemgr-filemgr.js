import http from "./base.js"

//设备中心--设备模型


export let folderList = (data, self) => {
    return http.fetchPost('/resource-file/folder/list', data, self)
}


export let saveFolder = (data, self) => {
    return http.fetchPost('/resource-file/folder/save', data, self)
}

export let deleteFolder = (data, self) => {
    return http.fetchPost('/resource-file/folder/delete', data, self)
}
export let filePage = (data, self) => {
    return http.fetchPost('/resource-file/file/page', data, self)
}

export let saveFile = (data, self) => {
    return http.fetchPostJson('/resource-file/file/save', data, self)
}

export let deleteFile = (data, self) => {
    return http.fetchPost('/resource-file/file/delete', data, self)
}

export let moveFile = (data, self) => {
    return http.fetchPostJson('/resource-file/file/move', data)
}
