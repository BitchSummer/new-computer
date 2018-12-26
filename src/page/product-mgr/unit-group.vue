<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增单位组</el-button>
				<el-button icon="el-icon-edit" size="small" style="width: 80px;" :disabled="unitGroupForm==null||unitGroupForm.isAble=='启用'"
				 v-show="!editModel" @click="editModel = true;">编辑</el-button>
				<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="unitGroupForm==null||unitGroupForm.isAble=='启用'"
				 v-show="!editModel" @click="doDelete">删除</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 80px;" :disabled="unitGroupForm==null" v-show="!editModel"
				 @click="doAbleOrDisable(unitGroupForm.isAble==null?'启/停用':unitGroupForm.isAble=='停用'?'启用':'停用')">
					{{unitGroupForm.isAble==null?'启/停用':unitGroupForm.isAble=='停用'?'启用':'停用'}}
				</el-button>
				<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
				<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="doBack">返回</el-button>
			</span>
		</toolbar>
		<el-row :gutter="8">
			<el-col :span="8">
				<el-card>
					<unit-group-form :form="unitGroupForm" :editModel="editModel" ref="unitForm"/>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-card>
					<unit-list :config="unitGroupForm" :editModel="editModel" :productClassId="productClassId"/>
				</el-card>
			</el-col>
		</el-row>
		
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList,
		saveOrUpdate,
	} from "../../api/productmgr-base.js"

	import {
		unitGroupList,
		saveOrUpdateUnitGroup,
		deleteUnitGroup,
		ableOrDisableUnitGroup
	} from "../../api/productmgr-unitgroup.js"

	import UnitGroupForm from '../../components/product-mgr/unit-group/form.vue'
	import UnitList from '../../components/product-mgr/unit-group/list.vue'
	
	export default {
		components: {
			UnitGroupForm,
			UnitList
		},
		data() {
			return {
				editModel: false,
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
				}, {
					title: '单位组:',
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
				}, {
					value: '',
					expanded: false
				}],
				emptyRow: {
					alias: '',
					groupId: 0,
					isStandard: '是',
					computeType: '固定值',
					computePrecision: 0,
					// computeFormula: '1'
				},
				productClassId:'',
				unitGroupForm: {}
			}
		},
		methods: {
			doAdd() {
				this.unitGroupForm = {
					unitList: [this.emptyRow]
				}
				this.unitGroupForm.unitList[0].alias=''
				this.editModel = true;
			},
			doDelete() {
				this.$confirm("您确认删除单位组？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteUnitGroup({
							Vue: this,
							params: {
								id: this.unitGroupForm.id
							}
						}).then(res => {
							if (res.result)
								this.loadUnitGroupList();
						})
					})
			},
			doAbleOrDisable(_op) {
				this.$confirm("您确认" + _op + "单位组？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						ableOrDisableUnitGroup({
							Vue: this,
							params: {
								id: this.unitGroupForm.id
							}
						}).then(res => {
							if (res.result)
								this.loadUnitGroupList();
						})
					})
			},
			doSave() {
				this.$refs["unitForm"].$refs['form'].validate(valid => {
        			if (valid) {
						if (this.unitGroupForm.unitList[0].alias == '') {
							this.$message.error('请输入单位名称...');
							return;
						} else {
							let unitArr = this.unitGroupForm.unitList;
							let hasStandard = false;
							let unitTempArr = []
							unitArr.forEach(unit => {
								if (unit.alias != null && unit.alias.length > 0)
									unitTempArr.push(unit);
								if (unit.isStandard == '是')
									hasStandard = true;
							})
		0
							if (unitTempArr.length == 0) {
								this.$message.error('请维护单位信息...');
								return;
							} else if (hasStandard == false) {
								this.$message.error('请设置一个基准单位...');
								return;
							} else {
								let form = { 
									...this.unitGroupForm,
									modelId:this.selectedItems[2].value
								}
								form.unitList = unitTempArr;
								saveOrUpdate({
									Vue: this,
									params: form
								}).then(res => {
									if (res.result){
										this.doBack();
									}
								})
							}
						}
					}else{
						this.$message({
							type: "error",
							message: "请输入单位组"
						});
						return;
					}
				})
			},
			doBack() {
				this.editModel = false;
				this.loadUnitGroupList();
			},
			doClickHandler(index, option) {
				this.unitGroupForm = {};
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);

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
					this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);
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
				} else if (index == 2) {
					this.unitGroupForm.productClassId = option.id;
					this.productClassId = option.id;
					this.loadUnitGroupList()
				} else {
					let optionTemp = { ...option
					}
					delete optionTemp.label;
					delete optionTemp.value;
					delete optionTemp.disabled;
					this.unitGroupForm = optionTemp;
				}

			},
			loadUnitGroupList() {
				this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);
				unitGroupList({
					Vue: this,
					params: {
						productClassId: this.selectedItems[2].value
					},
				}).then(res => {
					if (res.result) {

						let unitGroupArr = res.model;

						if (unitGroupArr != null && unitGroupArr.length > 0) {
							unitGroupArr.forEach(unitGroup => {
								unitGroup.label = unitGroup.alias
								unitGroup.value = unitGroup.id;
								if (unitGroup.isAble == '停用')
									unitGroup.disabled = true
								this.classifiedConfig[3].options.push(unitGroup);
							});
							//默认选中第一个
							this.selectedItems[3].value = this.classifiedConfig[3].options[0].value;
							this.doClickHandler(3, this.classifiedConfig[3].options[0])
						}

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
			this.loadMarketAndClassAndProduct();
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
