<!--
  规格配置
 -->

<template>
		<toast :config="config" @cancel="config.dialogVisible=false;" @showWin="loadMenuList">
			<el-card style="margin:0px 10px;">
				<app-form :config="config" :tempForm="tempForm"/>
			</el-card>
			<el-row :gutter="10" style="margin: 10px;">
				<el-col :span="9">
					<el-card>
						<menu-tree :menuList="menuArr"  @loadMenuInfo="loadMenuInfo" />
					</el-card>
				</el-col>

				<el-col :span="15">
					<el-card>
						
						<menu-form :form="menuForm" />
					</el-card>
				</el-col>
			</el-row>
		</toast>
</template>

<script>
	import AppForm from './app-form.vue'
	import MenuTree from './menu-tree.vue'
	import MenuForm from './menu-view-form.vue'
	import {
		appMenuList,
		appMenuBtnList,
		appBtnList
	} from '../../../api/resourcemgr-appmgr.js'

	export default {
		props: ['config','tempForm'],
		data() {
			return {
				menuArr:[],
				menuForm: {}
			}
		},
		methods: {
			appSave(data){
				this.$emit("appSave",data );
			},
			loadMenuInfo(menu,node) {
				if (menu.isBtnCtr == true) {
					appMenuBtnList({
						Vue: this,
						params: {
							menuId: menu.id
						}
					}).then(res => {
						if (res.result) {
							menu.btnArr = res.model;
							this.menuForm = menu.data;
						}
					});
				} else {
					menu.btnArr = []
					this.menuForm = menu.data;
					 if(menu.parent.data==null)
					this.menuForm.parentName = ''
				else
					this.menuForm.parentName= menu.parent.data.menuName;  
					/* this.menuForm.parentName=menu.data.parentName//改改gauge */
				}
			appBtnList({
					Vue: this,
					params: {
						menuId: menu.data.id
					}
				}).then(res => {
					if (res.result) {
					this.menuForm.btnArr = res.model;
					}
				});
			},
			loadMenuList(){
				this.menuArr.splice(0,this.menuArr.length)
				appMenuList({
					Vue: this,
					params: {
						appId: this.config.form.id
					}
				}).then(res => {
					if (res.result) {
						this.menuArr = res.model;
						/* 	this.$refs.menuTree.init(); */
					}
				});
			}
		},
		components: {
			AppForm,
			MenuTree,
			MenuForm
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;

		h1 {
			font-size: 15px;
			margin: 15px auto;
		}

		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
