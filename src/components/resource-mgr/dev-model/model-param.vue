<template>
	
	<el-card class="model-attr">
	  <h1>
		  公有参数
	  </h1>
	  <div>
		  <el-tag v-for="item in publicParams">{{item.alias}}</el-tag>
	  </div>
	  <h1>
			私有参数
	  </h1>
	  <div>
	  	<el-tag type="success" v-for="item in privateParams" v-show="item.deleted=='F'">{{item.alias}}</el-tag>
			<el-button size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doAttrMaintain">点击维护</el-button>
	  </div>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure"></attr-maintain>
	</el-card>
</template>
<script>
	import { 
		devModelPublicParamList,
		devModelParamList,
		saveOrUpdatePrivateParam
		} from "../../../api/resourcemgr-devmodel.js"
	export default {
		props: ['config','editModel'],
		data(){
			return {
				publicParams:[],
				privateParams:[],
				maintainWinConfig: {
					title: '运行参数维护', //弹窗标题
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
				}
			}
		},
		methods:{
			loadPublicParams(){
				devModelParamList({
					Vue: this,
					params: {}
				}).then(res => {
					if (res.result) {
						this.publicParams = res.model.publicParam;
					}
				})
			},
			doSearch(modelId){
				if(modelId==this.modelId)
					return;
				else
					this.modelId = modelId;
				this.privateParams.splice(0,this.privateParams.length);
				 if(modelId!=null&&modelId>0){
					 devModelParamList({
						 Vue:this,
						 params:{
							 modelId:modelId
							},
					 }).then(res=>{
						 console.log(res,'///')
					 	if(res.result){
					 		this.privateParams = res.model.privateParam;
					 	}
					 })
				 }
			},
			doAttrMaintain() {
				if (this.privateParams == null) {
					this.maintainWinConfig.tempList = [];
				} else {
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.privateParams))
				}
				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow
				})
				this.maintainWinConfig.dialogVisible = true
			},
			doAttrSure(tempArr) {
			console.log('tempArr',tempArr)
				this.privateParams.splice(0,this.privateParams.length);
				tempArr.forEach(item=>{
					if(item.modelId==null||item.modelId==0)
						item.modelId  = this.modelId
				})
				this.doSave(tempArr)
			},
			doSave(tempArr){
						alert(1)
				saveOrUpdatePrivateParam({
					Vue: this,
					params: tempArr
				}).then(res => {
					if (res.result) {
						this.$message,success('保存成功')
						tempArr.forEach(item=>{this.privateParams.push(item)})
						this.$emit('update:editModel', false);
					}
				})
			}
		},
		mounted() {
			this.loadPublicParams();
		}
	}
</script>
<style lang="less">
	.model-attr{
		.el-tag{
			margin-right: 15px;
			padding: 0 20px;
		}
	}
</style>
