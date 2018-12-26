<template>
	<el-tabs v-model="activeName" @tab-click="doTabClick">
		<el-tab-pane label="产品定价" name="proudct-price">
			<product-price ref="proudctPrice"/>
		</el-tab-pane>
		<el-tab-pane label="调价记录" name="price-record">
			<price-record ref="priceRecord" />
		</el-tab-pane>
	</el-tabs>
</template>
<script>
	import ProductPrice from '../../components/product-mgr/product-price/price-list.vue'
	import PriceRecord from '../../components/product-mgr/product-price/price-record.vue'
	export default {
		components: {
			ProductPrice,
			PriceRecord
		},
		data() {
			return {
				activeName: 'proudct-price'
			}
		},
		methods: {
			doTabClick() {
				if(this.activeName=='proudct-price'){
					this.$refs.proudctPrice.doSearch();
				}else if(this.activeName=='price-record')
					this.$refs.priceRecord.doSearch();
			}
		},
		mounted: function() {
			 this.doTabClick();
		}
		
	}
</script>
