<template>
	<tree ref="folderTree" :readOnly="false" @nodeLabelClicked="nodeLabelClicked" :props="props" :rootData="rootData" :buttons="buttons" @loadNode="loadNode" @doAdd="doAdd"
	 @doRename="doRename" @doDel="doDel" @nodeChange="nodeChange"/>

</template>
<script>
  import tree from '../../tree.vue'
	import {
		folderList,
		saveFolder,
		deleteFolder
	} from '../../../api/resourcemgr-filemgr.js'
	export default {
    components:{tree},
		data() {
			return {
				folderArr: [],
				props: {
					label: 'folder',
					isLeaf: 'isLeaf'
				},
				buttons: [{
					icon: 'plus',
					method: 'doAdd'
				}, {
					icon: 'edit',
					method: 'doRename',
					isShowFun: (node) => {
						return node.data.id != 0;
					}
				}, {
					icon: 'delete',
					method: 'doDel',
					isShowFun: (node) => {
						return node.data.id != 0;
					}
				}],
				rootData: [{
					folder: '资源文件夹',
					id: 0,
					isLeaf: false
				}]
			}
		},
		methods: {
      nodeLabelClicked(node){
         this.$emit("nodeLabelClicked",node)
      },
			nodeChange(node, data){
				this.$emit('nodeChange',node,data);
			},
			doAdd(node, data) {
				this.$prompt('', '文件夹--新增', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: '',
					inputPattern: /\S{1,8}/,
					inputErrorMessage: '请输入1-8字符...'
				}).then(({
					value
				}) => {
          saveFolder({
						Vue: this,
						params: {
              parentId:node.data.id,
							folder: value
						}
					}).then(res => {
						if (res.result) {
              if(node.isLeaf){
                this.$set(node,'isLeaf',false)
                this.$set(node,'loaded',false)
              }
              node.insertChild({data:{id:res.model.id,folder:value,isLeaf:true}})
              node.expanded=true
						}
					})
				});
			},
			doRename(node, data) {
				this.$prompt('', '文件夹--重命名', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: data.folder,
					inputPattern: /\S{1,8}/,
					inputErrorMessage: '请输入1-8字符...'
				}).then(({
					value
				}) => {
					saveFolder({
						Vue: this,
						params: {
						  id:node.data.id,
							folder: value
						}
					}).then(res => {
						if (res.result) {
							this.$set(node.data, 'folder', value);
						}
					})
				});
			},
			doDel(node, data) {
				this.$confirm("您确认删除文件夹？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteFolder({
							Vue: this,
							params: {
								ids: data.id
							}
						}).then(res => {
							if (res.result) {
								let parent = node.parent;
								parent.removeChild(node)
							}
						})
					})
			},
			loadNode(node, resolve, parentId) {
				let arr = this.folderArr.filter(item => item.parentId == parentId)
				resolve(arr)
			},
			loadFolderList() {
				this.folderArr.splice(0, this.folderArr.length)
				folderList({
					Vue: this,
					params: {}
				}).then(res => {
					if (res.result) {
						this.folderArr = res.model;
					}
				})
			}
		},
		mounted() {
			this.loadFolderList()
		}
	}
</script>
<style lang="less">
</style>
