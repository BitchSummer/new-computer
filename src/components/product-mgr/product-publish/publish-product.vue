<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="right">
				<el-button size="small" type="primary"  icon="el-icon-plus" @click="doAdd">新增待发布</el-button>
				<el-button size="small"  icon="el-icon-plus" :disabled="publishRecordForm.status!='待发布'" @click="doSubmit">提交预发布</el-button>
				<el-button size="small"  icon="el-icon-plus" :disabled="publishRecordForm.status=='已发布'" @click="doRevoke">撤销发布</el-button>
			</span>
			<span slot="left">
				<el-radio-group v-model="showModel" size="small">
					<el-radio-button label="list">列表模式</el-radio-button>
					<el-radio-button label="image">图形模型</el-radio-button>
				</el-radio-group>
				<el-input size="small" style="width: 120px;" placeholder="产品编码搜索...." v-model="queryParam.productCode" />
				<el-input size="small" style="width: 120px;" placeholder="产品名称搜索...." v-model="queryParam.productName" />

				<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
				<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={};">清空条件</el-button>
				<span style="font-size: 12px;font-weight: 400;">发布状态：{{publishRecordForm.status}} </span>
			</span>
		</toolbar>
		<el-card>
			<publish-list :queryParam="queryParam" @setSelectRows="setSelectRows" ref="publishList" />
		</el-card>
		<publish-win :config="addPublishConfig" />
	</div>
</template>
<script>
	import {
		publishRecordList,
		submitPublishRecord,
		revokePublishRecord
	} from "../../../api/productmgr-productpublish.js"
	import PublishList from './publish-list.vue'
	import PublishWin from './publish-win.vue'
	export default {
		components: {
			PublishList,
			PublishWin
		},
		data() {
			return {
				showModel: 'list',
				selectRows: [],
				queryParam: {
					publishDate: ''
				},
				//筛选数据
				classifiedConfig: [{
					title: '发布年份:',
					options: []
				}, {
					title: '发布月份:',
					options: []
				}, {
					title: '发布日:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				addPublishConfig: {
					title: '发布产品添加', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1300px', //弹窗宽
					form: {},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '确认新增', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				publishRecordForm:{},
				yearArr: [],
				monthMap: new Map(),
				recordMap: new Map(),
			}
		},
		methods: {
			doAdd() {
				this.addPublishConfig.dialogVisible = true;
			},
			doSubmit(){
				let id = []
				this.selectRows.forEach(item=>{
					id.push(item.id)
				})
				id=id.join(',')
				this.$confirm("您确认提交发布？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						submitPublishRecord({
							Vue: this,
							params: {
								ids: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doRevoke(){
				let id = []
				this.selectRows.forEach(item=>{
					id.push(item.id)
				})
				id=id.join(',')
				this.$confirm("您确认撤回发布？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						revokePublishRecord({
							Vue: this,
							params: {
								ids: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doSearch() {
				this.$refs.publishList.doSearch();
			},
			doClickHandler(index, option) {
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);

					let monthArr = this.monthMap.get(option.value);
					if (monthArr && monthArr.length > 0) {
						monthArr.forEach(month => {
							let temp = {}
							temp.label = month;
							temp.value = this.selectedItems[0].value + '-' + month;
							this.classifiedConfig[1].options.push(temp);
						});
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].value;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				} else if (index == 1) {
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					let recordArr = this.recordMap.get(option.value);
					if (recordArr && recordArr.length > 0) {
						recordArr.forEach(record => {
							record.label = record.day;
							record.value = record.day;
							if (record.status != '已发布')
								record.disabled = true;
							this.classifiedConfig[2].options.push(record);

						});
						this.selectedItems[2].value = this.classifiedConfig[2].options[0].value;
						this.doClickHandler(2, this.classifiedConfig[2].options[0])
					}
				} else {
					let temp = {...option}
					delete temp.value;
					delete temp.label;
					delete temp.disabled
					this.publishRecordForm = temp;
					this.queryParam.recordId = temp.id;
					this.doSearch();
				}

			},
			setSelectRows(selectRows) {
				this.selectRows = selectRows;
			},
			loadPublishRecordList() {
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				publishRecordList({
					Vue: this,
					params: {},
				}).then(res => {
					if (res.result) {
						let tempArr = res.model;
						let yearArr = []
						this.monthMap = new Map();
						this.recordMap = new Map();

						if (tempArr != null && tempArr.length > 0) {
							tempArr.forEach(temp => {
								if (yearArr.indexOf(temp.year) == -1) {
									yearArr.push(temp.year);
									this.monthMap.set(temp.year, [temp.month]);
									this.recordMap.set(temp.year + '-' + temp.month, [temp]);

									this.classifiedConfig[0].options.push({
										label:temp.year,
										value:temp.year
									});
								} else if (this.monthMap.get(temp.year).indexOf(temp.month) == -1) {
									this.monthMap.get(temp.year).push(temp.month);
									this.recordMap.set(temp.year + '-' + temp.month,[temp]);
								} else if (this.recordMap.get(temp.year + '-' + temp.month).indexOf(temp.day) == -1) {
									this.recordMap.get(temp.year + '-' + temp.month).push(temp);
								}
							});
							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}

					}
				})
			}
		},
		mounted: function() {
			this.loadPublishRecordList();

		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
