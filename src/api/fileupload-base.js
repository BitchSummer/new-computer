import http from "./base.js"

//设备中心--设备模型
export let imageUploadCheck = (file) => {
	let isJPG = /^image\/(png|jpeg|jpg|gif)$/.test(file.type);
	const isLt2M = file.size / 1024 / 1024 < 2;

	if (!isJPG) {
		this.$message.error('上传图片只能是 png|jpeg|jpg|gif 格式!');
	}
	if (!isLt2M) {
		this.$message.error('上传头像图片大小不能超过 2MB!');
	}
	return isJPG && isLt2M;
}
