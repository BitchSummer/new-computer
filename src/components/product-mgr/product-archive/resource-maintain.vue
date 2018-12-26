
<template>
	<toast :config="winConfig" @cancel="winConfig.dialogVisible=false" @doSave="doSave">
			<el-table :data="temList" :highlight-current-row="false" style="width: 90%;margin: 0px auto;">
				<el-table-column align="center" label="资源名称" >
					<template slot-scope="scope">
						 <el-autocomplete
						 size="small"
						 style="width: 90%;"
							v-model="scope.row.resourceName"
							value-key="resourceName"
							:value="scope.row.resourceName"
							:fetch-suggestions="querySearch"
							placeholder="请输入关键字搜索..."
							:trigger-on-focus="false"
							@select="handleSelect(scope.row)"
						></el-autocomplete>
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
	import {apiList} from '../../../api/resourcemgr-apimgr.js'
	import {appList} from '../../../api/resourcemgr-appmgr.js'
	import {fileList} from '../../../api/resourcemgr-filemgr.js'
	import {devModelList} from '../../../api/resourcemgr-devmodel.js'

	export default {
		data(){
			return {
				winConfig: {
					title: '关联资源维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '600px', //弹窗宽
					tempList: [],
					resourceType:'',
					resourceArr:null,
					emptyRow: {
						id: 0,
						resourceName: '',
						resourceId:0,
						productId:0,
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
		computed:{
			temList(){
				return this.winConfig.tempList.filter(item=>item.deleted==null||item.deleted=='F')
			}
		},
		methods: {
			show(config){
				this.winConfig.tempList.splice(0,this.winConfig.tempList.length)
				if(config.tempList!=null&&config.tempList.length>0)
					this.winConfig.tempList=config.tempList
				this.winConfig.tempList.push({...this.winConfig.emptyRow});
				this.winConfig.resourceType = config.resourceType;
				this.winConfig.productId = config.productId
				this.winConfig.dialogVisible = true;
			},
			querySearch(queryStr, cb){
				if(this.winConfig.resourceType=='API接口'){
					this.queryApi(queryStr, cb)
				}else if(this.winConfig.resourceType=='云应用')
					this.queryApp(queryStr, cb)
					else if(this.winConfig.resourceType=='文件资源')
						this.queryFile(queryStr, cb)
						else if(this.winConfig.resourceType=='设备模型')
							this.queryDevModel(queryStr, cb)
			},
			queryApi(queryStr, cb){
				apiList({
					Vue: this,
					params: {
						apiName:queryStr
					}
				}).then(res => {
					if (res.result) {
						let apiArr = res.model;
						let resArr =[];
						if(apiArr!=null&&apiArr.length>0){
							apiArr.forEach(api=>{
								resArr.push({
									resourceId:api.id,
									resourceName:api.apiName,
									resourceType:this.winConfig.resourceType 
								})
							})
						}
						this.resourceArr = resArr;
						cb(resArr);
					}
				})
			},
			queryApp(queryStr, cb){
				appList({
					Vue: this,
					params: {
						appName:queryStr
					}
				}).then(res => {
					if (res.result) {
						let appArr = res.model;
						let resArr =[];
						if(appArr!=null&&appArr.length>0){
							appArr.forEach(app=>{
								resArr.push({
									resourceId:app.id,
									resourceName:app.appName,
									resourceType:this.winConfig.resourceType 
								})
							})
						}
						this.resourceArr = resArr;
						cb(resArr);
					}
				})
			},
			queryFile(queryStr, cb){
				fileList({
					Vue: this,
					params: {
						fileName:queryStr
					}
				}).then(res => {
					if (res.result) {
						console.log(res.model)
						let fileArr = res.model;
						let resArr =[];
						if(fileArr!=null&&fileArr.length>0){
							fileArr.forEach(file=>{
								resArr.push({
									resourceId:file.id,
									resourceName:file.fileName,
									resourceType:this.winConfig.resourceType 
								})
							})
						}
						console.log(resArr)

						this.resourceArr = resArr;
						cb(resArr);
					}
				})
			},
			queryDevModel(queryStr, cb){
				devModelList({
					Vue: this,
					params: {
						queryStr:queryStr
					}
				}).then(res => {
					if (res.result) {
						 let modelArr = res.model;
						 let resArr =[];
						 if(modelArr!=null&&modelArr.length>0){
						 	modelArr.forEach(model=>{
						 		resArr.push({
						 			resourceId:model.id,
						 			resourceName:model.queryStr,
						 			resourceType:this.winConfig.resourceType 
						 		})
						 	})
						 }
						 this.resourceArr = resArr;
						 cb(resArr);
					}
				})
			},
			handleSelect(row){
				let res = this.resourceArr.filter(item=>item.resourceName==row.resourceName)[0]
				this.$set(row,'resourceId',res.resourceId);
			},
			/**显示条数变化 */
			doAdd(index_) {
				this.winConfig.tempList.splice(index_+1,0,{...this.winConfig.emptyRow})
			},
			doDel(index_){
				let temp = this.winConfig.tempList[index_];
				if(temp.id==null||temp.id==0)
					this.winConfig.tempList.splice(index_,1)
				else
					this.$set(temp,'deleted','T')
			},
			doSave(){
				let temp ='';
				let hasError = false;
				let tempArr1=[]
				this.winConfig.tempList.forEach((item, index) => {
					if (item.resourceName==null||item.resourceName == '') {
						if (item.id && item.id > 0){
							item.deleted = 'T';
							tempArr.push(item)
						}
					}else{
						if(temp.indexOf("#"+item.resourceName+"#")>-1){
							 this.$message({
							  message: '第'+(index+1)+'行内容存在重复,请检查...',
							  type: 'warning'
							});
							hasError = true;
							return;
						}else{
							tempArr1.push(item)
							temp+="#"+item.resourceName+"#";
						}
						
					}
				})
				
				if(hasError==false){
					 this.winConfig.dialogVisible = false;
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