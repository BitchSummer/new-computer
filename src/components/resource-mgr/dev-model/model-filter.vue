<template>
	<div class="model-filter">
		<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%"  >
			<el-table-column type="#" width="55"/>
			<el-table-column resizable align="center" label="关键字"  >
					<template slot-scope="scope">
						<el-input :disabled="editModel==false" v-model="scope.row.filterKey"
						size="small"></el-input>
					</template>
				</el-table-column>
			<el-table-column resizable  align="center" label="操作" width="200" >
					<template slot-scope="scope">
						<el-button size="mini" type="text" :disabled="editModel==false" @click="addRow(scope.$index)">新增行</el-button>
						<el-button size="mini" type="text" :disabled="editModel==false" @click="delRow(scope.$index)">删除行</el-button>
					</template>
				</el-table-column>
				
		</el-table>
	</div>
</template>
<script>
	import { 
		devModelFilterList,
		saveOrUpdateFilter
	} from "../../../api/resourcemgr-devmodel.js"
	export default {
		props: ['config','editModel'],
		data(){
			return {
				tableData:[],
				emptyRow: {
					filterKey: '',
					deleted:'F'
				}
			}
		},
		methods:{
			isRepeat(arr){
				var hash = {};
				for(var i in arr) {
					if(hash[arr[i].filterKey]){
						return i;
					}
					hash[arr[i].filterKey] = true;
				}
				console.log(hash,'hash')
				return -1;
			},
			/**
			* 新增行
			*/
			addRow(index_){
				let temRow ={...this.emptyRow};
				temRow.modelId = this.modelId;
				this.tableData.splice(index_+1,0,temRow)
			},
			/**
			* 删除行
			*/
			delRow(_index){
				this.tableData.splice(_index,1)
			},
			doSave(){
				var key=this.isRepeat( this.tableData)
				if(key<0){
					var data=Object.assign([],this.tableData)
					data.forEach(val=>{
						delete val.modifyTime
						delete val.createTime
					})
					console.log(data)
					saveOrUpdateFilter({
						Vue: this,
						params: data
					}).then(res => {
						if (res.result) {
							this.$message.success('保存成功')
							this.$emit('update:editModel', false);
						}
					})
				}else{
					this.$message.error('关键字'+this.tableData[key].filterKey+'重复，请检查重新输入')
				}
			},
			doSearch(modelId){
				if(modelId==this.modelId)
					return;
				else
					this.modelId = modelId;
				this.tableData.splice(0,this.tableData.length);
				 if(modelId!=null&&modelId>0){
					 devModelFilterList({
						 Vue:this,
						 params:{
							 modelId:modelId
							},
					 }).then(res=>{
					 	if(res.result){
					 		this.tableData = res.model;
					 	}
					 })
				 }
			}
		}
	}
</script>
<style lang="less">
	.model-filter{
		width: 98%;
		padding: 0 auto;
	}
</style>
