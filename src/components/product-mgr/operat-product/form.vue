<template>
	<el-row :gutter="10" class="product-class-form">
		<el-col :span="6">
			<el-card>
				<h1>产品概述</h1>
				<el-form ref="form" class="rbox-form" size="small" :model="form" label-width="100px">
					<el-form-item label="产品大类:">
						<el-input disabled v-model="form.alias"></el-input>
					</el-form-item>
					<el-form-item label="关联资源:">
						<el-input disabled v-model="form.resource"></el-input>
					</el-form-item>
					<el-form-item label="交付方式:">
						<el-input disabled v-model="form.deliver"></el-input>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="更新时间">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
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
				</el-form>
			</el-card>

		</el-col>
		<el-col :span="12">
			<el-card>
				<h1>
					公有属性
				</h1>
				<div>
					<el-tag type="info" v-for="item in form.publicAttrs">{{item.alias}}</el-tag>
				</div>
				<h1>
					产品特性
				</h1>
				<div>
					<el-tag v-for="item in form.privateAttrs">{{item.alias}}</el-tag>

				</div>
				<h1>
					规格配置
				</h1>
				<div>
					<el-tag type="success" v-for="item in form.configAttrs">{{item.alias}}</el-tag>
				</div>
			</el-card>

		</el-col>
		<el-col :span="6">
			<el-card>
				<h1>详情模板</h1>
				<img :src="form.templateImgUrl" />

			</el-card>
		</el-col>
	</el-row>
</template>
<script>
	export default {
		props: ['form']
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
