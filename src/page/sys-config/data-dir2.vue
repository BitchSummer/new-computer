<template>
	<div class="qwCommonPage">
		<div class="lbox" :style="{minHeight:sidebarHeight-270+'px'}">
			<!-- 树组件 -->
			<data-dir-tree ref="tree" :config="treeConfig" :level="level" style="margin: 5px 10px;" @doView="doView"  @addNode="addNode" @editNode="editNode" @delNode="delNode"/>
		</div>
		<div class="rbox" :style="{minHeight:sidebarHeight-270+'px'}">
			<data-dir-form :form="formConfig" :level="level" class="rbox-body" v-if="view" :mod="mod" />   
			<!-- 编辑 -->
			<data-dir-form1 :form="formConfig2" :level="level" class="rbox-body" v-if="edit" :mod="mod" @editSuccess1="editSuccess1" @editSuccess2="editSuccess2"/>   
			<!-- 新增 -->
			<data-dir-form2 :form="formConfig3" :level="level" class="rbox-body" @gross='gross' v-if="add" :type="type" :mod="mod"/>   
  		</div>
	</div>
</template>
<script>
	import {
		mapState
	} from "vuex"
	import {
		saveOrUpdateBusinessClass,
		saveOrUpdateDir,
		saveOrUpdateDefine
	} from '../../api/sysconfig-datadir.js'
	import DataDirForm from '../../components/sys-config/data-dir/form.vue'
	import DataDirForm1 from '../../components/sys-config/data-dir/form1.vue'
	import DataDirForm2 from '../../components/sys-config/data-dir/form2.vue'
	import DataDirTree from '../../components/sys-config/data-dir/tree.vue'
	export default {
		components: {
			DataDirForm,
			DataDirTree,
			DataDirForm1,
			DataDirForm2,
		},
		computed: {
			...mapState({
				sidebarHeight: state => state.app.sidebarHeight
			})
		},
		data() {
			return {
				selectNode:{
					data:{
						id:-1
					}
				},
				mod:'',
				evtNode:null,
				form:{},
				type:'',
				add:false,
				view:true,
				edit:false,
				disabled:true,
				queryParam: {
					isAble: ''
				},
				treeConfig: {
					businessClassArr: []
				},  
				level:'',
				formConfig: {
					
				},
				formConfig2: {
					
				},
				formConfig3: {
					
				},
			}
		},
		methods: {	
			editSuccess1(form){
				console.log(this.evtNode)
				this.evtNode.data.alias=form.alias
				this.evtNode.data.label=form.alias
				this.$refs.tree.setCurrentKey(form.id)
			},
			editSuccess2(form){
				console.log(this.evtNode)
				this.evtNode.data.value=form.value
				this.evtNode.data.dirIsOtherView=form.dirIsOtherView
				this.evtNode.data.dirIsEdit=form.dirIsEdit
				this.evtNode.data.defineIsEdit=form.defineIsEdit
				this.evtNode.data.isAble=form.isAble
				this.evtNode.data.ableTime=form.ableTime
				this.evtNode.data.label=form.value
				
				this.$refs.tree.setCurrentKey(form.id)
			},
			gross(form){
				let tree=this.$refs.tree
				// if(!this.evtNode.data.children){
				// 	this.evtNode.data.children=[]
				// }
				console.log(form,"this.evtNode")			
				
				if(this.evtNode.loaded){
					this.evtNode.insertChild({data:{label:form.alias,...form}})
					tree.setCurrentKey(form.id)
				}else{
					if(this.evtNode.isLeaf){
						this.evtNode.isLeaf=false
					}
					tree.expand(this.evtNode.data.id,function(){
						tree.setCurrentKey(form.id)
					})
				}
				
			},
			//添加按钮
			addNode(node){
				let form = node.data;
				delete form.children; 
				this.formConfig3 = { 
					...form
				}
				this.type=node.data.id
				this.level=node.level 
				this.mod="add"
				this.evtNode=node
				if(this.level==1){
					this.add=true
					this.view=false
					this.edit=false
					this.formConfig3.alias=''
					this.formConfig3.code=''
				}else if(this.level==2){
					this.add=true
					this.view=false
					this.edit=false
					this.formConfig3.code=''
					this.formConfig3.value=''
					this.formConfig3.isAble=""   	
					this.formConfig3.businessClass=''
					this.formConfig3.dirName=''
					this.formConfig3.dirIsOtherView=''
					this.formConfig3.dirIsEdit=''
					this.formConfig3.defineIsEdit=''
					this.formConfig3.ableTime=''  
				}else if(this.level==3||this.level>3){
					this.add=true
					this.view=false
					this.edit=false
				}
			},
			editNode(node){
				this.mod="edit"
				this.view=false
				this.edit=true
				this.add=false
				this.level=node.level 
				this.evtNode=node
				if (node.data.nodeType == 'data-dir' || node.data.nodeType == 'data-define'||node.data.nodeType == 'business-class') {
					let form = node.data;
				  	delete form.children; 
					this.formConfig2 = { 
						...form
					}
				} else{
					this.formConfig2= {}
				}
			},
			delNode(node){
				if(this.selectNode.data.id==node.data.id){
					this.add=false;
					this.edit=false;
					this.view=true;
					this.level=1;
					this.selectNode=null
					this.formConfig={}
				}
			},
			//点击一栏右侧显示
			doView(node) {
				this.edit=false
				this.view=true
				this.add=false
				this.level=node.level 
				this.selectNode=node
				if (node.data.nodeType == 'data-dir' || node.data.nodeType == 'data-define'||node.data.nodeType == 'business-class') {
					let form = node.data;
					console.log(node.data,'data')
				 	delete form.children; 
					this.formConfig = { 
						...form
					}
				} else{
					this.formConfig = {}
				}
			},
		},

	}
</script>
<style lang="less">
	.qwCommonPage {

		.lbox {
			width: 366px;
			float: left;
			background: #FFF;
			box-shadow: 1px 1px 15px #e6e6e6;
			overflow: auto;
		}

		.rbox {
			width: 100%;
			box-sizing: border-box;
			padding-left: 370px !important;

		}
	}

	.data-dir-form {
		background: #FFF;
		box-shadow: 1px 1px 15px #e6e6e6;
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
