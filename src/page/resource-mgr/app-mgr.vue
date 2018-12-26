<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<el-card style="margin-top: 10px;">
			<el-tabs v-model="activeName" class="app-mgr" @tab-click="doTabClick">
				<el-tab-pane label="应用资源" name="app-mgr">
					<app-mgr :config="selectedItems" ref="appMgr"/>
				</el-tab-pane>
				<el-tab-pane label="授权企业" name="app-company">
					<app-company :config="selectedItems" ref="appCompany"/>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</div>

</template>
<script>
	import AppMgr from '../../components/resource-mgr/app-mgr/app-mgr.vue'
	import AppCompany from '../../components/resource-mgr/app-mgr/app-company.vue'
	import {
		appSurveyList,
		appClass
	} from '../../api/resourcemgr-appmgr.js'
	export default {
		components: {
			AppMgr,
			AppCompany,
			appClass
		},
		data() {
			return {
				activeName: 'app-mgr',
				//筛选数据
				classifiedConfig: [{
					title: '行业领域:',
					options: []
				}, {
					title: '应用分类:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				appClassMap: null
			}
		},
		methods: {
			doClickHandler(index, option) {
		  	if (index == 0) {
				  console.log(appClassArr,'appClassArr')
					/* this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length); */
					let appClassArr = this.appClassMap.get(option.value);
					if (appClassArr && appClassArr.length > 0) {
						appClassArr.forEach(item => {
							this.classifiedConfig[0].options.push(item);
							this.classifiedConfig[1].options.push(item);
						});
						this.selectedItems[0].value = this.classifiedConfig[0].options[0].label;
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].label;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				}
				  this.doTabClick();   

			},
			doSearch() {
			//行业查询
				appSurveyList({
					Vue: this,
					params: {
						type: "industry"
					}
				}).then(res => {
					if (res.result) {
						let appSurveyArr = res.model;
						let industryTempArr = [];
						this.appClassMap = new Map();
						console.log(this.appClassMap,'this.appClassMap')
					/* 	this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length); */
						if (appSurveyArr != null && appSurveyArr.length > 0) {
							appSurveyArr.forEach(item => {
							 
									let temp = {
										label: item.value,
										value: item.value
									}
									industryTempArr.push(item.value)//行业领域存
									this.classifiedConfig[0].options.push(temp);					
	 					/* 	if (appClassTempArr.indexOf(item.appClass) == -1) {
									if (this.appClassMap.has(item.industry))
										this.appClassMap.get(item.industry).push({
											label: item.value,
											value: item.appClass
										});
									else {
										this.appClassMap.set(item.industry, [{
											label: item.value,
											value: item.appClass
										}]);
									}
								}   */
								//默认选中第一个
							  	this.selectedItems[0].value = this.classifiedConfig[0].options[0].label; 
								this.doClickHandler(1, this.classifiedConfig[0].options[0]) 
							})
						}
					}
				}),
	//应用分类
					appClass({
					Vue: this,
					params: {
						appType: "appClass"
					}
				}).then(res => {
					if (res.result) {
						let appSurveyArr = res.model;
						let appClassTempArr = [];
						this.appClassMap = new Map();
					/* 	this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length); */
						if (appSurveyArr != null && appSurveyArr.length > 0) {
							appSurveyArr.forEach(item => {
						 
								if (appClassTempArr.indexOf(item.value) == -1) {
									let temp = {
										label: item.value,
										value: item.value
									/* 	value: item.appClass */
									};
									appClassTempArr.push(item.value)
								  	this.classifiedConfig[1].options.push(temp);  
								}
							/* 	if (appClassTempArr.indexOf(item.appClass) == -1) {
									if (this.appClassMap.has(item.industry))
										this.appClassMap.get(item.industry).push({
											label: item.value,
											value: item.appClass
										});
									else {
										this.appClassMap.set(item.industry, [{
											label: item.value,
											value: item.appClass
										}]);
									}
								} */
								//默认选中第一个
							 	this.selectedItems[1].value = this.classifiedConfig[1].options[0].label;
								this.doClickHandler(1, this.classifiedConfig[1].options[0]) 
							})
						}
					}
				})
			},
			doTabClick(){
				if(this.activeName=='app-mgr')
					this.$refs.appMgr.doSearch();
				else if(this.activeName=='app-company')
					this.$refs.appCompany.doSearch();
			}

		},
		mounted() {
			this.doSearch();
		}
	}
</script>
<style lang="less">

</style>
