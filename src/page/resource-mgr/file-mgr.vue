<template>
	<div>
		<el-row :gutter="8">
			<el-col :span="6">
				<el-card>
					<folder-tree ref="folderTree" @nodeLabelClicked="nodeLabelClicked" @nodeChange="nodeChange"/>
				</el-card>
			</el-col>
			<el-col :span="18">
        <!--:currFolder="currFolder"-->
				<file-list ref="fileList" />
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import FolderTree from '../../components/resource-mgr/file-mgr/folder-tree.vue'
	import FileList from '../../components/resource-mgr/file-mgr/file-list.vue'

  export default {
    components: {
      FolderTree,
      FileList
    },
    data() {
      return {
        currFolder: null,
      }
    },
    methods: {
      nodeLabelClicked(node){
        console.log("nodeLabelClicked===>",node)
        this.currFolder = node.data;
        let fileList = this.$refs.fileList;
        if(fileList){
            fileList.setCurFolder(this.currFolder,node);
            this.$refs.fileList.doSearch();
        }
      },
      nodeChange(node, data) {
        // this.currFolder = data;
        // this.$refs.fileList.doSearch();
      }

    },
    mounted() {
    }
  };
</script>
<style lang="less">

</style>
