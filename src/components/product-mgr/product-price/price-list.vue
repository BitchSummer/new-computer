<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="right">
				<el-button size="small" type="primary" :disabled ="false" icon="el-icon-plus" @click="doAdd">产品调价</el-button>
			</span>
			<span slot="left">
			<el-input size="small" style="width: 180px;" placeholder="产品编码搜索...." v-model="queryParam.productCode"/>
			<el-input size="small" style="width: 180px;" placeholder="产品名称搜索...." v-model="queryParam.productName"/>

			<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
			<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
		</span>
		</toolbar>
		<el-card>
		<product-list  :queryParam="queryParam" @setSelectRows="setSelectRows" ref="productList"/>
		</el-card>
		<price-record-form-win :config="priceRecordConfig" ref="FormWin"></price-record-form-win>
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList
	} from "../../../api/productmgr-base.js"
// 	import {
// 		productPage
// 	} from "../../../api/productmgr-productarchive.js"
	import ProductList from './product-list.vue'
	import PriceRecordFormWin from './price-record-form-win.vue'

	export default {
		components: {
			ProductList,
			PriceRecordFormWin
		},
		data() {
			return {
				selectRows:[],
				queryParam:{
					isAble:''
				},
				//筛选数据
				classifiedConfig: [{
					title: '市场名称:',
					options: []
				}, {
					title: '市场大类:',
					options: []
				}, {
					title: '产品大类:',
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
				publicAttrs:[],
				privateAttrs:[],
				configAttrs:[],
				productConfig: {
					title: '产品档案维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1000px', //弹窗宽
					form:{
						publicAttrs:{},
						privateAttrs:{},
						configAttrs:{}
					},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				priceRecordConfig: {
					title: '调价单', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1300px', //弹窗宽
					form:{
					},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				marketArr:[],
				marketClassMap: new Map(),
				productClassMap: new Map(),
			}
		},
		methods: {
			doAdd(){
				this.$refs['FormWin'].empt()
				this.priceRecordConfig.selectRows = this.selectRows;
				this.priceRecordConfig.dialogVisible = true;
			},
			doSearch(){
				this.$refs.productList.doSearch();
			},
			doClickHandler(index, option) {
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);

					let marketClassArr = this.marketClassMap.get(option.value);
					if (marketClassArr && marketClassArr.length > 0) {
						marketClassArr.forEach(marketClass => {
							marketClass.label = marketClass.alias;
							marketClass.value = marketClass.id;
							this.classifiedConfig[1].options.push(marketClass);
						});
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].value;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				} else if (index == 1) {
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					let productClassArr = this.productClassMap.get(option.value);
					if (productClassArr && productClassArr.length > 0) {
						productClassArr.forEach(productClass => {
							productClass.label = productClass.alias;
							productClass.value = productClass.id;
							if (productClass.isAble == '停用')
								productClass.disabled = true
							this.classifiedConfig[2].options.push(productClass);

						});
						this.selectedItems[2].value = this.classifiedConfig[2].options[0].value;
						this.doClickHandler(2, this.classifiedConfig[2].options[0])
					}
				} else {
					let optionTemp =  { ...option
					}
					delete optionTemp.label;
					delete optionTemp.value;
					delete optionTemp.disabled;
					
					optionTemp.publicAttrs = this.publicAttrs;
					optionTemp.privateAttrs =[];
					optionTemp.configAttrs =[];
				}

			},
			
			loadMarketAndClassAndProduct() {
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				marketClassAndProductClassList({
					Vue: this,
					params: this.queryParam,
				}).then(res => {
					if (res.result) {

						let marketList = res.model.marketList;
						let classList = res.model.classList;
						let productClassList = res.model.productClassList;
						this.marketArr = marketList;
						if (marketList != null && marketList.length > 0) {
							marketList.forEach(market => {
								market.label = market.alias
								market.value = market.id;
								if (market.isAble == '停用')
									market.disabled = true
								this.classifiedConfig[0].options.push(market);
							});

							this.marketClassMap = new Map();
							classList.forEach(marketClass => {
								if (this.marketClassMap.has(marketClass.marketId))
									this.marketClassMap.get(marketClass.marketId).push(marketClass);
								else
									this.marketClassMap.set(marketClass.marketId, [marketClass]);
							});

							this.productClassMap = new Map();
							productClassList.forEach(productClass => {
								if (this.productClassMap.has(productClass.classId))
									this.productClassMap.get(productClass.classId).push(productClass);
								else
									this.productClassMap.set(productClass.classId, [productClass]);
							});

							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}

					}
				})
			},
			setSelectRows(selectRows){
				this.selectRows =selectRows;
			}
		},
		mounted: function() {
			 this.loadMarketAndClassAndProduct();
			// this.doSearch();
			
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
