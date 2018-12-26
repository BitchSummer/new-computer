<template>
	<div class="product-define">
		<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
			<span style="display:none">{{config}}</span>
			<el-form ref="form" :model="config.form" :rules="rules" label-width="90px" label-position="right" style="margin: 10px;">
				<el-row>
					<h1>产品档案</h1>
					<el-col :span="8">
						<el-form-item label="市场名称:" prop="marketId">
							<el-select v-model="config.form.marketId" placeholder="请选择" size="mini" @change="marketChange">
								<el-option :label="item.alias" :value="item.id" v-for="item in marketList" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="市场分类:" prop="marketClassId">
							<el-select v-model="config.form.marketClassId" placeholder="请选择市场分类" @change="marketClassChange" size="mini">
								<el-option :label="item.alias" :value="item.id" v-for="item in marketClassMap.get(config.form.marketId)" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品大类:" prop="productClassId">
							<el-select v-model="config.form.productClassId" placeholder="请选择产品结构" @change="productClassChange" size="mini">
								<el-option :label="item.alias" :value="item.id" v-for="item in productClassMap.get(config.form.marketClassId)"
								 :key="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="关联资源:">
							<el-input size="mini" disabled v-model="config.form.publicAttrs.resource"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="交付方式:">
							<el-input size="mini" disabled v-model="config.form.publicAttrs.deliver"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品编码:" prop="productCode">
							<el-input size="mini" v-model="config.form.publicAttrs.productCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品名称:" prop="productName">
							<el-input size="mini" v-model="config.form.publicAttrs.productName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单位组:" prop="unitGroupId">
							<!--<el-input size="mini" v-model="config.form.publicAttrs.unitGroupId"></el-input>-->
							<el-select v-model="config.form.publicAttrs.unitGroupId" placeholder="请选择单位组..."  size="mini">
								<el-option :label="item.label" :value="item.value" v-for="item in listunitgroup"
										:key="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-for="(privateAttr,index) in privateAttrs">
						<el-form-item :label="privateAttr.alias">
							<el-input size="mini" v-model="config.form.privateAttrs[privateAttr.id]"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-for="(configAttr,index) in configAttrs">
						<el-form-item :label="configAttr.alias">
							<el-tag class="maintain" v-for="(tag,index) in config.form.configAttrs[configAttr.id]" :key="tag"
							 :disable-transitions="false">
								{{tag}}
							</el-tag>
							<el-button @click="doAttrMaintain(configAttr.id,config.form.configAttrs[configAttr.id])" class="button-new-tag"
							 type="danger" size="small">+ 点击维护</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="config.form.publicAttrs.resource!=null&&config.form.publicAttrs.resource!='无'">
					<h1>资源配置</h1>
					<el-col :span="24" >
						<el-form-item :label="config.form.publicAttrs.resource">
							<el-tag class="maintain" v-for="(resource,index) in config.form.resourceList" :key="resource.resourceName"
							:disable-transitions="false">
								{{resource.resourceName}}
							</el-tag>
							<el-button @click="doResourceMaintain(config.form.id,config.form.publicAttrs.resource)" class="button-new-tag"
							type="danger" size="small">+ 点击维护</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</toast>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure" />
		<resource-maintain-win ref="resourceMaintainWin" @doSave="doResourceSure"/>
	</div>
</template>
<script>
	import {
		modelAttrList,
    	ListUnitGroup
	} from "../../../api/productmgr-base.js"
	import {
		saveOrUpdateProduct
	} from "../../../api/productmgr-productarchive.js"
	import ResourceMaintainWin from './resource-maintain.vue'
	export default {
		props: ['config', 'marketList', //所有市场列表
			'marketClassMap',
			'productClassMap',
			'privateAttrs',
			'configAttrs',
		],
		components: {
			ResourceMaintainWin
		},
		data() {
			return {
				rules: {
					marketId: [{
						required: true,
						message: '请选择市场',
						trigger: 'change'
					}],
					marketClassId: [{
						required: true,
						message: '请选择市场分类',
						trigger: 'change'
					}],
					productClassId: [{
						required: true,
						message: '请选择产品大类',
						trigger: 'change'
					}],
					productCode: [{
						required: true,
						message: '请输入产品编码',
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!this.config.form.publicAttrs.productCode || this.config.form.publicAttrs.productCode.trim() === '') {
								callback(new Error(rule.message));
							} else {
								callback();
							}
						}
					}],
					productName: [{
						required: true,
						message: '请输入产品名称',
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!this.config.form.publicAttrs.productName || this.config.form.publicAttrs.productName.trim() === '') {
								callback(new Error(rule.message));
							} else {
								callback();
							}
						}
					}],
					unitGroupId:[{
						required: true,
						message: '请选择单位组',
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!this.config.form.publicAttrs.unitGroupId || this.config.form.publicAttrs.unitGroupId === 0) {
								callback(new Error(rule.message));
							} else {
								callback();
							}
						}
					}]
				},
				maintainWinConfig: {
					title: '产品规格配置', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '600px', //弹窗宽
					tempList: [],
					emptyRow: {
						id: 0,
						alias: '',
						deleted: 'F'
					},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						name: '确定', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				configAttrId: 0,
        		listunitgroup:[]
			}
		},
		methods: {
			empty(){
				if(this.$refs['form']!=undefined){
					this.$refs['form'].resetFields()
				}
			},
		  	init(){
				ListUnitGroup({
					Vue:this,
					params:{
						modelId:this.config.form.productClassId
					}
				}).then(res=>{
				if(res.result){
					this.listunitgroup=[]
					res.model.forEach(item=>{
						this.listunitgroup.push({
							label:item.alias,
							value:item.id
						})
					})
				}
				})
			},
			doSave() {
				let params = JSON.parse(JSON.stringify(this.config.form))
				params.resources = this.config.form.publicAttrs.resource
				params.deliver = this.config.form.publicAttrs.deliver
				params.productCode = this.config.form.publicAttrs.productCode
				params.productName = this.config.form.publicAttrs.productName
				params.unitGroupId = this.config.form.publicAttrs.unitGroupId
				delete params.productResourceArrs
				params.publicAttrs = JSON.stringify(params.publicAttrs)
				params.privateAttrs = JSON.stringify(params.privateAttrs)
				params.configAttrs = JSON.stringify(params.configAttrs)
				this.$refs['form'].validate((valid) => {
					if(valid) {
						saveOrUpdateProduct({
							Vue: this,
							params:params,
						}).then(res => {
							if (res.result) {
								this.config.dialogVisible = false;
								this.$emit("callback")
							}
						})
					}
				});
			},
			doResourceMaintain(productId,resourceType){
				let tempList =[];
				if(this.config.form.resourceList!=null&&this.config.form.resourceList.length>0)
					tempList =JSON.parse(JSON.stringify(this.config.form.resourceList))
				this.$refs.resourceMaintainWin.show({
					productId:productId,
					resourceType:resourceType,
					tempList : tempList
				})
			},
			doResourceSure(tempArr){
				this.$set(this.config.form, 'resourceList', tempArr)
			},
			doAttrMaintain(configAttrId, configAttr) {
				this.configAttrId = configAttrId;
				if (configAttr == null) {
					this.maintainWinConfig.tempList = [];
				} else {
					let tempArr = [];
					configAttr.forEach(attr => {
						tempArr.push({
							alias: attr
						})
					})
					this.maintainWinConfig.tempList = tempArr
				}

				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow
				})
				this.maintainWinConfig.dialogVisible = true
			},
			doAttrSure(tempArr) {
				let temp = []
				tempArr.forEach(item => {
					temp.push(item.alias)
				})
				this.$set(this.config.form.configAttrs, this.configAttrId, temp)
			},
			loadModelPrivateAndConfigAttr(productClassId) {
				modelAttrList({
					Vue: this,
					params: {
						modelId: productClassId
					},
				}).then(res => {
					if (res.result) {
						this.$emit('update:privateAttrs', res.model.filter(item => item.attrType === '产品特性'))
						this.$emit('update:configAttrs', res.model.filter(item => item.attrType === '规格配置'))
					}
				})
			},
			marketChange() {
				this.config.form.marketClassId = '';
				this.marketClassChange();
			},
			marketClassChange() {
				this.config.form.productClassId = '';
				this.config.form.publicAttrs.resource = '';
				this.config.form.publicAttrs.deliver = '';
				this.privateAttrs.splice(0,this.privateAttrs.length)
				this.configAttrs.splice(0,this.configAttrs.length)
				
				this.config.form.configAttrs = {}
				this.config.form.privateAttrs = {}
			},
			productClassChange() {
				setTimeout(()=>{
					this.config.form.publicAttrs.unitGroupId = ''
				},100)
		    
				this.init()
				let productClass = this.productClassMap.get(this.config.form.marketClassId).filter(item => item.id === this.config.form
					.productClassId)[0];
				this.$set(this.config.form.publicAttrs,'resource',productClass.resource);
				this.$set(this.config.form.publicAttrs,'deliver',productClass.deliver);
				this.config.form.productResourceArrs.splice(0,this.config.form.productResourceArrs.length);
				// console.log(this.config.form,'********')
				this.loadModelPrivateAndConfigAttr(productClass.id)

			}
		}
	}
</script>
<style lang="less">
	.product-define {
		h1 {
			line-height: 40px;
		}

		.el-tag {
			margin-right: 10px;
			margin-bottom: 10px;
			padding: 0 20px;
		}
	}
</style>
