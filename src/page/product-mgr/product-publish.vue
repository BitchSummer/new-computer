<template>
	<el-tabs v-model="activeName" @tab-click="doTabClick">
		<el-tab-pane label="发布产品" name="publish-product">
			<publish-product ref="publishProduct" />
		</el-tab-pane>
		<el-tab-pane label="已发布产品" name="proudct-published">
			<product-published ref="proudctPublished" />
		</el-tab-pane>
		
	</el-tabs>
</template>
<script>
	import PublishProduct from '../../components/product-mgr/product-publish/publish-product.vue'
	import ProductPublished from '../../components/product-mgr/product-publish/product-published.vue'
	export default {
		components: {
			PublishProduct,
			ProductPublished
		},
		data() {
			return {
				activeName: 'publish-product'
			}
		},
		methods: {
			doTabClick() {
				if(this.activeName=='publish-product'){
					this.$refs.publishProduct.doSearch();
				}else if(this.activeName=='proudct-published')
					this.$refs.proudctPublished.doSearch();
			}
		},
		mounted: function() {
			 this.doTabClick();
		}
		
	}
</script>
