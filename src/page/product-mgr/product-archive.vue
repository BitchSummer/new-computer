<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="right">
				<el-button size="small" type="primary" :disabled ="false" icon="el-icon-plus" @click="doAdd">新增产品</el-button>
				<el-button size="small" icon="el-icon-delete" :disabled ="batch" @click="doDetail">批量删除</el-button>
				<el-button size="small" icon="el-icon-setting" @click="doStop">批量启停</el-button>

			</span>
			<span slot="left">
				<el-radio-group v-model="queryParam.isAble" size="small" @change="enabled">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="已启用">只显示启用</el-radio-button>
					<el-radio-button label="已停用">只显示停用</el-radio-button>
				</el-radio-group>
			<el-input size="small" style="width: 180px;" placeholder="产品编码搜索...." v-model="queryParam.productCode"/>
			<el-input size="small" style="width: 180px;" placeholder="产品名称搜索...." v-model="queryParam.productName"/>

			<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
			<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
		</span>
		</toolbar>
		<product-list  :queryParam="queryParam"  :privateAttrs="privateAttrs" :configAttrs="configAttrs" :productConfig="productConfig"  @setSelectRows="setSelectRows"  ref="productList"/>
		<product-form
			ref="productForm"
			:config="productConfig" 
			:marketList="marketArr"
			:marketClassMap="marketClassMap" 
			:productClassMap="productClassMap"
			:privateAttrs.sync="privateAttrs"
			:configAttrs.sync="configAttrs"
			@callback="doSearch"
		/>
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList,
		modelPublicAttrList,
		modelAttrList,
		ListUnitGroup
	} from "../../api/productmgr-base.js"
	import {
		productPage,
		productResourceList,
		deleteProduct,
		ableOrDisableProduct
	} from "../../api/productmgr-productarchive.js"
	import ProductList from '../../components/product-mgr/product-archive/proudct-list.vue'
	import ProductForm from '../../components/product-mgr/product-archive/product-form.vue'
	export default {
		components: {
			ProductList,
			ProductForm
		},
		data() {
			return {
				batch:true,
				selectRows:[],
				selectRow:[],
				selectDel:{},
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
				marketArr:[],
				marketClassMap: new Map(),
				productClassMap: new Map(),
			}
		},
		watch:{
			'selectRows': {
				deep: true,
				handler(new_,old_){
					if(new_.length==0){
						this.batch=true;
					}else{
						let tag = false;
						for(let item of new_){
							if(item.isAble==="已启用"){
								tag= true;
								break;
							}
						}
						this.batch = tag
					}
				}
			}
		},
		methods: {
			enabled(){
				this.doSearch()
			},
			doStop(){
				let id = []
				this.selectRows.forEach(item=>{
					id.push(item.id)
				})
				ableOrDisableProduct({
					Vue:this,
					params:{
						id:id.join(',')
					}
				}).then(res=>{
					if(res.result){
						this.doSearch()
					}
				})
			},
			doDetail(){
				let id = []
				this.selectRows.forEach(item=>{
					id.push(item.id)
				})
				deleteProduct({
					Vue:this,
					params:{
						id:id.join(',')
					}
				}).then(res=>{
					if(res.result){
						this.doSearch()
					}
				})
			},
			setSelectRows(selectRows){
				this.selectRows =selectRows;
				this.selectRow = selectRows;
				this.selectRows.forEach(item=>{
					this.selectDel = item.isAble
				})
			},
			doAdd(){
				let productClass = this.productClassMap.get(this.selectedItems[1].value).filter(item=>item.id===this.selectedItems[2].value)[0];
				this.productConfig.form ={
					marketId :this.selectedItems[0].value,
					marketClassId:this.selectedItems[1].value,
					productClassId:this.selectedItems[2].value,
					publicAttrs:{
						resource: productClass.resource,
						deliver:productClass.deliver,
						unitGroupId:'',
					},
					privateAttrs:[],
					configAttrs:{},
					productResourceArrs:[],
				}
				setTimeout(()=>{
          			this.$refs['productForm'].init()
				},500)
				this.$refs['productForm'].empty()
        		this.productConfig.dialogVisible = true;
			},
			doSearch(){
				this.$refs.productList.doSearch();
			},
			doClickHandler(index, option) {

				if (index == 0) {
          this.queryParam.marketClassId = 0;
          this.queryParam.productClassId = 0;
          this.$refs.productList.clearTable();
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
          this.queryParam.marketId = option.value;
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
          this.queryParam.productClassId = 0;
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
          this.$refs.productList.clearTable();
          this.queryParam.marketClassId = option.value;
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
          this.queryParam.productClassId = option.value;
					let optionTemp =  { ...option
					}
					delete optionTemp.label;
					delete optionTemp.value;
					delete optionTemp.disabled;
					
					
					optionTemp.publicAttrs = this.publicAttrs;
					optionTemp.privateAttrs =[];
					optionTemp.configAttrs =[];

					this.loadModelPrivateAndConfigAttr(option.id);
					this.$refs.productList.doSearch();
				}

			},
			
			loadModelPrivateAndConfigAttr(productClassId){
				modelAttrList({
					Vue: this,
					params: {modelId:productClassId},
				}).then(res => {
					if (res.result) {
						this.privateAttrs=res.model.filter(item=>item.attrType==='产品特性');
						this.configAttrs=res.model.filter(item=>item.attrType==='规格配置');
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
			}
		},
		mounted: function() {
			this.loadModelPublicAttr();
			this.doSearch();
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
