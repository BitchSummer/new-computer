<!--
  规格配置
 -->

<template>
	<div>
		<toast :config="config" node-key="id" @cancel="config.dialogVisible=false;" @showWin="loadMenuList">
			<el-row :gutter="10" style="margin: 10px;">
				<el-col :span="9">
					<el-card>
						<menu-tree  :menuList="menuArr" ref="menuTree"  @loadMenuInfo="loadMenuInfo" @doAddMenu="doAddMenu"/>
					</el-card>
				</el-col>
				<el-col :span="15">
					<el-card>
						<menu-form :form="menuForm"  @doBtnConfig="doBtnConfig"  @doSave="doSave" ref="menuForm"/>
					</el-card>
				</el-col>
			</el-row>
		</toast>
		<btn-config-win :config="btnConfig" @doSave="setBtnConfig" />
	</div>
</template>

<script>
	import MenuTree from './menu-tree.vue'
	import MenuForm from './menu-form.vue'
	import BtnConfigWin from './btn-config-win.vue'
	import {
		appMenuList,
		appMenuBtnList,
		saveOrUpdateBtn
	} from '../../../api/resourcemgr-appmgr.js'
// import demoVue from '../../../../../demo/demo.vue';

	export default {
		props: ['config'],
		data() {
			return {
				id:'',
				appId:'',
				mod:'',
				menuArr:[],
				selNode:null,
				menuForm: {},
				btnConfig: {
					title: "操作按钮维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "500px", //弹窗宽
					emptyRow:{
						btnCode:'',
						btnName:''
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
				}
			}
		},
		methods: {
			doAddMenu(node, data){
				this.mod="add"
				   this.selNode = node;
					this.menuForm ={
						appId:this.config.appId,
						parentId:this.selNode.data.id,
						parentName:this.selNode.data.menuName,
						isBtnCtr:false,
						isLeaf: true,
						btnArr:[]
					}
			},
			//＋保存
			doSave(data,node){
				this.id=data.id;
				this.appId=data.appId
				this.menuForm.id = data.id;
				this.menuArr.push(this.menuForm);
				if(!this.selNode.loaded){
					if(this.selNode.isLeaf){
						this.$set(this.selNode,'isLeaf',false)
						this.$set(this.selNode,'loaded',false)
					}
				}else{
				 /* this.selNode.insertChild({data:this.menuForm})  */
				 if(this.mod=='edit'){
						 this.selNode.data.menuName=this.menuForm.menuName
					 }else{
						 this.selNode.insertChild({data:this.menuForm})		
						 this.menuForm={}
					 }
				}
			},
			doDel(){
				let id = this.selNode.data.id;
				let parent = this.selNode.parent.data;
				let index = parent.children.findIndex(item=>{
					return item.id === id;
				})
				parent.children.splice(index,1);
			},
			resetTree(){
			  this.reset = false;
			setTimeout(()=>{
              this.reset = true;
			  },0)
			},
			doBtnConfig(){
				this.btnConfig.tempList =[]
				if(this.menuForm.btnArr!=null&&this.menuForm.btnArr.length>0)
				this.btnConfig.tempList =[...this.menuForm.btnArr,];
				this.btnConfig.tempList.push({...this.btnConfig.emptyRow});
				this.btnConfig.dialogVisible = true;
			},
			setBtnConfig(tempList,id,appId){
				this.$set(this.menuForm,'btnArr',tempList);
				this.btnConfig.dialogVisible = false;
				let it = []
				for(let item of tempList){
					delete item.modifyTime
					delete item.createTime
					it.push(item)
				}
                   for(let attr in it){
				if(!attr.id||!attr.appId){
                   it[attr].menuId=this.id
                   it[attr].appId=this.appId
                }
				}
			saveOrUpdateBtn({
						Vue: this,
						params:it
					}).then(res => {

					});
			},
			//编辑
			loadMenuInfo(node, data) {
				this.mod='edit'
				if(node.parent.data==null)
					data.parentName = ''
				else
					data.parentName = node.parent.data.menuName;
				this.selNode = node;
				if (data.isBtnCtr == true) {
					appMenuBtnList({
						Vue: this,
						params: {
							menuId: data.id
						}
					}).then(res => {
						if (res.result) {
						  	data.btnArr = res.model;
							this.menuForm = {...data};
						}
					});
				} else {
					data.btnArr = []
					this.menuForm = {...data};
				}
			},
			loadMenuList(){
				this.menuArr.splice(0,this.menuArr.length)
				appMenuList({
					Vue: this,
					params: {
						appId: this.config.appId
					}
				}).then(res =>{
					if (res.result) {
						this.menuArr = res.model;
						this.$refs.menuTree.init();
					}
				});
			}
		},
		components: {
			MenuTree,
			MenuForm,
			BtnConfigWin
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
