<!--
  规格配置
 -->

<template>
	<div>

		<div style="float: right;">
					<el-button icon="el-icon-plus" size="mini" style="width: 100px;" type="primary"  @click="doSave">保存</el-button>
		</div>
		<el-form :model="form" ref="form" :rules="rules" label-width="100px" class="view-form" style="clear: both;">
					<el-form-item label="上级菜单:" >
						<el-input size="mini" disabled  v-model="form.parentName" ></el-input>
					</el-form-item>
					<el-form-item label="菜单名称:" prop="menuName">
						<el-input size="mini" v-model="form.menuName" ></el-input>
					</el-form-item>
					<el-form-item label="菜单链接:" prop="menuPath">
						<el-input size="mini" v-model="form.menuPath"  ></el-input>
					</el-form-item>
					<el-form-item label="操作控制:">
						<el-radio-group size="mini" v-model="form.isBtnCtr" @change="control">
							<el-radio :label=false>暂不控制</el-radio>
							<el-radio :label=true>操作控制</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="操作按钮:" v-show="form.isBtnCtr==true">
						<el-tag size="small" style="margin-right: 10px;" v-for="item in form.btnArr">{{item.btnName}}</el-tag>
						<el-button size="mini" style="width: 80px;" type="primary" @click="doBtnConfig" >点击维护</el-button>
					</el-form-item>
		</el-form>
</div>
</template>
<script>
	import {
		saveOrUpdateMenu
	} from '../../../api/resourcemgr-appmgr.js'
	export default {
		props: ['form'],
		data(){
			return {
				id:'',
				appId:'',
				rules: {
					menuName: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}],
					menuPath: [{
						required: true,
						message: '请输入菜单路径',
						trigger: 'blur'
					}]
				}
			}
		},
		methods:{
		   empty(){
		  		if(this.$refs['form']!=undefined){
                this.$refs['form'].clearValidate()
				}  
			},
			control(){
            this.$refs['form'].validate((valid) => {
					if(valid) {
						saveOrUpdateMenu({
							Vue: this,
							params: this.form
						}).then(res => {
							if (res.result) {
								this.form.id = res.model;
							}
						});

					}
				});
			},
			//应用菜单维护保存
			doSave(){	
				console.log(this.form,'ok')
				this.$refs['form'].validate((valid) => {
					if(valid) {
						saveOrUpdateMenu({
							Vue: this,
							params: this.form
						}).then(res => {
							if (res.result) {
								this.form.id = res.model;
							   this.$emit('doSave',res.model);
							    this.$message({
								showClose: true,
								message: '保存成功',
								type: 'success'
							});
					        this.$refs['form'].clearValidate()
							}
						});

					}
				});
			},
			doBtnConfig(){
				this.$emit('doBtnConfig')
			}
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;
		h1 {
			font-size: 16px;
			margin: 10px auto;
			text-align: center;
		}
		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
