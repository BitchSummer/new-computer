<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="doSearch" @doSave="doSave">
			<div style="margin: 5px 15px;">
				<el-card>
					<price-record-form :config="config" ref="proceRecord"/>
				</el-card>
				<toolbar class="custom-toolbar">
					<span slot="right">
						<el-autocomplete class="inline-input" size="small" style="width: 200px;" v-model="addProductParam.keyword"
						 value-key="productCodeAndName" :fetch-suggestions="queryProduct" placeholder="产品编码或名称查询..." :trigger-on-focus="false"
						 @select="doProductSelect"></el-autocomplete>
						<el-select size="small" style="width: 200px;" multiple collapse-tags v-model="addProductParam.productDetailIdArr"
						 placeholder="请选择产品规格">
							<el-option v-for="item in productDetailArr" :key="item.id" :label="item.spec" :value="item.id">
							</el-option>
						</el-select>
						<el-button size="small" type="danger" :disabled="false" icon="el-icon-plus" @click="addProductDetail">添加产品</el-button>
					</span>
					<span slot="left">
						<el-select size="small" style="width: 120px;" v-model="priceParam.priceModel" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
							</el-option>
						</el-select>
						<el-input-number :precision="2" :controls="false" size="small" style="width: 150px;" placeholder="调整价格或百分比...."
						 v-model="priceParam.priceValue" />
						<el-button size="small" type="primary" :disabled="false" icon="el-icon-plus" @click="batchPrice">批量调价</el-button>
					</span>
				</toolbar>
				<el-card>
					<price-record-detail :config="detailListConfig" :unitPriceConfig="unitPriceConfig" />
				</el-card>
			</div>

		</toast>
		<unit-price :config="unitPriceConfig" />
	</div>
</template>

<script>
	import {
		queryProduct,
		queryProductDetail
	} from "../../../api/productmgr-base.js"

	import {
		saveOrUpdatePriceRecord,
		priceRecordDetailList,
		priceRecordPage
	} from "../../../api/productmgr-productprice.js"
	import PriceRecordForm from './price-record-form.vue'
	import PriceRecordDetail from './price-record-detail.vue'
	import UnitPrice from './unit-price-win.vue'
	export default {
		components: {
			PriceRecordForm,
			PriceRecordDetail,
			UnitPrice
		},
		props: ['config'],
		data() {
			return {
				addProductParam: {
					productId: 0,
					keyword: '',
					productDetailIdArr: []
				},
				detailListConfig: {
					tableData: [],
					selectRows: []
				},
				productDetailArr: [],
				priceParam: {
					priceModel: '固定值(元)',
					priceValue: 0
				},
				options: [{
					value: '固定价(元)'
				}, {
					value: '百分比(%)'
				}],
				unitPriceConfig: {
					title: '单位价格换算参考', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '800px', //弹窗宽
					productDetailId: 0,
					unitGroupId: 0,
					modifyPrice:0,
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
			empt(){
				let emp = this.$refs['proceRecord']
				if(emp){
					emp.empty()
				}
			},
			batchPrice() {
				if (this.detailListConfig.selectRows.length == 0) {
					this.$message({
						message: '请选择产品...',
						type: 'warning'
					});
					return;
				} else {
					if (this.priceParam.priceModel == '固定值(元)') {
						this.detailListConfig.selectRows.forEach(item => {
							item.modifyPrice = this.priceParam.priceValue;
						})
					} else {
						this.detailListConfig.selectRows.forEach(item => {
							item.modifyPrice = item.price * this.priceParam.priceValue / 100;
						})
					}
				}
				this.priceParam = {
					priceModel: '固定值(元)',
					priceValue: 0
				}
			},
			addProductDetail() {
				this.productDetailArr.forEach(productDetail => {
					if (this.addProductParam.productDetailIdArr.indexOf(productDetail.id) > -1) {
						let temp = { ...productDetail
						}
						temp.productDetailId = temp.id;

						temp.modifyPrice = 0;
						delete temp.id;
						if (this.detailListConfig.tableData.filter(item => {
								item.productDetailId == temp.productDetailId
							}).length == 0)
							this.detailListConfig.tableData.push(temp)
					}
				})
				this.addProductParam = {
					productId: 0,
					keyword: '',
					productDetailIdArr: []
				}
			},
			queryProduct(keyword, cb) {
				queryProduct({
					Vue: this,
					params: {
						keyword: keyword
					}
				}).then(res => {
					if (res.result) {
						cb(res.model);
					}
				})

			},
			doProductSelect(product) {
				queryProductDetail({
					Vue: this,
					params: {
						productId: product.id
					}
				}).then(res => {
					if (res.result) {
						this.productDetailArr = res.model;
					}
				})
			},
			doSave() {
				this.$refs['proceRecord'].$refs['form'].validate((valid) => {
					if(valid) {
						let param = { ...this.config.form
						}
						param.detailList = this.detailListConfig.tableData
						saveOrUpdatePriceRecord({
							Vue: this,
							params: param
						}).then(res => {
							if (res.result) {
								this.$parent.doSearch()
								this.config.dialogVisible = false;
							}
						})

					}
				})
			},

			/**
			 * 查询
			 */
			doSearch() {
				this.detailListConfig.tableData.splice(0, this.detailListConfig.tableData.length)
				if (this.config.form.id > 0) {
					priceRecordDetailList({
						Vue: this,
						params: {
							recordId: this.config.form.id
						}
					}).then(res => {
						if (res.result) {
							this.detailListConfig.tableData = res.model;
						}
					})
				} else if (this.config.selectRows.length > 0) {
					this.config.selectRows.forEach(productDetail => {
						let temp = { ...productDetail
						}
						temp.productDetailId = temp.id;
						temp.modifyPrice = 0;
						delete temp.id;
						if (this.detailListConfig.tableData.filter(item => {
								item.productDetailId == temp.productDetailId
							}).length == 0)
							this.detailListConfig.tableData.push(temp)
					})
				}
			}
		}
	}
</script>

<style lang="less">

</style>
