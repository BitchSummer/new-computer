<template>
  <el-col :span="18"  class="business-entry-form">
 
		<el-steps :active="form.status=='已入驻'?3:form.status=='待入驻'?2:1" finish-status="success" simple style="margin: 20px">
			<el-step title="入驻申请" ></el-step>
			<el-step title="入驻审核" ></el-step>
			<el-step title="完成入驻" ></el-step>
		</el-steps>
		<h1>{{form.status=='待入驻'?'您的申请已提交，我们会第一时间进行处理...':form.status=='已入驻'?'恭喜您加入我们入驻企业大家庭...':form.authRemark}}</h1>
    <el-form ref="Form"  label-width="140px">
      <el-form-item label="企业名称:" >
      	{{form.companyName}}
      </el-form-item>
      <el-form-item label="企业性质:">
				{{form.companyNature}}
      </el-form-item>
      <el-form-item label="企业机构代码:" >
				{{form.businessNo}}
      </el-form-item>
      <el-form-item label="行业领域:" >
				{{form.industry}}
      </el-form-item>
      <el-form-item label="企业地址:" >
				{{form.address}}
      </el-form-item>
      <el-form-item label="联系人:" >
				{{form.linkMan}}
      </el-form-item>
      <el-form-item label="联系手机:" >
				{{form.linkPhone}}
      </el-form-item>
      <el-form-item label="人员规模:" >
				{{form.userCount}}
      </el-form-item>
      <el-form-item label="入驻费用(元/月):" >
				{{form.entryCost}}
      </el-form-item>
      <el-form-item label="企业照片:" >
				<img class="rz-images" :src="form.imageUrl3" alt="">
      </el-form-item>
			<el-form-item label="申请状态:" >
				{{form.status}}
			</el-form-item>
			<el-form-item size="small" >
				 <el-button type="primary" :disabled="form.status=='待入驻'">申请变更</el-button>
			</el-form-item>
    </el-form>
  </el-col>
</template>
<script>

  export default {
		props: ['form']
  }

</script>
<style lang="less">
.business-entry-form{
	h1{
		line-height: 80px;
		font-size: 18px;
		color: #333;
		margin-left: 111px;
	}
}
</style>
