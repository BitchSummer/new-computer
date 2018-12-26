<template>
	<el-row :gutter="10" class="model-info">
		<el-col :span="11">
			<el-card>
				<h1>模型概述</h1>
				<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="130px">
					<el-form-item label="行业领域:" prop="industry">
						<!-- <el-select :disabled="!editModel" v-model="form.industry" placeholder="请选择" size="mini" multiple >
							<el-option :label="item.code" :value="item.code" v-for="item in industryArr" :key="item.code"></el-option>
						</el-select> -->
						<el-select :disabled="!editModel" v-model="form.industry" placeholder="" size="mini" style="width:100%" multiple >
						  <el-option v-for="item in industryArr" :label="item.value" :value="item.value" :key="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备大类:" prop="devClass">
						<el-input :disabled="!editModel" v-model="form.devClass" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="品牌及制造商:" prop="brand">
						<el-input :disabled="!editModel" v-model="form.brand" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="设备型号:" prop="spec">
						<el-input :disabled="!editModel" v-model="form.spec" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="出厂年月:" prop="productDate">
						<el-input :disabled="!editModel" v-model="form.productDate" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="处理器品牌:" prop="plcBrand">
						<el-input :disabled="!editModel" v-model="form.plcBrand" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="处理器型号:" prop="plcSpec">
						<el-input :disabled="!editModel" v-model="form.plcSpec" size="mini"></el-input>
					</el-form-item>
					<el-form-item label="通讯协议:" prop="parseRule">
							<el-input :disabled="!editModel" v-model="form.parseRule" size="mini"></el-input>
					</el-form-item>
				</el-form>
			</el-card>

		</el-col>
		<el-col :span="13">
			<el-card>
				<h1>设备照片</h1>
			  	<el-upload
					class="avatar-uploader"
					action="http://61.153.187.80:8081/fileSystem/uploadFile"
					:show-file-list="false"
					:disabled="!editModel"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload">
					<img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				
			</el-card>
		</el-col>
	</el-row>
</template>
<script>
	import {saveOrUpdateDevModel} from '../../../api/resourcemgr-devmodel.js'
	export default {
		props: ['form','editModel','industryArr'],
		data(){
			return {
				rules: {
					industry: [{
						required: true,
						message: '请选择行业领域...',
						trigger: 'change'
					}],
					devClass: [{
						required: true,
						message: '请选择设备大类...',
						trigger: 'change'
					}],
					brand: [{
						required: true,
						message: '请输入设备品牌及制造商...',
						trigger: 'change'
					}],
					spec: [{
						required: true,
						message: '请输入规格型号...',
						trigger: 'change'
					}],
					productDate: [{
						required: true,
						message: '请输入出厂年月 如2018.09...',
						trigger: 'change'
					}],
					plcBrand: [{
						required: true,
						message: '请输入处理器品牌...',
						trigger: 'change'
					}],
					plcSpec: [{
						required: true,
						message: '请输入处理器规格...',
						trigger: 'change'
					}],
					parseRule: [{
						required: true,
						message: '请输入通讯协议...',
						trigger: 'change'
					}]
				}
			}
		},
		methods:{
			handleAvatarSuccess(res, file) {
				console.log(res,'.....')
				this.form.imgUrl = res.model
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				return isJPG
			},
			doSave(){
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let tempForm = {...this.form}
						delete tempForm.createTime
						delete tempForm.modifyTime
						tempForm.industry = tempForm.industry .join(',')
						saveOrUpdateDevModel({
							Vue: this,
							params: tempForm
						}).then(res => {
							if (res.result) {
								this.$message.success('保存成功')
								this.$emit("setEditModel");
							}
						})
					}
				});
			}
		}
	}
</script>
<style lang="less">
	.model-info{
		h1{
			line-height: 40px;
		}
		.el-form-item--small.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>
<style lang="less">
.model-info{
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 200px;
		height: 200px;
		line-height: 200px;
		text-align: center;
	}
	.avatar {
		width: 200px;
		height: 200px;
		display: block;
	}
}
</style>