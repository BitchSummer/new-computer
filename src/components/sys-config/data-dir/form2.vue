/* 新增页面 */
<template>
	<div class="data-dir-form">
		{{form}}
 		<el-form v-if="level==1" :model='form1' class="rbox-form" size="small" label-width="100px">
			 <h1>业务大类</h1>
			<el-form-item label="业务编码:" prop="code">
			<el-input v-model="form1.code" ></el-input>
			</el-form-item>
			<el-form-item label="业务名称:" prop="alias">
			<el-input v-model="form1.alias"></el-input>
			</el-form-item>
			<div class="form-btn" >
				<el-button size="small" type="primary" @click="save1" v-if="level==1">保  存1</el-button>
			</div>
		</el-form>  
		<el-form v-if="level==2" :model='form2' class="rbox-form" size="small" label-width="100px">
			<h1>数据字典</h1>
				<el-form-item label="业务分类:" prop="businessClass">
				{{form.label}}
			</el-form-item>
				<el-form-item label="字典编码" prop="code">
				<el-input v-model="form2.code" ></el-input>
			</el-form-item>
				<el-form-item label="字典名称" prop="value">
				<el-input v-model="form2.value"></el-input>
			</el-form-item>
					<el-form-item label="可见控制:" prop='dirIsOtherView'>
				<el-radio-group v-model="form2.dirIsOtherView">
					<el-radio :label="false">仅本人可见</el-radio>
					<el-radio :label="true">他人可见</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="字典控制:" prop='dirIsEdit'>
				<el-radio-group v-model="form2.dirIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="定义控制:" prop="defineIsEdit">
				<el-radio-group v-model="form2.defineIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="启停标识:" v-if="level==2" prop="isAble">
			<el-switch style="display: block;margin-top:3px;" active-value=true v-model="form2.isAble" active-color="#13ce66"  active-text="启用" inactive-text="停用" @change="commitment"> </el-switch>
			</el-form-item>
				<div class="form-btn" > 
				<el-button size="small" type="primary" @click="save2">保  存2</el-button>	 
			</div>  
		</el-form>
		<el-form v-if="level==3||level>3" :model='form3' class="rbox-form" size="small" label-width="100px" ref="form3">
			<h1>数据定义</h1>
			<el-form-item label="定义编码" prop="code">
				<el-input v-model="form3.code" ></el-input>
			</el-form-item>
			<el-form-item label="定义名称" prop="values">
				<el-input v-model="form3.value" ></el-input>
			</el-form-item>
			<el-form-item label="归属字典:" prop="dirName">
					{{form.label}}
			</el-form-item>
			<div class="form-btn" >
				<el-button size="small" type="primary" @click="save3" v-if="level==3||level>3">保  存3</el-button>
			</div>
		</el-form> 
	</div>
</template>
<script>
	import {
		saveOrUpdateBusinessClass,
		saveOrUpdateDir,
		saveOrUpdateDefine,
		enableDir
	}
	 from '../../../api/sysconfig-datadir.js'
	export default {
		props: ["type","level","mod","form"],
		data(){
			return {
				code1:'',
				value1:'',
                form1:{
					code:'',
					alias:'',
					
				},
				form2:{
                    businessClass:'',
					dirName:'',
					value:'',
					dirIsOtherView:'',
					dirIsEdit:'',
					defineIsEdit:'',
					ableTime:'',
					isAble:true
				},
				form3:{
                    code:'',
					alias:'',
					dirName:''
				},
				rules:{
			/* 	code: [{
					required: true,
					message: '请输入编码...',
					trigger: 'change'
					}],  
				  	alias: [{
						required: true,
						message: '请输入名称...',
						trigger: 'change'
					}]   */
				}
			  }
			},
		methods: {
		commitment(){
            enableDir({
					Vue:this,
					params:{
						id:this.form.id
					   }	
				}).then(res => {})
			},
	    save1() {
		    saveOrUpdateBusinessClass({
					Vue:this,
					params:{
						Alias:this.form1.alias,
						code:this.form1.code,
					   }	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
							dataDefineArr.label = dataDefineArr.value;
							dataDefineArr.children = [];
							dataDefineArr.nodeType = 'data-define';
                       /*    if(!node.data.children){
							  node.data.children=[]
						  }
						   if(node.data.children&&node.data.children.length>=0)
								node.data.children.push(dataDefineArr);
						   else
								node.data.children=[dataDefineArr]
						node.loading = false;
						node.expanded = true;
						node.loaded = true; */
							this.$emit('gross',JSON.parse(JSON.stringify(dataDefineArr)))
					       this.form1.alias='',
				            this.form1.code='' 
					}
				})
			
			
			},
			save2(type){
				saveOrUpdateDir({
					Vue:this,
					params:{
						type:this.type,
						code:this.form2.code,
						value:this.form2.value,
						dirIsOtherView:this.form2.dirIsOtherView,
						dirIsEdit:this.form2.dirIsEdit,
						defineIsEdit:this.form2.defineIsEdit
					   }	
				}).then(res => {
					if (res.result) {
						let dataDir = res.model;
						this.code1=dataDir.code,
						this.value1=dataDir.value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
							dataDir.label = dataDir.value;
							dataDir.children = [];
                            dataDir.nodeType = 'data-dir';
							this.$emit('gross',JSON.parse(JSON.stringify(dataDir)))
							this.form2.code=''
							this.form2.value=''
							this.form2.dirIsOtherView=''
							this.form2.dirIsEdit=''
							this.form2.defineIsEdit=''
							}
							})
			          	},
			//新增编辑数据定义
			save3(type,code1,value1){
 
              saveOrUpdateDefine({
					Vue:this,
					params:{
						code:this.form3.value,
						value:this.form3.code,
						parentId:this.form.parentId,
						dirId:this.form.type,
						dirCode:this.form.dirCode
					   }	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
							dataDefineArr.label = dataDefineArr.value;
							dataDefineArr.children = [];
							dataDefineArr.nodeType = 'data-define';
							this.$emit('gross',JSON.parse(JSON.stringify(dataDefineArr)))
							this.$refs.form3.clearValidate();
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
