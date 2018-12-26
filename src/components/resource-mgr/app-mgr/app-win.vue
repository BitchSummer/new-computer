<!--
  规格配置
 -->

<template>
		<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
				<app-form :config="config" ref="appForm" v-if="config.dialogVisible"/>
		</toast>
</template>

<script>
	import AppForm from './app-form.vue'
	export default {
		props: ['config'],
		methods: {
			doSave(){
				this.$emit('doSave')
			}
		},
		components: {
			AppForm
		},
		watch:{
			
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;


		.el-form-item {
			margin-bottom: 12px;
		}
	}
</style>
