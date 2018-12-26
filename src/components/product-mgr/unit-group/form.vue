<template>
	<div>
		<h1>单位组概述</h1>
		<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="100px">
			<el-form-item label="单位组:" prop="alias">
				<el-input :disabled="editModel==false" v-model="form.alias"></el-input>
			</el-form-item>
			<el-form-item label="启停标识:">
				<el-tag type="success" v-show="form.isAble=='启用'">{{form.isAble}}</el-tag>
				<el-tag type="danger" v-show="form.isAble=='停用'">{{form.isAble}}</el-tag>
			</el-form-item>
			<el-form-item label="启停时间:">
				<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
				 placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="创建时间">
				<el-date-picker disabled v-model="form.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
				placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="更新时间">
				<el-date-picker disabled v-model="form.modifyTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
				placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		props: ['form','editModel'],
		data() {
			return {
				rules: {
					alias: [{
						required: true,
						message: '请输入单位组...',
						trigger: 'change'
					}]

				},
				publicAttrs: [{
					label: '服务商',
					value: '服务商'
				}, {
					label: '产品编码',
					value: '产品编码'
				}, {
					label: '产品名称',
					value: '产品名称'
				}, {
					label: '产品描述',
					value: '产品描述'
				}, {
					label: '产品介绍',
					value: '产品介绍'
				}],
				privateAttrs: [{
					label: '风格',
					value: '风格'
				}, {
					label: '材质',
					value: '产品编码'
				}, {
					label: '适用季节',
					value: '产品名称'
				}],
				configAttrs: [{
					label: '颜色',
					value: '风格'
				}, {
					label: '尺码',
					value: '产品编码'
				}, {
					label: '款式',
					value: '产品名称'
				}]
			}
		}
	}
</script>
<style lang="less">
	.product-class-form {
		h1 {
			line-height: 40px;
		}

		.el-tag {
			margin-right: 10px;
			margin-bottom: 10px;
			padding: 0 20px;
		}
	}
</style>
