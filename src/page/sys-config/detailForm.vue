/* 查看详情页面 */
<template>
	<div class="data-dir-form" v-if="selectNode.data.id>0">
		<h1 v-show="selectNode.data.nodeType=='BusinessClass'">业务大类</h1>
		<h1 v-show="selectNode.data.nodeType=='dir'">数据字典</h1>
		<h1 v-show="selectNode.data.nodeType=='Define'">数据定义</h1>
        <el-form ref="form" v-if="selectNode.data.nodeType=='BusinessClass'" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="业务编码:" >
			    <el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="业务名称:" >
			    <el-input v-model="form.alias"></el-input>
			</el-form-item>
        </el-form>
        <el-form ref="form" v-if="selectNode.data.nodeType=='dir'" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="业务分类:" >
				{{selectNode.data.businessClass}}
			</el-form-item>
			<el-form-item label="字典编码" prop="code">
				<el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="字典名称" prop="value">
				<el-input v-model="form.value"></el-input>
			</el-form-item>
			<el-form-item label="可见控制:"  >
				<el-radio-group v-model="form.dirIsOtherView">
					<el-radio :label="false">仅本人可见</el-radio>
					<el-radio :label="true">他人可见</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="字典控制:" >
				<el-radio-group v-model="form.dirIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="定义控制:" >
				<el-radio-group v-model="form.defineIsEdit">
					<el-radio :label="false">仅本人编辑</el-radio>
					<el-radio :label="true">他人可编辑</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="启停标识:" >
                <span class="symbol able-box" v-show="form.isAble">已启用</span>
                <span class="symbol disable-box" v-show="!form.isAble">已停用</span>
			</el-form-item>
			<el-form-item label="启停时间:" >
				{{form.modifyTime}}
			</el-form-item>
        </el-form>
        <el-form ref="form" v-if="selectNode.data.nodeType=='Define'" class="rbox-form" size="small"  :model="form" label-width="100px">
            <el-form-item label="归属字典:">
				{{selectNode.data.dirName}}
			</el-form-item>
			<el-form-item label="定义编码" prop="code">
				<el-input v-model="form.code" ></el-input>
			</el-form-item>
			<el-form-item label="定义名称" prop="value">
				<el-input v-model="form.value"></el-input>
			</el-form-item>
        </el-form>
	</div>
</template>
<script>
	// import {
	// 	saveOrUpdateBusinessClass,
	// 	saveOrUpdateDir,
	// 	saveOrUpdateDefine
	// }
	//  from '../../../api/sysconfig-datadir.js'
	export default {
		props: ['selectNode','form'],
		data(){
			return {
            }
        },
		methods: {

		}
	}
</script>
<style lang="less">
	.data-dir-form {
		h1 {
			text-align: center;
			line-height: 100px;
			font-size: 18px;
		}
		.rbox-form {
			display: table;
			margin: 0px auto;
			width: 500px;
			padding: 0px auto;
			.form-btn{
				text-align: center;
				button{
					width: 110px;
				}
			}
		}
	}
</style>
