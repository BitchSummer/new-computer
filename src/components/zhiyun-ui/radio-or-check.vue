<template>
    <div class="search-list">
        <div class="list-item" v-for="(item,i) in dataItems" :style="{'border-bottom':i==dataItems.length-1?'1px solid #E8E8E8':'none','height':'40px'}">
            <div class="item-label" :style="{'width':width+'px'}">{{item.title}}</div>
            <div class="item-data" style="height:40px">
                <slot :row="item">
									<el-checkbox-group v-model="selResult[i].value" size="mini">
										<el-checkbox  v-for="(option,index) in item.options" :label="option" >{{option}}</el-checkbox>
									</el-checkbox-group>
								</slot>
            </div>
           
        </div>
     <!-- <div style="margin:10px 0" v-show="showResult">
        <p style="margin-left: 20px;">已选条件: <span style="margin: 0 5px"></span> <span style="color: #FF7742" v-for="(item,index) in select">{{item.name}}<span style="margin: 0 5px" v-show="index != select.length - 1">/</span></span></p>
      </div> -->
    </div>
</template>
<script>
export default {
  props:['dataItems','selResult'],
  data: function () {
    return {
      currentHeight: ['40px'],
      width: 120
//       data:[{
//       		title: '设备大类',
//       		options: [
//       			{
//       				name: '整经机',
//       				value: '3'
//       			},
//       			{
//       				name: '经编机',
//       				value: '4'
//       			}
//       		]
//       	},{
//       		title: '设备型号',
//       		options: [
//       			{
//       				name: '11',
//       				value: '3'
//       			},
//       			{
//       				name: '22',
//       				value: '4'
//       			}
//       		]
//       	}]
    }
  },
  methods: {
    handlerClick (option,index,i) {
      if(i == this.select.length - 1){
        this.currentHeight.push('40px')
      }
      if(option.value != (this.select[i] == undefined ? '' : this.select[i].value)){
        this.select.splice(i, 1,option)
        this.select.splice(i+1,this.select.length-1-i)
        this.filterData.splice(i+1,this.filterData.length-1-i)
        this.$emit('handlerClick', this.select,option,i)
      }
    },
    current(i){
      if(this.currentHeight[i] == undefined){
        this.currentHeight[i]==undefined? this.$set(this.currentHeight,i,'auto'):this.$set(this.currentHeight,i,'40px')
      }else{
        this.currentHeight[i]=='40px'? this.$set(this.currentHeight,i,'auto'):this.$set(this.currentHeight,i,'40px')
      }

    }
  },
  mounted(){
   
  }
}
</script>
<style lang="less" scoped>
    .search-list{
        background: #fff;
				padding: 0 10px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
        .list-item{
            min-height: 40px;
            line-height: 40px;
            display: flex;
            border: 1px solid #E8E8E8;
            .item-label{
                font-size:14px;
                font-family:PingFang-SC-Medium;
                color:rgba(163,163,163,1);
                padding-left: 20px;
                border-right:  1px solid #E8E8E8;
            }
            .item-data{
                height: 40px;
								margin-left: 10px;
                overflow: hidden;
                flex: 1;
               
            }
            .item-operate{
                width: 120px;
                height: 40px;
                text-align: center;
                background-color: #F7F7F7;
            }
        }
    }
</style>
