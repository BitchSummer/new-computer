<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="right">
				<el-button size="small" type="primary" :disabled ="selectRows.length==0" icon="el-icon-plus" @click="doOffShelf">产品下架</el-button>
			</span>
			<span slot="left">
				<el-radio-group v-model="showModel" size="small">
					<el-radio-button label="list">列表模式</el-radio-button>
					<el-radio-button label="image">图形模型</el-radio-button>
				</el-radio-group>
				<el-radio-group v-model="queryParam.status" size="small">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="已发布">只显示已发布</el-radio-button>
					<el-radio-button label="已下架">只显示已下架</el-radio-button>
				</el-radio-group>
			<el-input size="small" style="width: 180px;" placeholder="产品编码搜索...." v-model="queryParam.providerName"/>
			<el-input size="small" style="width: 180px;" placeholder="产品名称搜索...." v-model="queryParam.providerName"/>

			<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
			<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
		</span>
		</toolbar>
		<el-card>
			<published-list :queryParam="queryParam" @setSelectRows="setSelectRows" ref="publishedList" />

		</el-card>
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList
	} from "../../../api/productmgr-base.js"
	import {
		offShelfDetail
	} from "../../../api/productmgr-productpublish.js"
	import PublishedList from './published-list.vue'

	export default {
		components: {
			PublishedList
// 			PriceRecordFormWin
		},
		data() {
			return {
				showModel: 'list',
				selectRows:[],
				queryParam:{
					status:'发布成功'
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
				marketArr:[],
				marketClassMap: new Map(),
				productClassMap: new Map(),
			}
		},
		methods: {
			doOffShelf(){
				this.$confirm("您确认下架选择商品？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let ids =[]
						this.selectRows.forEach(item=>{
							ids.push(item.id)
						})
						offShelfDetail({
							Vue: this,
							params: {
								ids: ids.join(',')
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doSearch(){
				this.$refs.publishedList.doSearch();
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
							if (productClass.isAble == '已停用')
								productClass.disabled = true
							this.classifiedConfig[2].options.push(productClass);

						});
						this.selectedItems[2].value = this.classifiedConfig[2].options[0].value;
						this.doClickHandler(2, this.classifiedConfig[2].options[0])
					}
				} else {
					this.queryParam.marketId = option.marketId;
					this.queryParam.marketClassId = option.classId;
					this.queryParam.productClassId = option.id;
					this.doSearch();
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
								if (market.isAble == '已停用')
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
			setSelectRows(selectRows) {
				this.selectRows = selectRows;
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
