import Vue from 'vue'
import Router from 'vue-router'
import page_404 from '../page/404/index.vue'
import unitGroup from 'page/product-mgr/unit-group.vue';//单位组
import operatProduct from 'page/product-mgr/operat-product.vue';//经营产品
import ProductArchive from 'page/product-mgr/product-archive.vue';//单位组
import ProductPrice from 'page/product-mgr/product-price.vue';//单位组
import ProductPublish from 'page/product-mgr/product-publish.vue';
import AppMgr from 'page/resource-mgr/app-mgr.vue';
import ApiMgr from 'page/resource-mgr/api-mgr.vue';
import DevModel from 'page/resource-mgr/dev-model.vue';
import DataDir from 'page/sys-config/data-dir.vue';
import FileMgr from 'page/resource-mgr/file-mgr.vue';

import OrderMgr from '../page/trade-mgr/order-mgr.vue'
import ReceivableMgr from '../page/trade-mgr/receivable-mgr.vue'
import InvoiceMgr from '../page/trade-mgr/invoice-mgr.vue'
import BalanceMgr from '../page/trade-mgr/balance-mgr.vue'
import DeliverMgr from '../page/trade-mgr/deliver-mgr.vue'
// import productIntroduction from 'page/productManagement/productArchives/productIntroduction/productIntroduction.vue';//产品介绍
// import productMaintenance from 'page/productManagement/productArchives/productMaintenance/productMaintenance.vue';//产品维护
// import productSpecification from 'page/productManagement/productArchives/productSpecification/productSpecification.vue';//产品规格
// import priceAdjustmentMaintenance from 'page/productManagement/productPriceAdjustment/priceAdjustmentMaintenance/priceAdjustmentMaintenance.vue';//价格调节维护
// import releaseRecords from 'page/productManagement/productRelease/releaseRecords/releaseRecords.vue';//发布记录
// import see from 'page/productManagement/productRelease/see/see.vue';//查看
// import documentResources from 'page/resourceManagement/documentResources/documentResources.vue';//文件资源
// import newApplication from 'page/resourceManagement/cloudApplication/newApplication.vue';//云应用
// import authDialogBody from 'page/resourceManagement/apiInterface/authDialogBody.vue';//api接口
// import equipmentModel from 'page/resourceManagement/equipmentModel/equipmentModel.vue';//设备模型
// import accountReceivable from 'page/management/accountReceivable/accountReceivable.vue';//应收款管理...
// import collectionDeliveryManagement from 'page/management/collectionDeliveryManagement/collectionDeliveryManagement.vue';//收发货管理...
// import importAndExportAccountManagement from 'page/management/importAndExportAccountManagement/importAndExportAccountManagement.vue';//收发货管理...
// import orderManagement from 'page/management/orderManagement/orderManagement.vue';//收发货管理...
// import invoice from 'page/management/controlOverInvoices/invoice/invoice.vue';//开具发票...
Vue.use(Router)
export default new Router({
	routes: [
		{
			path: "*",
			component: page_404,
			name: "404"
		},
		{
			path: '/operat-product',
			name: 'operat-product',
			component: operatProduct
		}
		,
		{
			path: '/unit-group',
			name: 'unit-group',
			component: unitGroup
		},
		{
			path: '/product-archive',
			name: 'product-archive',
			component: ProductArchive
		},
		{
			path: '/product-price',
			name: 'product-price',
			component: ProductPrice
		},
		{
			path: '/product-publish',
			name: 'product-publish',
			component: ProductPublish
		},
		{
			path: '/api-mgr',
			name: 'api-mgr',
			component: ApiMgr
		},
    {
      path: '/app-mgr',
      name: 'app-mgr',
      component: AppMgr
    },
		{
      path: '/dev-model',
      name: 'dev-model',
      component: DevModel
    },
    {
      path: '/file-mgr',
      name: 'file-mgr',
      component: FileMgr
    },
    {
      path: '/order-mgr',
      name: 'order-mgr',
      component: OrderMgr
    },
    {
      path: '/receivable-mgr',
      name: 'receivable-mgr',
      component: ReceivableMgr
    },
    {
      path: '/deliver-mgr',
      name: 'deliver-mgr',
      component: DeliverMgr
    },
    {
      path: '/invoice-mgr',
      name: 'invoice-mgr',
      component: InvoiceMgr
    },
    {
      path: '/balance-mgr',
      name: 'balance-mgr',
      component: BalanceMgr
    },
    {
      path: '/data-dir',
      name: 'data-dir',
      component: DataDir
    },
  ]
})
