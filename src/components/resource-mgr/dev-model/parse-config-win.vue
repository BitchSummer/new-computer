<template>
	<toast :config="config" @cancel="config.dialogVisible=false" @doSave="doSave">
		<el-transfer v-model="config.value" :data="data" target-order="push" :titles="titles" />
	</toast>
</template>

<script>
	export default {
		props: ['config'],
		data() {
			return {
				titles: ['可选规则', '已选规则'],
				data: [{
					key: '高低位转换',
					label: '高低位转换'
				}, {
					key: 'Ascii转义',
					label: 'Ascii转义'
				}, {
					key: '整数转义',
					label: '整数转义'
				}, {
					key: '浮点数转义',
					label: '浮点数转义'
				}]
			}

		},
		methods: {
			doSave() {
				this.$emit("setParseConfig", this.config.index, this.config.value.join(','))
			}
		}
	}
</script>
<style scoped="scoped">
	.el-tag {
		margin-left: 10px;
	}
</style>
