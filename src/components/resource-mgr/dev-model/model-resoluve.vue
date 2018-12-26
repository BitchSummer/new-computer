<template>
	<div class="model-filter">
		<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%">
			<el-table-column type="#" width="55" />
			<el-table-column resizable show-overflow-tooltip property="paramName" align="center" label="参数名" width="120" />
			<el-table-column resizable show-overflow-tooltip property="dataType" align="center" label="数据类型" width="120">
				<template slot-scope="scope">
					<el-select size="small" :disabled="editModel==false" v-model="scope.row.dataType" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="dataPrecision" align="center" label="数据精度" width="120">
				<template slot-scope="scope">
					<el-input :disabled="editModel==false" v-model="scope.row.dataPrecision" size="small"></el-input>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="startCode" align="center" label="起始标识" width="120">
				<template slot-scope="scope">
					<el-input :disabled="editModel==false" v-model="scope.row.startCode" size="small"></el-input>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="byteLen" align="center" label="字节长度" width="120">
				<template slot-scope="scope">
					<el-input :disabled="editModel==false" v-model="scope.row.byteLen" size="small"></el-input>
				</template>
			</el-table-column>
			<el-table-column resizable show-overflow-tooltip property="parseRule" align="center" label="解析规则" />

			<el-table-column resizable show-overflow-tooltip property="computeFormulaStr" align="center" label="计算规则" />

			<el-table-column resizable show-overflow-tooltip property="translateRule" align="center" label="转义选项" />
			<el-table-column resizable align="center" label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="mini" type="text" :disabled="editModel==false" @click="doParseConfig(scope.$index,scope.row)">解析配置</el-button>
					<el-button size="mini" type="text" :disabled="editModel==false" @click="doComputeConfig(scope.$index,scope.row)">计算配置</el-button>
					<el-button size="mini" type="text" :disabled="editModel==false" @click="doTrandslateConfig(scope.$index,scope.row)">转义配置</el-button>
				</template>
			</el-table-column>
		</el-table>
		<parse-config-win :config="parseConfig" @setParseConfig="setParseConfig" />
		<trandslate-config-win :config="trandslateConfig" @doSave="setTrandslateConfig" />
		<formula-config-win :config="formulaConfig" @callBack="setComputeConfig" />
	</div>
</template>
<script>
	import {
		devModelResolutionList,
		saveOrUpdateResolution
	} from "../../../api/resourcemgr-devmodel.js"
	import ParseConfigWin from './parse-config-win.vue'
	import TrandslateConfigWin from './trandslate-config-win.vue'
	import FormulaConfigWin from './formula-config-win.vue'
	export default {
		props: ['config', 'editModel'],
		data() {
			return {
				options: [{
					label: '文本',
					value: 'S'
				}, {
					label: '整数',
					value: 'N'
				}, {
					label: '浮点数',
					value: 'F'
				}, {
					label: '布尔值',
					value: 'C'
				}],
				tableData: [],
				parseConfig: {
					title: "解析规则维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "500px", //弹窗宽
					index:0,
					value: [],
					btnData: [{
						isShow: true,
						name: "取消",
						bgColor: "dialog-normal",
						method: "cancel"
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				trandslateConfig: {
					title: "转义规则维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "500px", //弹窗宽
					index:0,
					emptyRow:{
						key:'',
						value:''
					},
					tempList:[],
					btnData: [{
						isShow: true,
						name: "取消",
						bgColor: "dialog-normal",
						method: "cancel"
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				},
				formulaConfig:{
					title: '计算规则维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '1000px', //弹窗宽
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
				}
			}
		},
		methods: {
			doParseConfig(index, row) {
				this.parseConfig.index = index;
				if(row.parseRule==null||row.parseRule=='')
					this.parseConfig.value =[]
				else
					this.parseConfig.value = row.parseRule.split(',')
				this.parseConfig.dialogVisible = true;
			},
			setParseConfig(index, value) {
				this.$set(this.tableData[index],'parseRule',value)
				this.parseConfig.dialogVisible = false;
			},
			doComputeConfig(index, row) {
				this.formulaConfig.row = row ;
				this.formulaConfig.index = index ;
				this.formulaConfig.modelId = this.modelId;
				this.formulaConfig.dialogVisible=true;
			},
			setComputeConfig(index, formulaConfig){
				this.$set(this.tableData[index],'computeFormulaStr',formulaConfig.computeFormulaStr)
				this.$set(this.tableData[index],'attrIds',formulaConfig.attrIds.join(','))
				this.$set(this.tableData[index],'computeFormula',formulaConfig.computeFormula)
			},
			doTrandslateConfig(index, row) {
				this.trandslateConfig.index = index;
				this.trandslateConfig.tempList =[]
				if(row.translateRule!=null&&row.translateRule!=''){
					let tempJson =JSON.parse(row.translateRule);
					for(let temKey in tempJson){
						let temp= {
							key:temKey,
							value:tempJson[temKey]
						}
						this.trandslateConfig.tempList.push(temp);
					}
				}
				this.trandslateConfig.tempList.push({...this.trandslateConfig.emptyRow});
				this.trandslateConfig.dialogVisible = true;
			},
			setTrandslateConfig(index, tempList) {
				if(tempList.length==0)
					this.$set(this.tableData[index],'translateRule','');
				else{
					let temJson ={};
					tempList.forEach(item=>{
						temJson[item.key] = item.value
					})
					this.$set(this.tableData[index],'translateRule',JSON.stringify(temJson))
				}
			
				this.trandslateConfig.dialogVisible = false;
			},
			doSave() {
				var data=JSON.parse(JSON.stringify(this.tableData))
				data.forEach(val=>{
					delete val.modifyTime
					delete val.createTime
					delete val.paramName
				})
				saveOrUpdateResolution({
					Vue: this,
					params: data
				}).then(res => {
					if (res.result) {
						this.$message.success('保存成功')
						this.$emit('update:editModel', false);
					}
				})
			},
			doSearch(modelId) {
				if (modelId == this.modelId)
					return;
				else
					this.modelId = modelId;
				this.tableData.splice(0, this.tableData.length);
				if (modelId != null && modelId > 0) {
					devModelResolutionList({
						Vue: this,
						params: {
							modelId: modelId
						},
					}).then(res => {
						if (res.result) {
							this.tableData = res.model;
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
				this.privateAttrs.splice(0,	this.privateAttrs.length);
				tempArr.forEach(item=>{
					if(item.modelId==null||item.modelId==0)
						item.modelId  = this.modelId
					this.privateAttrs.push(item)
				})
			}
		},
		components: {
			ParseConfigWin,
			TrandslateConfigWin,
			FormulaConfigWin
		}
	}
</script>
<style lang="less">
	.model-filter {
		width: 98%;
		padding: 0 auto;
	}
</style>
