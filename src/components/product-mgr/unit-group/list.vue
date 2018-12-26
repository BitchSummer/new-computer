<template>
	<div>
	<el-table height="600" border stripe ref="table" :data="config.unitList" style="width: 100%">
		<el-table-column type="index" width="55" />
		<el-table-column resizable show-overflow-tooltip property="isStandard" align="center" label="基准单位" width="100">
			<template slot-scope="scope">
				<el-tag size="medium" :type="scope.row.isStandard=='是'?'success':'danger'">{{ scope.row.isStandard }}</el-tag>
			</template>
		</el-table-column>
		<el-table-column resizable show-overflow-tooltip property="alias" align="center" label="单位" width="100">
			<template slot-scope="scope">
				<el-input :disabled="editModel==false" v-model="scope.row.alias" size="small"></el-input>
			</template>
		</el-table-column>
		<el-table-column resizable show-overflow-tooltip property="computeType" align="center" label="计算方式" width="150">
			<template slot-scope="scope">
				<el-select size="small" :disabled="editModel==false||scope.row.isStandard=='是'" v-model="scope.row.computeType" placeholder="请选择">
				<el-option
				  v-for="item in options"
				  :key="item.value"
				  :label="item.value"
				  :value="item.value">
				</el-option>
			  </el-select>
			</template>
		</el-table-column>
		<el-table-column resizable show-overflow-tooltip property="computePrecision" align="center" label="计算精度" width="100">
			<template slot-scope="scope">
				<el-input-number :disabled="editModel==false||scope.row.isStandard=='是'" v-model="scope.row.computePrecision"
				 size="small" class="Num" :min="0" :max="10" :precision="0"></el-input-number>
			</template>
		</el-table-column>
		<el-table-column resizable show-overflow-tooltip property="computeFormulaStr" align="center" label="计算公式">
			<template slot-scope="scope">
				<el-input :disabled="editModel==false||scope.row.isStandard=='是'||scope.row.computeType=='公式计算'" v-model="scope.row.computeFormulaStr"
				 size="small"></el-input>
			</template>
		</el-table-column>	
		<el-table-column label="操作" align="center" width="250">
			<template slot-scope="scope">
				<el-button size="mini" type="text" :disabled="editModel==false" @click="addRow(scope.$index)">新增行</el-button>
				<el-button size="mini" type="text" :disabled="editModel==false" @click="delRow(scope.$index)">删除行</el-button>
				<el-button size="mini" type="text" :disabled="editModel==false" @click="setStandard(scope.$index)">设置基准</el-button>
				<el-button size="mini" type="text" :disabled="editModel==false||(editModel==true&&scope.row.isStandard=='是')||scope.row.computeType=='固定值'" @click="computeConfig(scope.row,scope.$index)">公式配置</el-button>
			</template>
		</el-table-column>
	</el-table>
	<formula-config-win :config="formulaConfig" @callBack="formulaHandler" />
	</div>
</template>
<script>
	import FormulaConfigWin from './formula-config-win.vue'
	export default {
		components: {
			FormulaConfigWin
		},
		props: ['config', 'editModel','productClassId'],
		data() {
			return {
				options:[{
					value:'固定值'
				},{
					value:'公式计算'
				}],
				emptyRow: {
					alias: '',
					groupId: 0,
					isStandard: '否',
					computeType: '固定值',
					computePrecision: 0,
					// computeConfig: '1'
				},
				formulaConfig:{
					title: '公式维护', //弹窗标题
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
		methods:{
			/**
			* 新增行
			*/
			addRow(index_){
				this.config.unitList.splice(index_+1,0,{...this.emptyRow})
			},
			/**
			* 删除行
			*/
			delRow(_index){
				this.config.unitList.splice(_index,1)
			},
			setStandard(_index){
				this.config.unitList.forEach((unit,_index)=>{
					if(unit.isStandard=='是')
							unit.isStandard='否'
				})
				this.config.unitList[_index].isStandard='是'
				this.config.unitList[_index].computeType='固定值'
				this.config.unitList[_index].computePrecision=0
				this.config.unitList[_index].computeConfig=1
			},
			computeConfig(row_,index_){
				this.formulaConfig.row = row_ ;
				this.formulaConfig.index = index_ ;
				this.formulaConfig.productClassId = this.productClassId;
				this.formulaConfig.dialogVisible=true;
			},
			formulaHandler(index, formulaConfig){
				this.$set(this.config.unitList[index],'computeFormulaStr',formulaConfig.computeFormulaStr)
				this.$set(this.config.unitList[index],'attrIds',formulaConfig.attrIds.join(','))
				this.$set(this.config.unitList[index],'computeFormula',formulaConfig.computeFormula)
			}
		}
	}
</script>
<style lang="less">
.el-tooltip{
	width: 106px;
	.Num{
		width: 87px;
	}
	.el-input-number .el-input__inner{
		text-align: center;
		padding: 0;
	}
}
.el-input-number__decrease{
	display: none;
}
.el-input-number__increase{
	display: none;
}
</style>
