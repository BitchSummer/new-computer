
<template>
	<toast :config="config" @cancel="config.dialogVisible=false" @doSave="doSave">
			<el-table :data="temList" :highlight-current-row="false" style="width: 90%;margin: 0px auto;">
				<el-table-column align="center" label="参数名称" >
					<template slot-scope="scope">
						<el-input v-model="scope.row.alias" size="medium"></el-input>
					</template>
				</el-table-column>
				
				<el-table-column width="140" align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" icon="el-icon-plus" type="primary" @click="doAdd(scope.$index)"></el-button>
						<el-button size="mini" icon="el-icon-minus" @click="doDel(scope.$index)" type="danger"></el-button>
					</template>
				</el-table-column>
			</el-table>
	</toast>
</template>

<script type="text/javascript">
	export default {
		props:['config'],
		computed:{
			temList(){
				return this.config.tempList.filter(item=>item.deleted==null||item.deleted=='F')
			}
		},
		methods: {
			/**显示条数变化 */
			doAdd(index_) {
				this.config.tempList.splice(index_+1,0,{...this.config.emptyRow})
			},
			doDel(index_){
				let temp = this.config.tempList[index_];
				console.log(temp.id)
				if(temp.id==null||temp.id==0){
					this.config.tempList.splice(index_,1)
				}else{
					console.log(this.temList)
					this.$set(this.temList[index_],'deleted','T')
				}
			},
			doSave(){
				let temp ='';
				let hasError = false;
				let tempArr1=[]
				this.config.tempList.forEach((item, index) => {
					if (item.alias==undefined||item.alias=='undefined'||item.alias == '') {
						if (item.id && item.id > 0){
							item.deleted = 'T';
							tempArr.push(item)
						}
					}else{
						if(temp.indexOf("#"+item.alias+"#")>-1){
							 this.$message({
							  message: '第'+(index+1)+'行内容存在重复,请检查...',
							  type: 'warning'
							});
							hasError = true;
							return;
						}else{
							tempArr1.push(item)
							temp+="#"+item.alias+"#";
						}
						
					}
				})
				
				if(hasError==false){
					 this.config.dialogVisible = false;
					this.$emit("doSave",tempArr1);
				}
				
			}
		}
	};
</script>
<style>
	.pagetool {
		text-align: center;
	}
</style>