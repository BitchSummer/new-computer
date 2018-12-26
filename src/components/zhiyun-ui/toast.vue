
<template>
    <el-dialog class="poc-toast" :title="config.title"
		 :visible.sync="config.dialogVisible" :close-on-click-modal="false"
		 :append-to-body="config.appendToBody"
		 :width="config.width" @close="callBack('handleClose')" @open="callBack('showWin')">
        <!-- 内容   主题内容自定义部分-->
        <slot></slot>
        <!-- 按钮组 -->
        <div class="btn-group">
            <el-button class="dialog-white" v-for="item in config.btnData" v-show="item.isShow!=null?item.isShow:true" :disabled="item.disabled" :class="item.bgColor" @click="callBack(item.method)">{{item.name}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: ["config"],
  methods: {
    callBack(method) {
      this.$emit(method);
    }
  }
};
</script>
<style lang="less">
@headerbgImage: linear-gradient(to right, #272C34, #272C34);
@headerbgColor:#4a8dd2;
.poc-toast {
  .el-dialog {
    border-radius: 5px;
    overflow: hidden;
  }
  .dialog-normal{
    background-color: #BFCAD1;
    color: white;
    padding: 10px 15px;
  }
  .dialog-blue {
    background-color: #0ca8f1;
    color: white;
    padding: 10px 15px;
  }
  .dialog-deep-blue {
    background-color: #0c68f1;
    color: white;
    padding: 10px 15px;
  }
  .dialog-white {
    padding: 10px 15px;
  }
  .el-dialog__header {
    background-color: @headerbgColor;
    background-image: @headerbgImage;
    padding: 15px;
    height:30px;
    line-height: 30px;
    .el-dialog__title {
      color: white;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 0 0 !important;
  }
  .btn-group {
    text-align: right;
    background-color: #eef1f5;
    padding: 13px 20px;
    margin-top: 20px;

    .el-button {
      width: 96px;
      height: 34px;
      padding: 0;
      margin-left: 20px;
    }
    .el-button:first-child {
      background: #EEF1F5;
      border: 1px solid #BFCAD1;
      color: #A1A3A4;
    }
  }
  .el-dialog__headerbtn .el-dialog__close{
    color: white;
  }
}
</style>
