<template>

	<el-card class="model-attr">
		<h1>
			公有属性
		</h1>
		<div>
			<el-tag style="margin-bottom:10px" v-for="item in publicAttrs">{{item.alias}}</el-tag>
		</div>
		<h1>
			私有属性
		</h1>
		<div>
			<el-tag type="success" v-for="item in privateAttrs" v-show="item.deleted=='F'">{{item.alias}}</el-tag>
			<el-button size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doAttrMaintain">点击维护</el-button>
		</div>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure"></attr-maintain>
	</el-card>
</template>
<script>
	import {
		devModelAttrList,
		saveOrUpdatePrivateAttr,
		saveAttr
	} from "../../../api/resourcemgr-devmodel.js"

	export default {
		props: ['config', 'editModel'],
		data() {
			return {
				publicAttrs: [],
				privateAttrs: [],
				modelId: 0,
				maintainWinConfig: {
					title: '台账属性维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '600px', //弹窗宽
					tempList: [],
					emptyRow: {
						id: 0,
						type:'',
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
		methods: {
			loadPublicAtts(){
				devModelAttrList({
					Vue: this,
					params: {}
				}).then(res => {
					if (res.result) {
						console.log('publicAttr',res.model.publicAttr)
						this.publicAttrs = res.model.publicAttr;
					}
				})
			},
			doSearch(modelId) {
				if (modelId == this.modelId)
					return;
				else
					this.modelId = modelId;
				this.privateAttrs.splice(0, this.privateAttrs.length);
				if (modelId != null && modelId > 0) {
					devModelAttrList({
						Vue: this,
						params: {
							modelId: modelId
						},
					}).then(res => {
						if (res.result) {
							console.log(res.model.privateAttr)
							this.privateAttrs = res.model.privateAttr;
						}
					})
				}
			},
			doAttrMaintain() {
				if (this.privateAttrs == null) {
					this.maintainWinConfig.tempList = [];
				} else {
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.privateAttrs))
				}
				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow
				})
				this.maintainWinConfig.dialogVisible = true
			},
			doAttrSure(tempArr) {
				console.log('tempArr',tempArr)
				this.privateAttrs.splice(0,	this.privateAttrs.length);
				tempArr.forEach(item=>{
					if(item.modelId==null||item.modelId==0)
						item.modelId  = this.modelId
				})
				this.doSave(tempArr)
			},
			doSave(tempArr){
				saveOrUpdatePrivateAttr({
					Vue: this,
					params: tempArr
				}).then(res => {
					if (res.result) {
						this.$message,success('保存成功')
						tempArr.forEach(item=>{this.privateAttrs.push(item)})
						this.$emit('update:editModel', false);
					}
				})
			}
		},
		mounted() {
			this.loadPublicAtts();
		}
	}
</script>
<style lang="less">
	.model-attr {
		.el-tag {
			margin-right: 15px;
			padding: 0 20px;
		}
	}
</style>
