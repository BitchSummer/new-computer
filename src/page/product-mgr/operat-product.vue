<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		
		<product-class-form :form="productClassForm"  style="margin-top: 10px;"/>
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList,
		modelPublicAttrList,
		modelAttrList
	} from "../../api/productmgr-base.js"
	import ProductClassForm from '../../components/product-mgr/operat-product/form.vue'
	export default {
		components: {
			ProductClassForm
		},
		data() {
			return {
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
				productClassForm: {
					publicAttrs:[],
					privateAttrs:[],
					configAttrs:[]
				},
				marketClassMap: null,
				productClassMap: null,
			}
		},
		methods: {
			
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
					let optionTemp =  { ...option
					}
					delete optionTemp.label;
					delete optionTemp.value;
					delete optionTemp.disabled;
					
					optionTemp.publicAttrs = this.publicAttrs;
					optionTemp.privateAttrs =[];
					optionTemp.configAttrs =[];

					this.productClassForm =optionTemp;
					this.loadModelPrivateAndConfigAttr();
				}

			},
			
			loadModelPrivateAndConfigAttr(){
				modelAttrList({
					Vue: this,
					params: {modelId:this.productClassForm.id},
				}).then(res => {
					if (res.result) {
						this.productClassForm.privateAttrs=res.model.filter(item=>item.attrType==='产品特性');
						this.productClassForm.configAttrs=res.model.filter(item=>item.attrType==='规格配置');
					}
				})
			},
			loadModelPublicAttr(){
				modelPublicAttrList({
					Vue: this,
					params: {},
				}).then(res => {
					if (res.result) {
						this.publicAttrs = res.model;
						this.loadMarketAndClassAndProduct();
					}
				})
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
			}
		},
		mounted: function() {
			this.loadModelPublicAttr();
			
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
