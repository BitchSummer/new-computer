<!--form表单弹出框-->
<template>
  <el-dialog title="收货地址" :visible.sync="config.showDialog">
    <form-msg :configer="config">琼飞</form-msg>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      config:{
        type:Object,
        default:{}
      }
    },
    components:{
      formMsg:{
            render: function (createElement) {
                if( configer.colum == "alone" ){//单列............
                    let _col = createElement("el-form-item")
                }else{//双列...........

                }
                return createElement(
                    'el-form',
                    _col
                )
            },
            props: {
                configer: {
                    type: Object,
                    required: true
                }
            }
        }
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods:{

    }
  }
</script>
<style type="text/css" scoped lang="less">
.toolbar {
  height: 60px;
	background: #FFF;
	box-shadow: 1px 1px 15px #e6e6e6;
  line-height: 60px;
  // .el-button {
  //   background: #e6e6e6;
  //   color: #686868;
  //   border: 0px solid #dcdfe6;
  // }
  .ltool {
     float: left;
    	margin-left: 10px;
  }
  .rtool {
  	float: right;
    span {
      margin-right: 20px;
    }
   
  }
}
</style>


