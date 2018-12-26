<template>
	<toast :config="config" @cancel="config.dialogVisible=false" @showWin="showWin" @doSave="doSave">
		<div style="margin: 5px 10px;">
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" ref="searchData" />
			<el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="formulaConfig.computeFormulaStr" />
		</div>
		<el-tag v-for="tag in formulaConfig.attrs" :key="tag.value" closable @close="delAttr(tag)" :type="tag.label">
			{{tag.label}}
		</el-tag>
	</toast>
</template>

<script>
	import {
		modelAttrList
	} from '../../../api/productmgr-base.js'
	export default {
		props: ['config'],
		data() {
			return {
				//筛选数据
				classifiedConfig: [{
					title: '产品属性:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				formulaConfig: {
					computeFormulaStr: '',
					attrIds: [],
					attrs: [],
					computeFormula:{}
				}
			}

		},
		methods: {
			doClickHandler(index, option) {
				this.formulaConfig.computeFormulaStr = this.formulaConfig.computeFormulaStr + option.label;
				if (this.formulaConfig.attrIds.indexOf(option.value) == -1) {
					this.formulaConfig.attrs.push(option)
					this.formulaConfig.attrIds.push(option.value);
				}
			},
			doSave() {
				this.formulaConfig.computeFormula = this.formulaConfig.computeFormulaStr;
				this.formulaConfig.attrs.forEach(attr => {
					let label = attr.label.replace(/\(/g, "\\(")
					label = label.replace(/\)/g, "\\)")
					this.formulaConfig.computeFormula  = this.formulaConfig.computeFormula.replace(new RegExp(label, "gm"),'#'+ attr.id+'#')
				});
				this.$emit('callBack',this.config.index, this.formulaConfig);
				this.config.dialogVisible = false;

			},
			delAttr(attr) {

				let label = attr.label.replace(/\(/g, "\\(")
				label = label.replace(/\)/g, "\\)")
				let temStr = this.formulaConfig.computeFormulaStr;
				temStr = temStr.replace(new RegExp(label, "gm"), "")
				this.formulaConfig.computeFormulaStr = temStr

				let index_ = this.formulaConfig.attrIds.indexOf(attr.value)
				this.formulaConfig.attrs.splice(index_, 1);
				this.formulaConfig.attrIds.splice(index_, 1);

			},
			showWin() {
				modelAttrList({
					Vue: this,
					params: {
						modelId: this.config.productClassId
					}
				}).then(res => {
					if (res.result)
						this.formulaConfig.computeFormulaStr = this.config.row.computeFormulaStr==null?'':this.config.row.computeFormulaStr;
						if(this.config.row.attrIds==null||this.config.row.attrIds=='')
							this.formulaConfig.attrIds = [];
						else
							this.formulaConfig.attrIds = this.config.row.attrIds.split(',');
						this.formulaConfig.attrs=[];
					this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
					for (let attr of res.model) {
						attr.label = attr.alias
						attr.value = attr.id
						if(this.formulaConfig.attrIds.indexOf(attr.id+'')>-1)
							this.formulaConfig.attrs.push(attr);
						this.classifiedConfig[0].options.push(attr);
					}
				})
			}
		}
	}
</script>
<style scoped="scoped">
	.el-tag {
		margin-left: 10px;
	}
</style>
