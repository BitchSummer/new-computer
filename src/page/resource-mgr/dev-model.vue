<template>
	<div>
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		
		<toolbar style="margin: 10px auto;">
			<span slot="right">
					<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增模型</el-button>
					<el-button icon="el-icon-edit" size="small" style="width: 80px;" v-show="!editModel" @click="editModel = true;">编辑</el-button>
					<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="modelForm==null"
						v-show="!editModel" @click="doDel">删除</el-button>
					<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
					<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="doBack">返回</el-button>
				</span>
		</toolbar>
		<el-card>
		<el-tabs v-model="activeName" class="model-info" @tab-click="doTabClick">
			<el-tab-pane label="模型概况" name="model-info">
				<model-info :form="modelForm" :editModel="editModel" :industryArr="industryArr" @setEditModel="setEditModel" ref="modelInfo"/>
			</el-tab-pane>
		 	<el-tab-pane label="台账属性" name="model-attr">
				<model-attr :config="modelForm" :editModel.sync="editModel" ref="modelAttr"/>
			</el-tab-pane>
			<el-tab-pane label="运行参数" name="model-param" >
				<model-param :config="modelForm" :editModel.sync="editModel"  ref="modelParam"/>
			</el-tab-pane>
			<el-tab-pane label="过滤规则" name="model-filter" >
				<model-filter :config="modelForm" :editModel.sync="editModel"  ref="modelFilter"/>
			</el-tab-pane>
			<el-tab-pane label="解析规则" name="model-resoluve" >
				<model-resoluve :config="modelForm" :editModel.sync="editModel"  ref="modelResoluve"/>
			</el-tab-pane>
		</el-tabs>
		</el-card>
	</div>
</template>
<script>
	import ModelInfo from '../../components/resource-mgr/dev-model/model-form.vue'
	import ModelAttr from '../../components/resource-mgr/dev-model/model-attr.vue'
	import ModelParam from '../../components/resource-mgr/dev-model/model-param.vue'
	import ModelFilter from '../../components/resource-mgr/dev-model/model-filter.vue'
	import ModelResoluve from '../../components/resource-mgr/dev-model/model-resoluve.vue'
	
	import {
		// syx
		findIndustry,
		findDevClass,
		findBrand,
		findSpec,
		findProductDate,
		findPlcBrand,
		findPlcSpec,
		findModel,

		dataDefineIndustryList,
		devModelList,
		deleteDevModel
	} from "../../api/resourcemgr-devmodel.js"
	//模拟数据
	export default {
		components: {
			ModelInfo,
			ModelAttr,
			ModelParam,
			ModelFilter,
			ModelResoluve
		},
		data(){
			return {
				
				editModel: false,
				activeName:'model-info',
				//筛选数据
				classifiedConfig: [{
					title: '行业领域:',
					options: []
				}, {
					title: '设备大类:',
					options: []
				}, {
					title: '设备品牌:',
					options: []
				}, {
					title: '设备型号:',
					options: []
				}, {
					title: '出厂年月:',
					options: []
				}, {
					title: '处理器品牌:',
					options: []
				}, {
					title: '处理器型号:',
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
				modelForm:{	
					industry:[],
					imgUrl:'',
				},
				industryArr:[],//行业数组
				industryMap:null,//行业-设备大类Map
				devClassMap:null,//设备大类-设备品牌Map
				brandMap:null,//设备品牌-设备型号Map
				specMap:null,//设备型号-出厂年月Map
				productDateMap:null,//出厂年月-处理器品牌Map
				plcBrandMap:null,//处理器品牌-处理器型号Map
				modelMap:null,//处理器品牌-处理器型号Map
			}
		},
		methods:{
			doAdd(){
				this.activeName ='model-info'
				this.modelForm = {
					industry:[],
					imgUrl:''
				}
				this.editModel = true;
			},
			doDel(){
				this.$confirm("您确认删除设备模型？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteDevModel({
							Vue: this,
							params: {
								id: this.modelForm.id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doSave(){
				if(this.activeName=='model-attr')
					this.$refs.modelAttr.doSave();
				else if(this.activeName=='model-param')
					this.$refs.modelParam.doSave();
				else if(this.activeName=='model-filter')
					this.$refs.modelFilter.doSave();
				else if(this.activeName=='model-resoluve')
					this.$refs.modelResoluve.doSave();
				else{
					this.$refs.modelInfo.doSave();
				}
			},
			doBack(){
				this.editModel = false;
				this.doSearch();
			},
			doTabClick(){
				console.log(this.activeName)
				if(this.modelForm.id==null&&this.activeName!='model-info'){
					setTimeout(()=>{
						this.activeName ='model-info'
						this.$message({
							message: '请先维护模型概况，再维护其他....',
							type: 'warning'
						});
					},0)
				}else{
					if(this.activeName=='model-attr')
						this.$refs.modelAttr.doSearch(this.modelForm.id);
					else if(this.activeName=='model-param')
						this.$refs.modelParam.doSearch(this.modelForm.id);
					else if(this.activeName=='model-filter')
						this.$refs.modelFilter.doSearch(this.modelForm.id);
					else if(this.activeName=='model-resoluve')
						this.$refs.modelResoluve.doSearch(this.modelForm.id);
				}
				
			},
			doSearch(current){
				findIndustry({params:{type:'industry'},Vue:this}).then(res=>{
					if(res.result){
						res.model.forEach(val=>{
							val.label=val.value
						})
						if(current){
							this.selectedItems[0].value=res.model[0].value
						}
						this.industryArr=res.model
						this.classifiedConfig[0].options=res.model
						this.doClickHandler(0,res.model[0],current)
					}
				})
			},
			//分类搜索 点击事件 ---无须改动
			doClickHandler(index, option,current=true){
				if(index==0){
					findDevClass({params:{industry:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.devClass
								val.value=val.devClass
							})
							this.classifiedConfig[1].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[1].value=res.model[0].value
								}else{
									this.selectedItems[1].value=''
								}
							}
							this.doClickHandler(1,this.selectedItems[1],current)
						}
					})
				}else if(index==1){
					findBrand({params:{devClass:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.brand
								val.value=val.brand
							})
							this.classifiedConfig[2].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[2].value=res.model[0].value
								}else{
									this.selectedItems[2].value=''
								}
							}
								// this.selectedItems[2].value=res.model[0].value
							this.doClickHandler(2,this.selectedItems[2],current)
						}
					})
				}else if(index==2){
					findSpec({params:{brand:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.spec
								val.value=val.spec
							})
							this.classifiedConfig[3].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[3].value=res.model[0].value
								}else{
									this.selectedItems[3].value=''
								}
							}
							this.doClickHandler(3,this.selectedItems[3],current)
						}
					})
				}else if(index==3){
					findProductDate({params:{spec:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.productDate
								val.value=val.productDate
							})
							this.classifiedConfig[4].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[4].value=res.model[0].value
								}else{
									this.selectedItems[4].value=''
								}
							}
							this.doClickHandler(4,this.selectedItems[4],current)
						}
					})
				}else if(index==4){
					findPlcBrand({params:{productDate:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.plcBrand
								val.value=val.plcBrand
							})
							this.classifiedConfig[5].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[5].value=res.model[0].value
								}else{
									this.selectedItems[5].value=''
								}
							}
							this.doClickHandler(5,this.selectedItems[5],current)
						}
					})
				}else if(index==5){
					findPlcSpec({params:{plcBrand:option.value},Vue:this}).then(res=>{
						if(res.result){
							res.model.forEach(val=>{
								val.label=val.plcSpec
								val.value=val.plcSpec
							})
							this.classifiedConfig[6].options=res.model
							if(current){
								if(res.model.length>0){
									this.selectedItems[6].value=res.model[0].value
								}else{
									this.selectedItems[6].value=''
								}
							}
							this.doClickHandler(6,this.selectedItems[6],current)
						}
					})
				}else{
					if(current)
						findModel({params:{plcSpec:option.value},Vue:this}).then(res=>{
							console.log(res,'res')
							if(res.result){
								// res.model.industry=res.model.industry.join(',')
								var form={...res.model}
								form.industry=form.industry.split(',')
								this.modelForm=form
							}
						})
				}
				// 
			},
			setEditModel(){
				this.editModel =false;
				var index=this.modelForm.industry.findIndex(val=>val==this.selectedItems[0].value)
				console.log(index)
				if(index>=0){
					this.selectedItems[1].value=this.modelForm.devClass
					this.selectedItems[2].value=this.modelForm.brand
					this.selectedItems[3].value=this.modelForm.spec
					this.selectedItems[4].value=this.modelForm.productDate
					this.selectedItems[5].value=this.modelForm.plcBrand
					this.selectedItems[6].value=this.modelForm.plcSpec
					this.doSearch(false)
				}
			}
		},
		mounted() {
			this.doSearch(true);
		}
	}
</script>
<style lang="less">
	
</style>
