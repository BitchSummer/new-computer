<!--
  规格配置
 -->

<template>
		<el-form :model="form" ref="form"  label-width="100px" class="view-form" style="clear: both;">
					<el-form-item label="上级菜单:"  >
						<el-input size="mini" v-model="form.parentName" disabled></el-input>
					</el-form-item>
					<el-form-item label="菜单名称:" prop="menuName" >
						<el-input size="mini" v-model="form.menuName" disabled ></el-input>
					</el-form-item>
					<el-form-item label="菜单链接:" prop="menuPath" >
						<el-input size="mini" v-model="form.menuPath"  disabled></el-input>
					</el-form-item>
					<el-form-item label="操作控制:">
						<el-radio-group size="mini" v-model="form.isBtnCtr">
							<el-radio :label=false>暂不控制</el-radio>
							<el-radio :label=true>操作控制</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="操作按钮:" v-show="form.isBtnCtr==true">
						<el-tag size="small" style="margin-right: 10px;" v-for="item in form.btnArr">{{item.btnName}}</el-tag>
					</el-form-item>
		</el-form>
</template>

<script>
	export default {
		props: ['form']
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;
		h1 {
			font-size: 16px;
			margin: 10px auto;
			text-align: center;
		}
		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
