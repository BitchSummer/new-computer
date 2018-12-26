<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @submitUpload="submitUpload">
		<el-upload class="upload-win" 
			ref="upload"
			multiple
			drag
			:action="uploadUrl" 
			:on-success="uploadSuccess"
			:before-upload="beforeUpload"
			:auto-upload="false">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
		</el-upload>
	</toast>
</template>
<script>
  	import {uploadUrl} from '../../../api/common.js'
	export default {
		data() {
			return {
				uploadUrl: uploadUrl,
				config: {
					title: "文件上传", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "400px", //弹窗宽
					btnData: [{
						isShow: true,
						name: "关闭窗口",
						bgColor: "dialog-normal",
						method: "cancel"
					}, {
						isShow: true,
						disabled: false,
						bgColor: 'dialog-deep-blue',
						name: '上传服务器', //按钮名
						method: 'submitUpload', //回调函数
					}]
				},
				uploadFileCount:0
			}
		},
		methods: {
			show() {
				this.uploadFileCount=0;
				this.config.btnData[1].disabled = false
				this.config.dialogVisible = true;
			},
			submitUpload() {
				if(this.$refs.upload.uploadFiles.length==0){
					this.$message.warning('请选择上传文件...');
					return false;
				}else{
					this.config.btnData[1].disabled = true
					this.$refs.upload.submit();
				}
			},
			uploadSuccess(res){
				console.log(res,'res')
				this.uploadFileCount--;
				if(this.uploadFileCount==0){
					this.config.btnData[1].disabled = false
				}
				this.$refs.upload.uploadFiles.forEach((item,index)=>{
				this.item=item
						this.$refs.upload.uploadFiles.splice(index,1)
				})
				this.$emit('uploadSuccess',this.item);
				
			},
			beforeUpload(file){
				console.log(file,'file')
				this.uploadFileCount++;
			}
		}
	}
</script>
<style lang="less">
	.upload-win {
		margin: 5px 20px;
	}
</style>
