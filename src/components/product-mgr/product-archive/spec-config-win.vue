<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="cancel" @showWin="doSearch">
			<radio-or-check :dataItems="config.configItems" :selResult="config.configSelResult"></radio-or-check>
			<toolbar>
				<span slot="left">
					<el-radio-group size="mini" v-model="queryParam.isAble">
						<el-radio-button label="">全部</el-radio-button>
						<el-radio-button label="停用">已停用</el-radio-button>
						<el-radio-button label="启用">已启用</el-radio-button>
					</el-radio-group>
					<el-radio-group size="mini" v-model="queryParam.isSetImage">
						<el-radio-button label="">全部</el-radio-button>
						<el-radio-button label="setImage">已绑图片</el-radio-button>
						<el-radio-button label="noImage">未绑图片</el-radio-button>
					</el-radio-group>
					<el-button size="mini" icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
					<el-button size="mini" icon="el-icon-close" type="danger" @click="doRest">清空条件</el-button>
				</span>
				<span slot="right">
					<el-button size="mini" icon="el-icon-plus" type="primary" @click="batchAdd">按配置项添加</el-button>
					<el-dropdown @command="handleCommand">
						<el-button size="mini">
							批量操作<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="batchDelete" :disabled="batchStatus!='已停用'">批量删除</el-dropdown-item>
							<el-dropdown-item command="batchImgBind" :disabled="batchStatus!='已停用'">图片批绑</el-dropdown-item>
							<el-dropdown-item command="batchAbleOrDisAble" :disabled="batchStatus.length>3">批量启停</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-button size="mini" icon="el-icon-check" type="danger" @click="doCheck">遗漏检查</el-button>
				</span>
			</toolbar>
			<el-table ref="table" :data="tableData" border style="width: 98%;margin:0 10px;" @selection-change="tableSelectChanged"
			 @row-click="tableRowClick">
				<el-table-column type="selection" width="55" />
				<el-table-column property="isAble" align="center" label="启停标识" width="100px">
					<template slot-scope="scope">
						<el-tag size="medium" :type="scope.row.isAble=='已启用'?'success':'danger'">{{ scope.row.isAble }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="spec" align="center" label="规格型号" width="200px" />
				<el-table-column property="resource" align="center" label="关联资源" width="300px">
					<template slot-scope="scope">
						<el-select size="small" v-model="scope.row.resourceId" placeholder="请选择关联资源" @change="change(scope.row)">
							<el-option v-for="item in config.productResourceList" :key="item.resourceId" :label="item.resourceName" :value="item.resourceId">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column property="imageUrls" align="center" label="产品图片" />
				<el-table-column label="操作" align="center" width="250">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
						<el-button size="mini" type="text" @click="imgBind(scope.row.id)">关联图片</el-button>
						<el-button size="mini" type="text" @click="ableOrDisableHandler(scope.row.id)">{{scope.row.isAble=='已启用'?'已停用':'已启用'}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</toast>
		<check-win :config="checkConfig" />
		<file-choose-win ref="fileChooseWin" @callback="bindImgs"/>
	</div>
</template>

<script>
	import {
		productDetailList,
		buildProductDetails,
		ableOrDisableProductDetail,
		deleteProductDetail,
		bindImgsProductDetails,
		updateDetialsOne
	} from '../../../api/productmgr-productarchive.js'
	import CheckWin from './check-win.vue'
	import FileChooseWin from '../../resource-mgr/file-mgr/file-choose-win.vue'

	export default {
		props: ['config'],
		data() {
			return {
				currSelItem: null,
				selItemArr: null,
				batchStatus: '',
				tableData: [],
				queryParam: {
					isAble: '',
					isSetUnitGroup: '',
					isSetImage: ''
				},
				toBindImgProductDetailIds:null,
				checkConfig: {
					title: '遗漏检查', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '700px', //弹窗宽
					configItems: null,
					btnData: [{
						isShow: true,
						disabled: false,
						name: '关闭窗口', //按钮名
						method: 'cancel', //回调函数
					}]
				}
			}
		},
		methods: {
			change(row){
				if(row.resourceId){
					updateDetialsOne({
						Vue:this,
						params:row
					}).then(res=>{
						if(res.result){
							
						}
					})
				}
				
			},
			/**
			 * 查询
			 */
			doSearch() {
				let param = { ...this.queryParam
				}
				param.productId = this.config.productId
				param.configOptions = this.config.configSelResult
				productDetailList({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						this.tableData = res.model
						console.log(this.tableData,'*********')
					}
				})
			},
			doRest() {
				this.queryParam = {
					isAble: '',
					isSetUnitGroup: '',
					isSetImage: ''
				};
				this.config.configSelResult.forEach(item => {
					item.value.splice(0, item.value.length)
				})
			},
			handleCommand(command) {
				if (command == 'batchDelete')
					this.batchDelete();
				else if (command == 'batchImgBind')
					this.batchImgBind();
				else if (command == 'batchAbleOrDisAble')
					this.batchAbleOrDisAble();
			},
			/**
			 * 批量添加
			 */
			batchAdd() {
				let i = 1;
				for (let confResult of this.config.configSelResult) {
					if (confResult.value.length == 0) {
						this.$message({
							message: '第' + i + '行配置项为空,请进行选择...',
							type: 'warning'
						});
						return;
					}
					i++;
				}
				buildProductDetails({
					Vue: this,
					params: {
						productId: this.config.productId,
						configOptions: this.config.configSelResult
					}
				}).then(res => {
					if (res.result)
						this.doSearch();
				})
			},


			batchDelete() {
				this.doDel(this.getSelIds())
			},
			doDel(ids) {
				this.$confirm('您确认删除产品规格, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteProductDetail({
						Vue: this,
						params: {
							idArr: ids
						}
					}).then(res => {
						if (res.result)
							this.doSearch();
					})

				});

			},
			imgBind(ids){
				this.toBindImgProductDetailIds = ids;
				this.$refs.fileChooseWin.show();
			},
			batchImgBind() {
				this.imgBind(this.getSelIds())
			},
			bindImgs(selectFiles){
				let fileIds=[]
				selectFiles.forEach(file=>{
					fileIds.push(file.id)
				})
				bindImgsProductDetails({
					Vue: this,
					params: {
						ids: this.toBindImgProductDetailIds,
						fileIds:fileIds.join(',')
					}
				}).then(res => {
					if (res.result)
						this.doSearch();
				})
			},
			doCheck() {

				if (this.checkConfig.configItems == null) {
					let configItems = JSON.parse(JSON.stringify(this.config.configItems));
					configItems.forEach(item => {
						item.value = [...item.options]
						delete item.options
					})
					this.checkConfig.configItems = configItems;
					this.checkConfig.productId = this.config.productId;
				}
				this.checkConfig.dialogVisible = true;
			},
			getSelIds() {
				let idArr = []
				this.selItemArr.forEach(item => {
					idArr.push(item.id);
				})
				return idArr.join(',')
			},
			/**
			 * 启用/停用产品
			 */
			batchAbleOrDisAble() {
				this.ableOrDisableHandler(this.getSelIds())
			},
			ableOrDisableHandler(_idArr) {
				ableOrDisableProductDetail({
					Vue: this,
					params: {
						idArr: _idArr
					}
				}).then(res => {
					if (res.result)
						this.doSearch();
				})

			},
			tableSelectChanged(selection) {
				this.selItemArr = selection;
				let batchStatus = '';
				selection.forEach(item => {
					if (batchStatus.indexOf(item.isAble) == -1)
						batchStatus += item.isAble;
				})
				this.batchStatus = batchStatus;

			},
			tableRowClick(row) {
				this.currSelItem = row;
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			},
			cancel() {
				this.config.dialogVisible = false;
				this.$emit('callback')
			}
		},
		components: {
			CheckWin,
			FileChooseWin
		}

	}
</script>

<style lang="less">


</style>
