<!--
  规格配置
 -->

<template>
		<tree ref="tree"
		:readOnly="false"
		:props="props"
		:rootData="rootData"
		:buttons="buttons"
		@loadNode="loadMenu"
		@doAdd="doAdd"
			@doDel="doDel"
			@nodeChange="nodeChange"
			@init="initTree"></tree>
</template>

<script>
	import {
		saveOrUpdateMenu,
		deleteMenu
	} from '../../../api/resourcemgr-appmgr.js'
  export default {
    props: ['menuList'],
    data() {
      return {
				rootNode:null,
				props: {
					label: 'menuName',
					isLeaf: 'isLeaf'
				},
				buttons: [{
					icon: 'plus',
					method: 'doAdd'
				}, {
					icon: 'delete',
					method: 'doDel',
					isShowFun: (node) => {
						return node.data.id != 0;
					}
				}],
				rootData: [{
					menuName: '所有菜单',
					id: 0,
					isLeaf: false
				}]
      };
    },
    methods: {
			initTree(rootNode){
				this.rootNode=rootNode
			},
			init(){
				let rootNode = this.rootNode.childNodes[0];
				this.$set(rootNode,'expanded',false)
				this.$set(rootNode,'isLeaf',false)
				this.$set(rootNode,'loaded',false)
			},
      nodeChange(node, data) {
				this.$emit("loadMenuInfo", node, data);
      },
			doAdd(node, data){
				this.$emit("doAddMenu", node, data);
			},
      loadMenu(node, resolve, parentId) {
				let arr = this.menuList.filter(item => item.parentId == parentId)
				resolve(arr)
      },
			doDel(node, data) {
				this.$confirm("您确认删除菜单？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteMenu({
							Vue: this,
							params: {
								id: data.id
							}
						}).then(res => {
							if (res.result) {
								let parent = node.parent;
								parent.removeChild(node)
							}
						})
					})
			}
    }
  }

</script>
<style lang="less">

</style>
