/* 查看详情页面 */
<template>
	<div class="data-dir-form" v-if="selectNode.data.id>=0">
		<h1 v-show="selectNode.level==1">业务大类</h1>
		<h1 v-show="selectNode.level==2">数据字典</h1>
		<h1 v-show="selectNode.level>2">数据定义</h1>
        <el-form ref="form" v-if="selectNode.level==1" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="业务编码:" >
			    <el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="业务名称:" >
			    <el-input v-model="form.alias"></el-input>
			</el-form-item>
            <div class="form-btn" >
				<el-button size="small" type="primary" @click="classSave" >保  存</el-button>
			</div>
        </el-form>
        <el-form ref="form" v-if="selectNode.level==2" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="业务分类:" >
				{{selectNode.data.alias}}
			</el-form-item>
			<el-form-item label="字典编码" prop="code">
				<el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="字典名称" prop="value">
				<el-input v-model="form.value"></el-input>
			</el-form-item>
			<el-form-item label="可见控制:"  >
				<el-radio-group v-model="form.dirIsOtherView">
					<el-radio :label="false">仅本人可见</el-radio>
					<el-radio :label="true">他人可见</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="字典控制:" >
				<el-radio-group v-model="form.dirIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="定义控制:" >
				<el-radio-group v-model="form.defineIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="启停标识:" >
				<el-switch style="display: block;margin-top:3px;" :active-value="true" v-model="form.isAble" active-color="#13ce66"  active-text="启用" inactive-text="停用"> </el-switch>
			</el-form-item>
            <div class="form-btn" >
				<el-button size="small" type="primary" @click="dirSave">保  存</el-button>
			</div>
        </el-form>
        <el-form ref="form" v-if="selectNode.level>2" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="归属字典:">
				{{selectNode.data.nodeType=='dir'?selectNode.data.value:selectNode.data.dirName}}
			</el-form-item>
			<el-form-item label="定义编码" prop="code">
				<el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="定义名称" prop="value">
				<el-input v-model="form.value"></el-input>
			</el-form-item>
            <div class="form-btn" >
				<el-button size="small" type="primary" @click="defineSave" >保  存</el-button>
			</div>
        </el-form>
	</div>
</template>
<script>
	import {
		saveOrUpdateBusinessClass,
		saveOrUpdateDir,
		saveOrUpdateDefine
	}
	 from '../../api/sysconfig-datadir.js'
	export default {
		props: ['selectNode','form'],
		data(){
			return {
            }
        },
		methods: {
            classSave(){
                saveOrUpdateBusinessClass({
					Vue:this,
					params:{
						alias:this.form.alias,
						code:this.form.code,
					}	
				}).then(res => {
					if (res.result) {
                        res.model.nodeType='BusinessClass'
                        res.model.leaf=true
                        res.model.label=res.model.alias
                        this.$message.success('新增大类成功')
                        this.$emit('saveSuccess',res.model)
					}
				})
            },
            dirSave(){
                saveOrUpdateDir({
					Vue:this,
					params:{
						type:this.selectNode.data.id,
						...this.form
					}	
				}).then(res => {
					if (res.result) {
						res.model.nodeType='dir'
                        res.model.leaf=true
                        res.model.label=res.model.value
                        this.$message.success('新增字典成功')
                        this.$emit('saveSuccess',res.model)
					}
				})
            },
            defineSave(){
                saveOrUpdateDefine({
					Vue:this,
					params:{
						...this.form
					}	
				}).then(res => {
					if (res.result) {
                        res.model.nodeType='Define'
                        res.model.dirName=this.selectNode.data.nodeType=='dir'?this.selectNode.data.value:this.selectNode.data.dirName
                        res.model.leaf=true
                        res.model.label=res.model.value
                        this.$message.success('新增定义成功')
                        this.$emit('saveSuccess',res.model)
					}
				})  
            }
		}
	}
</script>
<style lang="less">
	.data-dir-form {
		h1 {
			text-align: center;
			line-height: 100px;
			font-size: 18px;
		}
		.rbox-form {
			display: table;
			margin: 0px auto;
			width: 500px;
			padding: 0px auto;
			.form-btn{
				text-align: center;
				button{
					width: 110px;
				}
			}
		}
	}
</style>
