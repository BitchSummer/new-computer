<template>
	<div>
		<toolbar>
			<span slot="left">
				<el-input size="small" style="width: 120px;" v-model="queryParam.fileName" placeholder="文件名或上传人搜索..."></el-input>
				<el-input size="small" style="width: 120px;" v-model="queryParam.fileType" placeholder="文件类型搜索..."></el-input>
				<el-input size="small" style="width: 120px;" v-model="queryParam.fileSize" placeholder="文件大小搜索..."></el-input>
        <el-date-picker v-model="queryParam.uploadTime" value-format="yyyy-MM-dd" size="small"style="width: 250px;top:2px" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<el-button icon="el-icon-search" size="small" style="width: 80px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
			</span>
			<span slot="right">
				<el-button size="small" type="primary" :disabled="this.currFolder==null||this.currFolder.id==0" icon="el-icon-plus" @click="doUpload">上传文件</el-button>
				<el-button size="small" icon="el-icon-delete" :disabled="selRows.length==0" @click="batchDel">批量删除</el-button>
				<el-button size="small" icon="el-icon-setting" :disabled="selRows.length==0" @click="batchMove">批量移动</el-button>
			</span>
		</toolbar>

		<div>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doView" @selection-change="tableSelectChanged"
		 @row-click="tableRowClick">
				<el-table-column type="selection" width="55" />
				<el-table-column resizable show-overflow-tooltip property="folderName" align="center" label="文件夹" width="150" />
				<el-table-column resizable show-overflow-tooltip property="fileName" align="center" label="文件名称" />
				<el-table-column resizable show-overflow-tooltip property="fileType" align="center" label="文件类型" width="120" />
				<el-table-column resizable show-overflow-tooltip property="fileSize" align="center" label="文件大小(MB)" width="120" />
				<el-table-column resizable show-overflow-tooltip property="createTime" align="center" label="上传时间" width="180" />
				<el-table-column resizable show-overflow-tooltip property="createBy" align="center" label="上传人" width="120" />
				<el-table-column resizable show-overflow-tooltip  align="center" label="操作" width="150" >
					<template slot-scope="scope">
						<el-button size="mini" type="text"  @click="doRename(scope.row)">重命名</el-button>
						<el-button size="mini" type="text"  @click="doDel(scope.row.id)">删除</el-button>
						<el-button size="mini" type="text"  @click="doMove(scope.row.id)">移动</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</div>
		<folder-tree-win ref="folderTreeWin" @callback="doSearch"/>
		<upload-win ref="uploadWin" @uploadSuccess="saveUploadInfo" />
	</div>
</template>
<script>
	import {
		filePage,
		saveFile,
		deleteFile
	} from '../../../api/resourcemgr-filemgr.js'
	import FolderTreeWin from './folder-tree-win.vue'
	import UploadWin from './upload-win.vue'
	export default {
		// props: ['currFolder'],
		data() {
			return {
			  curNode:null,
			  currFolder:null,
				selRows:[],
				queryParam: {
				},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				}
			}
		},
		methods: {
		  setCurFolder(data,node){
		    this.currFolder = data;
		    this.curNode = node;
      },
			doUpload() {
				this.$refs.uploadWin.show();
			},
			saveUploadInfo(data) {
				console.log(data,'data')
			let uploadInfo={}
			  uploadInfo.fileUrl=data.response.fileUrl;
			  uploadInfo.folderId = this.currFolder.id;    
			  uploadInfo.fileName=data.name
			  uploadInfo.fileSize=data.size
				saveFile({
					Vue: this,
					params: uploadInfo
				}).then(res => {
					if (res.result) {
						this.doSearch()
					}
				})
			},
			doRename(row){
				this.$prompt('', '文件重名称', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue:row.fileName,
					inputPattern:/\S{1,20}/,
					inputErrorMessage: '请输入1-20字符...'
				}).then(({ value }) => {
          saveFile({
						Vue: this,
						params: {
							id: row.id,
							fileName: value
						}
					}).then(res => {
						if (res.result) {
							this.$set(row,'fileName',value);
						}
					})
				});
			},
			doDel(ids){
				this.$confirm("您确认删除文件？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteFile({
							Vue: this,
							params: {
								ids: ids
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doMove(ids){
				this.$refs.folderTreeWin.show(ids);
			},
			batchDel(){
				let ids =[];
				this.selRows.forEach(item=>{
					ids.push(item.id)
				})
				this.doDel(ids.join(','))
			},
			batchMove(){
				let ids =[];
				this.selRows.forEach(item=>{
					ids.push(item.id)
				})
				this.doMove(ids.join(','))
			},
			doView(row) {
				window.open(row.fileUrl);
			},
			doSearch(page) {
				let param = { ...this.queryParam
				}
				console.log(this.currFolder,'this.currFolder')
				param.folderId = this.currFolder.id;
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				filePage({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
            if(this.curNode){
              this.$set(this.curNode,"expanded", true);
            }

					}
				})

			},
      // setWinIds(){
      //   let win = this.$refs.folderTreeWin;
      //   if(win){
      //       win.ids = this.selRows;
      //   }
      // },
			tableSelectChanged(selection) {
				this.selRows = selection

			},
			tableRowClick(row) {
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			}
		},
		components: {
			UploadWin,
			FolderTreeWin
		}
	}
</script>
<style lang="less">

</style>
