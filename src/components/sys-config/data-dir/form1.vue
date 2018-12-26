/* 编辑页面 */
<template>
	<div class="data-dir-form">
		{{form}}
	      <h1 v-show="form.nodeType=='business-class'">业务大类</h1>
		<h1 v-show="form.nodeType=='data-dir'">数据字典</h1>
		<h1 v-show="form.nodeType=='data-define'">数据定义</h1>
		<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="100px">
			<el-form-item label="业务分类:" v-show="form.nodeType=='data-dir'">
					<el-input  v-model="form.businessClass" disabled></el-input>
			</el-form-item>
			<el-form-item label="归属字典:" v-show="form.nodeType=='data-define'">
				<el-input disabled v-model="form.dirName"></el-input>
			</el-form-item>
			<el-form-item v-show="form.nodeType!=='business-class'" :label="form.nodeType=='data-dir'?'字典编码:':'定义编码'" prop="code">
				<el-input v-model="form.code" disabled></el-input>
			</el-form-item>
			<el-form-item label="业务编码:" v-show="form.nodeType=='business-class'" prop="code"  >
			<el-input v-model="form.code" disabled></el-input>
			</el-form-item>
			<el-form-item label="业务名称:" v-show="form.nodeType=='business-class'" prop="alias" >
			<el-input v-model="form.alias"></el-input>
			</el-form-item>
			<el-form-item v-show="form.nodeType!=='business-class'" :label="form.nodeType=='data-dir'?'字典名称:':'定义名称'" prop="value">
				<el-input v-model="form.value"></el-input>
			</el-form-item>
			<el-form-item label="可见控制:" v-show="form.nodeType=='data-dir'"  prop='dirIsOtherView'>
				<el-radio-group v-model="form.dirIsOtherView">
					<el-radio :label="false">仅本人可见</el-radio>
					<el-radio :label="true">他人可见</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="字典控制:" v-show="form.nodeType=='data-dir'" prop='dirIsEdit'>
				<el-radio-group v-model="form.dirIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="定义控制:" v-show="form.nodeType=='data-dir'" prop="defineIsEdit">
				<el-radio-group v-model="form.defineIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="启停标识:" v-show="form.nodeType=='data-dir'">
				<el-tag type="success" v-show="form.isAble==true">已启用</el-tag>
				<el-tag type="danger" v-show="form.isAble==false">已停用</el-tag>
			</el-form-item>
			<el-form-item label="启停时间:" v-show="form.nodeType=='data-dir'">
				<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
				    placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
	  	<div class="form-btn" >
				<el-button size="small" type="primary" @click="save1" v-if="level==2">保  存1</el-button>
				<el-button size="small" type="primary" @click="save2" v-if="level==3">保  存2</el-button>
				<el-button size="small" type="primary" @click="save3" v-if="level==4||level>4">保  存3</el-button>
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
	 from '../../../api/sysconfig-datadir.js'
	export default {
		props: ['form',"level"],
		data(){
			return {
				rules:{
				/* 	code: [{
						required: true,
						message: '请输入编码...',
						trigger: 'change'
					}], */
				/* 	value: [{
						required: true,
						message: '请输入名称...',
						trigger: 'change'
					}] */
				}
			  }
			},
				methods: {
	  		save1(node) {
				saveOrUpdateBusinessClass({
					Vue:this,
					params:{
						Alias:this.form.alias,
						code:this.form.code,
						id:this.form.id
					   }	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
							dataDefineArr.label = dataDefineArr.value;
							dataDefineArr.children = [];
							dataDefineArr.nodeType = 'data-define';
/* 						   if(node.data.children&&node.data.children.length>=0)
								node.data.children.push(dataDefineArr);
						   else
								node.data.children=[dataDefineArr]
						node.loading = false;
						node.expanded = true;
						node.loaded = true; */
					}
				})
				this.form.alias='',
				this.form.code=''
			},
			save2(node){
				console.log(this.form.type,'this.form.type')
				saveOrUpdateDir({
					Vue:this,
					params:{
						id:this.form.id,
						type:this.form.type,
						code:this.form.code,
						value:this.form.value,
					    dirIsOtherView:this.form.dirIsOtherView,
						dirIsEdit:this.form.dirIsEdit,
						defineIsEdit:this.form.defineIsEdit
					   }	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
							dataDefineArr.label = dataDefineArr.value;
							dataDefineArr.children = [];
							dataDefineArr.nodeType = 'data-define';
						/* 	node.data.children.push(dataDefineArr);
						node.loading = false;
						node.expanded = true;
						node.loaded = true; */
					}
				})
			},
			//新增编辑数据定义
			save3(node){
		/* 		console.log(eventBus)
				eventBus.$on("myFun",message=>{   
					console.log(message,"v")
				}) */
              saveOrUpdateDefine({
					Vue:this,
					params:{
						code:this.form.value,
						value:this.form.code,
						parentId:this.form.id,
						dirId:7,
						dirCode:85
					   }	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
							dataDefineArr.label = dataDefineArr.value;
							dataDefineArr.children = [];
							dataDefineArr.nodeType = 'data-define';
					/* 		node.data.children.push(dataDefineArr);
						node.loading = false;
						node.expanded = true;
						node.loaded = true; */
					}
				})  
			}, 

			}
	}
</script>
<style lang="less">
	.data-dir-form {
		background: #FFF;
		box-shadow: 1px 1px 15px #e6e6e6;
		margin-top: 10px;
		h1 {
			text-align: center;
			line-height: 100px;
			font-size: 18px;
		}
		.rbox-form {
			display: table;
			margin: 0px auto;
			width: 500px;
			height: 600px;
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
