<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
			<div style="margin: 5px 15px;">
			
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
				</toolbar>
				<el-card>
					<publish-list :config="detailListConfig" />
				</el-card>
			</div>

		</toast>
	</div>
</template>

<script>
	import {
		queryProduct,
		queryProductDetail
	} from "../../../api/productmgr-base.js"

	import {
		addPublishRecord
	} from "../../../api/productmgr-productpublish.js"
	import PublishList from './add-publish-list.vue'
	export default {
		components: {
			PublishList
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
				productDetailArr: []
			}
		},
		methods: {
			addProductDetail() {
				this.productDetailArr.forEach(productDetail => {
					if (this.addProductParam.productDetailIdArr.indexOf(productDetail.id) > -1) {
						let temp = { ...productDetail
						}
						temp.productDetailId = temp.id;
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
				let param ={}
				param.detailList = this.detailListConfig.tableData
				if(param.detailList.length==0){
					  this.$message({
						  message: '请添加发布产品...',
						  type: 'warning'
						});
						return;
				}else{
					addPublishRecord({
						Vue: this,
						params: param
					}).then(res => {
						if (res.result) {
							this.config.dialogVisible = false;
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="less">

</style>
