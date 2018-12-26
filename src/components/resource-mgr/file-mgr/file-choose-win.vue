<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doChoose="doChoose">
		<el-row :gutter="8" style="margin: auto 10px;">
			<el-col :span="6">
				<el-card>
					<folder-tree ref="folderTree" @nodeChange="nodeChange"/>
				</el-card>
			</el-col>
			<el-col :span="18">
				<file-list ref="fileList" :currFolder="currFolder"/>
			</el-col>
		</el-row>
	</toast>
</template>
<script>
	import FolderTree from './folder-tree.vue'
	import FileList from './file-list.vue'

	export default {
		components: {
			FolderTree,
			FileList
		},
		data() {
			return {
				currFolder: null,
				config: {
					title: "文件资源选择", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1400px", //弹窗宽
					btnData: [{
						isShow: true,
						name: "取消",
						bgColor: "dialog-normal",
						method: "cancel"
					}, {
						isShow: true,
						disabled: false,
						bgColor: 'dialog-deep-blue',
						name: '确定选择', //按钮名
						method: 'doChoose', //回调函数
					}]
				}
			}
		},
		methods: {
			nodeChange(node,data){
				this.currFolder = data;
				this.$refs.fileList.doSearch();
			},
			show(){
				this.config.dialogVisible = true
			},
			doChoose(){
				let selectRows =this.$refs.fileList.getSelectRows();
				if(selectRows==null||selectRows.length==0){
					this.$message({
						message: '请选择文件资源...',
						type: 'warning'
					});
					return;
				}else{
					this.config.dialogVisible = false;
					this.$emit('callback',selectRows)
				}
					
			}
		},
		mounted() {}
	}
</script>
<style lang="less">

</style>
