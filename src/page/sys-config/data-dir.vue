<template>
    <div class="qwCommonPage">
        <div class="lbox" >
			<data-dir-tree ref="dirTree" :readOnly="false" :rootData="rootData" @loadNode="loadNode" :buttons="buttons" @nodeChange="nodeChange" @add="handleAdd" @del="handlerDel" @edit="handleEdit" @toUse="toUse"></data-dir-tree>
		</div>
        <div class="rbox" >
			<div class="rbox-box">
				<detail-form :selectNode="selectNode" :form="form" v-if="currentOperate=='detail'"></detail-form>
				<add-from :selectNode="operateNode" :form="form" v-if="currentOperate=='add'" @saveSuccess="saveSuccess"></add-from>
				<edit-form  v-if="currentOperate=='edit'" :selectNode="operateNode" :form="form" @updateSuccess="updateSuccess"></edit-form>
			</div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"
import dataDirTree from '../../components/tree'
import detailForm from './detailForm.vue'
import addFrom from './addFrom.vue'
import editForm from './editForm.vue'
import {
		businessClassList,
		dataDirList,
		dataDefineList,
		listDefineCode,
		// saveOrUpdateBusinessClass,
		removeRecoder,
		removeDir,
		removeDefine,
		enableDir
}from '../../api/sysconfig-datadir.js'
export default {
	data(){
		return{
             key: [],
			currentOperate:null,
			rootData:[{
				id: 0,
				label: '所有字典'
			}],
			buttons:[
				{
					icon:'plus',
					method:'add',
					isShowFun:(node)=>{
						if(!node.data.isAble)
							return true;
						else
							return false;
					}
				},
				{
					icon:'edit',
					method:'edit',
					isShowFun:(node)=>{
						if(node.level>1&&!node.data.isAble)
							return true;
						else
							return false;
					}
				},
				{
					icon:'delete',
					method:'del',
					isShowFun:(node)=>{
						if(node.level>1&&!node.data.isAble)
							return true;
						else
							return false;
					}
				},
				{
					icon:'star-off',
					method:'toUse',
					isShowFun:(node)=>{
						if(node.data.nodeType=='dir'&&!node.data.isAble)
							return true;
						else
							return false;
					}
				},
				{
					icon:'star-on',
					method:'toUse',
					isShowFun:(node)=>{
						if(node.data.nodeType=='dir'&&node.data.isAble)
							return true;
						else
							return false;
					}
				}
			],
			selectNode:{
				level:0,
				data:{
					id:-1
				}
			},
			operateNode:{
				level:0,
				data:{
					id:-1
				}
			},
			form:{},
			//当前节点
			currentKey:null,
		}
	},
	methods:{
		toUse(node){
			if(this.currentOperate=='detail'||this.currentOperate==null){
				enableDir({
					params:{
						id:node.data.id,
					},
					Vue:this
				}).then(res=>{
					if(res.result){
						this.$message.success('操作成功')
						node.data.isAble=!node.data.isAble
						console.log(node)
						if(node.data.id==this.selectNode.data.id){
							this.form.isAble=node.data.isAble
						}
						if(node.childNodes.length>0)
							this.childToUse(node.childNodes)
					}
						
				})
			}else{
				this.$message.error('请先停止当前操作')
			}
		},
		childToUse(nodes){
			for(let d of nodes){
				d.data.isAble=!d.data.isAble
				if(d.childNodes.length>0){
					this.childToUse(d.childNodes)
				}
			}
		},
		// 加载树节点
		loadNode(node,resolve){
			console.log(node)
			if(node.level==1){
				businessClassList({
					Vue:this,
					params:{}	
				}).then(res => {
					if (res.result) {
						res.model.forEach(element => {
							element.label=element.alias
						});
						resolve(res.model)
						if(this.currentKey){
							this.$refs.dirTree.$refs.modelTree.setCurrentKey(this.currentKey)
							this.nodeChange(this.$refs.dirTree.$refs.modelTree.getNode(this.currentKey))
						}
					}
				})
			}else{
				if(node.data.nodeType=='BusinessClass'){
					dataDirList({
						Vue:this,
						params:{
							type:node.data.id
						}	
					}).then(res => {
						if (res.result) {
							res.model.forEach(element=>{
								element.label=element.value
							})
							resolve(res.model)
							if(this.currentKey){
								this.$refs.dirTree.$refs.modelTree.setCurrentKey(this.currentKey)
								this.nodeChange(this.$refs.dirTree.$refs.modelTree.getNode(this.currentKey))
							}
						}
					})
				}else if(node.data.nodeType=='dir'){
					dataDefineList({
						Vue:this,
						params:{ dirCode:node.data.code}	
					}).then(res => {
						if (res.result) {
							res.model.forEach(element=>{
								element.label=element.value
							})
							resolve(res.model)
							if(this.currentKey){
								this.$refs.dirTree.$refs.modelTree.setCurrentKey(this.currentKey)
								this.nodeChange(this.$refs.dirTree.$refs.modelTree.getNode(this.currentKey))
							}
						}
					})
				}else{
					listDefineCode({
						Vue:this,
						params:{ parentId:node.data.id}	
					}).then(res => {
						if (res.result) {
							res.model.forEach(element=>{
								element.label=element.value
							})
							resolve(res.model)
							if(this.currentKey){
								this.$refs.dirTree.$refs.modelTree.setCurrentKey(this.currentKey)
								this.nodeChange(this.$refs.dirTree.$refs.modelTree.getNode(this.currentKey))
							}
						}
					})
				}
			}
		},
		nodeChange(node){
			console.log(node)
			this.currentKey=null
			this.selectNode=node;
			this.currentOperate='detail'
			this.form={...this.selectNode.data}
		},
		handleAdd(node){
			console.log(node)
			this.currentOperate='add'
			if(node.level==1){
				this.form={
					code:'',
					alias:''
				}
			}else if(node.level==2){
				this.form={
					code:'',
					value:'',
					dirIsOtherView:true,
					dirIsEdit:true,
					defineIsEdit:true,
					isAble:false
				}
			}else{
				console.log(node.data)
				this.form={
					code:'',
					value:'',
					parentId:node.data.nodeType=='dir'?0:node.data.id,
					dirId:node.data.nodeType=='dir'?node.data.id:node.data.dirId,
					dirCode:node.data.nodeType=='dir'?node.data.code:node.data.dirCode
				}
			}
			this.operateNode=node;
		},
		handlerDel(node){
			this.operateNode=node;
			this.$confirm('数据删除将无法复原, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if(node.level==2){
					removeRecoder({
						Vue:this,
						params:{
							id:node.data.id,
						}	
					}).then(res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.remove(node)
					})
				}else if(node.level==3){
					removeDir({
						Vue:this,
						params:{
							id:node.data.id,
						}	
					}).then(res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.remove(node)
					})
				}else{
					removeDefine({
						Vue:this,
						params:{
							id:node.data.id,
						}	
					}).then(res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.remove(node)
					})
				}
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		handleEdit(node){
			this.form={...node.data}
			this.operateNode=node;
			this.currentOperate='edit'
		},
		remove(node){
			node.parent.removeChild(node)
			if(this.selectNode.data.id==node.data.id){
				this.selectNode={
					level:0,
					data:{
						id:-1
					}
				}
				this.operateNode={
					level:0,
					data:{
						id:-1
					}
				}
				this.currentKey=null
			}else{
				this.operateNode=this.selectNode
			}
		},
		saveSuccess(data){
			var tree=this.$refs.dirTree.$refs.modelTree
			if(this.operateNode.loaded){
				this.operateNode.insertChild({data:{...data}})
				tree.setCurrentKey(data.id)
				this.nodeChange(tree.getNode(data.id))
			}else{
				if(this.operateNode.isLeaf){
					this.operateNode.isLeaf=false;
				}
				this.currentKey=data.id;
			 	tree.setCurrentKey(null) 
			}
			this.operateNode={
				level:0,
				data:{
					id:-1
				}	
			}
		},
		updateSuccess(data){
			var tree=this.$refs.dirTree.$refs.modelTree
			tree.setCurrentKey(data.id)
			for(let key in data){
				this.operateNode.data[key]=data[key]
			}
			this.nodeChange(tree.getNode(data.id))
			this.selectNode=this.operateNode
			this.operateNode={
				level:0,
				data:{
					id:-1
				}
			}
		}
	},
    computed: {
        ...mapState({
            sidebarHeight: state => state.app.sidebarHeight
        })
	},
	components:{
		dataDirTree,
		detailForm,
		addFrom,
		editForm
	}
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
			padding: 10px;
			box-sizing: border-box;
			overflow: auto;
			height: 100%;
		}
		.rbox {
			width: 100%;
			
			box-sizing: border-box;
			padding-left: 380px !important;
			height: 100%;
			.rbox-box{
				box-shadow: 1px 1px 15px #e6e6e6;
				background: #fff;
				height: 100%;
				overflow: auto;
			}
		}
	}
</style>

