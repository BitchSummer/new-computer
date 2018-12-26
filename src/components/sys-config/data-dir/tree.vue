<template>
	<div>
		<el-input placeholder="输入关键字进行过滤" v-model="filterText">
		</el-input>
		<qwtree ref="qwTree" :config="treeConfig" @nodeLabelClicked="nodeLabelClicked" @addNode="addNode" @editNode="editNode"
		 @delNode="delNode"></qwtree>
	</div>
</template>
<script>
	import {
		mapState
	} from "vuex"
	import {
		businessClassList,
		dataDirList,
		dataDefineList,
		saveOrUpdateBusinessClass,
		removeRecoder,
		removeDir,
		removeDefine
		}
	 from '../../../api/sysconfig-datadir.js'
	export default {
		props: ['config','level'],
		data() {
			return {
				type:'',
				filterText: "",
				treeConfig: {
					isLoadFirst: true,
					/*初始化是否加载根元素*/
					propsTree: {
						label: 'label',
						children: 'children',
						isLeaf: 'isLeaf'
					},
					showCheckBox: false,
					treeData: [{
						id: 0,
						label: '所有字典',
						children: []
					}],
					curNode: null,
					/*加载子元素有则用此函数 无则抛出事件*/
					loadChildrenFunc: (node, nodeData) => {
						if (nodeData.id == 0) {
							this.loadBusinessClass(node)
						} else {
							console.log( nodeData.nodeType,'nodeData.nodeType1')
							if (nodeData.nodeType == 'business-class')
								this.loadDataDir(node, {
									businessClass: nodeData.businessClass								
								})
							else if (nodeData.nodeType == 'data-dir')
								this.loadDataDefine(node, {
									dirId: nodeData.id,
								/* 	parentId: 0 */
								})
							else {
								this.loadDataDefine(node, {
									/* parentId: nodeData.id */
								})
							}
						}
					}
				}
			}
		},
		computed: {
			...mapState({
				sidebarHeight: state => state.app.sidebarHeight
			})
		},
		methods: {
			//树过滤操作
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			loadBusinessClass(node, param) {
				businessClassList({
					Vue:this,
					params:{}	
				}).then(res => {
					if (res.result) {
						let businessClassArr = res.model;
						businessClassArr.forEach(businessClass => {	
							businessClass.label = businessClass.alias;
							console.log(businessClass.label,'businessClass.label')
							businessClass.children = [];
							businessClass.nodeType = 'business-class'
							node.data.children.push(businessClass);
						})
						node.loading = false;
						node.expanded = true;
						node.loaded = true;
						this.config.businessClassArr = res.model;
					}
				})
			},
		//根据业务大类获取数据字典
		loadDataDir(node, param) {
			console.log(node.data.id,"node.data.id")
			dataDirList({
					Vue:this,
					params:{
						type:node.data.id
					}	
				}).then(res => {
					if (res.result) {
						let dataDirArr = res.model;
						dataDirArr.forEach(dataDir => {
							console.log(dataDir,'dataDir')
					/* 		console.log(dataDir.id,'dataDir.id')
							this.dirId=dataDir.id
							eventBus.$emit("myFun",this.dirId)  */
							dataDir.label = dataDir.value;
							dataDir.children = [];
							dataDir.nodeType = 'data-dir'
						    if(node.data.children&&node.data.children.length>=0)
								node.data.children.push(dataDir);
							else
								node.data.children=[dataDir]
						})
						node.loading = false;
						node.expanded = true;
						node.loaded = true;
					}
				})
			},
			//根据数据字典获取数据定义树
			loadDataDefine(node, param) {
				dataDefineList({
					Vue:this,
					params:{ dirCode:node.data.code}	
				}).then(res => {
					if (res.result) {
						let dataDefineArr = res.model;
						dataDefineArr.forEach(dataDefine => {
							dataDefine.label = dataDefine.value;
							dataDefine.children = [];
							dataDefine.nodeType = 'data-define';
							if(node.data.children&&node.data.children.length>=0)
								node.data.children.push(dataDefine);
							else
								node.data.children=[dataDefine]
						})
						node.loading = false;
						node.expanded = true;
						node.loaded = true;
					}
				})
			},
			nodeLabelClicked(node) {
				console.log("nodeLabelClicked", node.id)
				this.$emit("doView",node)
			},
			addNode(node) {
		/* 		alert("添加：" + node.data.label)
				let id = Date.parse(new Date());
				node.data.children.push({
					id: id,
					label: "添加数据_" + id,
					children: []
				})
				node.loading = false;
				node.expanded = true;
				node.loaded = true;
				this.$set(node, "expended", true);
				console.log("addNode", node) */
				this.$emit("addNode",node)
			},
			editNode(node) {
			/* 	alert("编辑：" + node.data.label)
				console.log("editNode", node) */
				this.$emit("editNode",node)
			},
			delNode(node) {
				let level=node.level 
				if(level==2){
				removeRecoder({
					Vue:this,
					params:{
						id:node.data.id,
					   }	
				}).then(res => {
				let qwTree = this.$refs.qwTree;
				if (qwTree) {
					qwTree.remove(node.data.id);
				}
				})
				}else if(level==3){
                removeDir({
					Vue:this,
					params:{
						id:node.data.id,
					   }	
				}).then(res => {
				let qwTree = this.$refs.qwTree;
				if (qwTree) {
					qwTree.remove(node.data.id);
				}
				})
				}else if(level==4||level>4){
                removeDefine({
					Vue:this,
					params:{
						id:node.data.id,
					   }	
				}).then(res => {
				let qwTree = this.$refs.qwTree;
				if (qwTree) {
					qwTree.remove(node.data.id);
				}
				})
				}
			}

		}
	}
</script>
