<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSure="doSure">
		<div style="margin: 5px 20px">
			<tree ref="flderTree" :readOnly="true" :props="props" :rootData="rootData" @loadNode="loadNode" @nodeChange="nodeChange" />
		</div>
		
	</toast>
</template>
<script>
  import tree from '../../tree.vue'
	import {
		folderList,
    moveFile
	} from '../../../api/resourcemgr-filemgr.js'
	export default {
    components:{
      tree
    },
		data() {
			return {
				ids: null,
				folderArr: [],
				props: {
					label: 'folder',
					isLeaf: 'isLeaf'
				},
				currNodeData:null,
				rootData: [{
					folder: '资源文件夹',
					id: 0,
					isLeaf: false
				}],
				config: {
					title: "文件夹选择", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "600px", //弹窗宽
					btnData: [{
						isShow: true,
						name: "关闭窗口",
						bgColor: "dialog-normal",
						method: "cancel"
					}, {
						isShow: true,
						disabled: false,
						bgColor: 'dialog-deep-blue',
						name: '确定', //按钮名
						method: 'doSure', //回调函数
					}]
				}
			}
		},
		methods: {
			show(ids){
				this.ids = ids;
				this.currNodeData= null;
				this.config.dialogVisible = true;
			},
			doSure(){
				this.$confirm("您确认移动至选中文件夹？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
					  let temp=[];
					  let tmp=(this.ids+"").split(",");
					  console.log(tmp,"555555555")
					  for (var i=0;i<tmp.length;i++) {
              temp.push({id: tmp[i], folderId: this.currNodeData.id })
            }
            moveFile({
							Vue: this,
							params:temp,
						}).then(res => {
							if (res.result) {
								this.config.dialogVisible = false;
								this.$emit('callback')
							}
						})
					})
			},
			nodeChange(node, data) {
				this.currNodeData = data;
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
