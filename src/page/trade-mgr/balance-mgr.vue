<template>
  <el-row class="trade-mgr">
    <el-col :span="24" class="trade-mgr-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="结算管理" name="first">
          <balance-list ref="balanceList" />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
	import BalanceList from '../../components/trade-mgr/balance-mgr/list.vue'
 
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    mounted() {
        this.$refs.balanceList.doSearch();
    },
    components: {
			BalanceList
    }
  }

</script>
<style lang="less">
  .trade-mgr{
    background-color: #f0f2f5;
    .trade-mgr-main{
        background-color: white;
    }
    .el-tabs__content {
      border: none; 
      position: relative;       
    }
    .el-input-group__append{
        cursor: pointer;
    }
    .order-header{
        display: flex;
        height: 40px;
        background-color: #F9F9F9;
        line-height: 40px;
        margin-top: 24px;
        justify-content: space-around;
        span{
            color: #666666;
            font-size: 14px;
            white-space: nowrap;
            text-overflow:ellipsis;
            overflow: hidden;
        }
        .h-p1-text{
            width: 277px;
            text-align: center;
        }
    }
    .order-header-operation{
          padding: 12px 23px;
          display: flex;
          justify-content: space-between;
    }
    .order-list{
        display: flex;
        flex-direction:column;
    } 
    .order-item-header{
        display: flex;
        justify-content: space-between;
        padding: 12px 23px;
        background-color: #F9F9F9;
        div{
            color: #666666;
            font-size: 14px;
        }
        
    }
    .order-item-body{
        display: flex;
        justify-content: space-between;
        padding: 12px 23px;
        color: #333333;
        font-size: 12px;
        .b-p0-text{
            width: 275px;
            display: flex;
            img{
                margin-right: 8px;
            }
        }
        .b-p6-text, .b-p7-text{
            width: 48px;
        }
    }
    .search-more{
        margin-left: 10px;
    }
    .search-more-body{
        margin-top:20px;
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
  }

</style>
