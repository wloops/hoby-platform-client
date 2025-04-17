/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:52:25
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 10:52:51
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\relation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.relationManagement.title'),
      icon: 'solar:user-heart-broken',
      authority: ['my'],
    },
    name: 'MyRelationManagement',
    path: '/my/relation',
    children: [
      {
        meta: {
          title: $t('page.my.relationManagement.myCompanyCustomer'),
          icon: 'mdi:account-star-outline',
          authority: ['my'],
        },
        name: 'MyCompanyCustomer',
        path: '/my/relation/customer',
        component: () => import('#/views/my/relation/customer.vue'),
      },
      {
        meta: {
          title: $t('page.my.relationManagement.dealerSignedWithMe.title'),
          icon: 'mdi:account-details',
          authority: ['my'],
        },
        name: 'DealerSignedWithMe',
        path: '/my/relation/dealer',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.dealerSignedWithMe.myAuthSaleBusiness',
              ),
              icon: 'mdi:arrange-send-to-back',
              authority: ['my'],
            },
            name: 'MyAuthSaleBusiness',
            path: '/my/relation/dealer/auth-business',
            component: () =>
              import('#/views/my/relation/dealer/auth-business.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.dealerSignedWithMe.myAuthDealer',
              ),
              icon: 'mdi:account-details',
              authority: ['my'],
            },
            name: 'MyAuthDealer',
            path: '/my/relation/dealer/auth-dealer',
            component: () =>
              import('#/views/my/relation/dealer/auth-dealer.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.dealerSignedWithMe.myAuthProduct',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'MyAuthProduct',
            path: '/my/relation/dealer/auth-product',
            component: () =>
              import('#/views/my/relation/dealer/auth-product.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.dealerSignedWithMe.myAuthModel',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'MyAuthModel',
            path: '/my/relation/dealer/auth-model',
            component: () =>
              import('#/views/my/relation/dealer/auth-model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.dealerSignedWithMe.myAuthGoods',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'MyAuthGoods',
            path: '/my/relation/dealer/auth-goods',
            component: () =>
              import('#/views/my/relation/dealer/auth-goods.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.relationManagement.authFactoryForMeToSale.title'),
          icon: 'mdi:factory',
          authority: ['my'],
        },
        name: 'AuthFactoryForMeToSale',
        path: '/my/relation/factory',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMeToSale.authFactoryForMe',
              ),
              icon: 'mdi:factory',
              authority: ['my'],
            },
            name: 'AuthFactoryForMe',
            path: '/my/relation/factory/auth-factory',
            component: () =>
              import('#/views/my/relation/factory/auth-factory.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMeToSale.authProductCanSale',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'AuthProductCanSale',
            path: '/my/relation/factory/auth-product',
            component: () =>
              import('#/views/my/relation/factory/auth-product.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMeToSale.authModelCanSale',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'AuthModelCanSale',
            path: '/my/relation/factory/auth-model',
            component: () =>
              import('#/views/my/relation/factory/auth-model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMeToSale.authGoodsCanSale',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'AuthGoodsCanSale',
            path: '/my/relation/factory/auth-goods',
            component: () =>
              import('#/views/my/relation/factory/auth-goods.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.relationManagement.supplyAgreeISigned.title'),
          icon: 'mdi:receipt-text-arrow-right-outline',
          authority: ['my'],
        },
        name: 'SupplyAgreeISigned',
        path: '/my/relation/supply',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.supplyAgreeISigned.purchaserISigned',
              ),
              icon: 'mdi:account-arrow-left-outline',
              authority: ['my'],
            },
            name: 'PurchaserISigned',
            path: '/my/relation/supply/purchaser',
            component: () => import('#/views/my/relation/supply/purchaser.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.supplyAgreeISigned.agreeProductISupply',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'AgreeProductISupply',
            path: '/my/relation/supply/product',
            component: () => import('#/views/my/relation/supply/product.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.supplyAgreeISigned.agreeModelISupply',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'AgreeModelISupply',
            path: '/my/relation/supply/model',
            component: () => import('#/views/my/relation/supply/model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.supplyAgreeISigned.agreeGoodsISupply',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'AgreeGoodsISupply',
            path: '/my/relation/supply/goods',
            component: () => import('#/views/my/relation/supply/goods.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.relationManagement.purchaseAgreeISigned.title'),
          icon: 'mdi:receipt-text-arrow-left-outline',
          authority: ['my'],
        },
        name: 'PurchaseAgreeISigned',
        path: '/my/relation/purchase',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.purchaseAgreeISigned.supplierISigned',
              ),
              icon: 'mdi:account-arrow-right-outline',
              authority: ['my'],
            },
            name: 'SupplierISigned',
            path: '/my/relation/purchase/supplier',
            component: () =>
              import('#/views/my/relation/purchase/supplier.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.purchaseAgreeISigned.agreeProductIPurchase',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'AgreeProductIPurchase',
            path: '/my/relation/purchase/product',
            component: () => import('#/views/my/relation/purchase/product.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.purchaseAgreeISigned.agreeModelIPurchase',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'AgreeModelIPurchase',
            path: '/my/relation/purchase/model',
            component: () => import('#/views/my/relation/purchase/model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.purchaseAgreeISigned.agreeGoodsIPurchase',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'AgreeGoodsIPurchase',
            path: '/my/relation/purchase/goods',
            component: () => import('#/views/my/relation/purchase/goods.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.relationManagement.wareMertsAuthByMe.title'),
          icon: 'mdi:account-multiple-check-outline',
          authority: ['my'],
        },
        name: 'WareMertsAuthByMe',
        path: '/my/relation/iauth-waremert',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.wareMertsAuthByMe.wareMertListAuthByMe',
              ),
              icon: 'mdi:account-card',
              authority: ['my'],
            },
            name: 'WareMertListAuthByMe',
            path: '/my/relation/iauth-waremert/waremerts',
            component: () =>
              import('#/views/my/relation/iauth-waremert/waremerts.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.wareMertsAuthByMe.warehouseListAuthByMe',
              ),
              icon: 'mdi:warehouse',
              authority: ['my'],
            },
            name: 'WarehouseListAuthByMe',
            path: '/my/relation/iauth-waremert/warehouses',
            component: () =>
              import('#/views/my/relation/iauth-waremert/warehouses.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.wareMertsAuthByMe.iAuthGoodsManage.title',
              ),
              icon: 'mdi:file-table-box-multiple-outline',
              authority: ['my'],
            },
            name: 'IAuthGoodsManage',
            path: '/my/relation/iauth-waremert/goodsmng',
            children: [
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthGoodsManage.authWareMertProduct',
                  ),
                  icon: 'solar:box-minimalistic-outline',
                  authority: ['my'],
                },
                name: 'AuthWareMertProduct',
                path: '/my/relation/iauth-waremert/goodsmng/product',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/goodsmng/product.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthGoodsManage.authWareMertModel',
                  ),
                  icon: 'mdi:animation-outline',
                  authority: ['my'],
                },
                name: 'AuthWareMertModel',
                path: '/my/relation/iauth-waremert/goodsmng/model',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/goodsmng/model.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthGoodsManage.authWareMertGoods',
                  ),
                  icon: 'mdi:view-module-outline',
                  authority: ['my'],
                },
                name: 'AuthWareMertGoods',
                path: '/my/relation/iauth-waremert/goodsmng/goods',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/goodsmng/goods.vue'
                  ),
              },
            ],
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.wareMertsAuthByMe.iAuthStockManage.title',
              ),
              icon: 'mdi:home-search-outline',
              authority: ['my'],
            },
            name: 'IAuthStockManage',
            path: '/my/relation/iauth-waremert/stockmng',
            children: [
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthStockManage.iAuthStockProduct',
                  ),
                  icon: 'solar:box-minimalistic-outline',
                  authority: ['my'],
                },
                name: 'IAuthStockProduct',
                path: '/my/relation/iauth-waremert/stockmng/product',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/stockmng/product.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthStockManage.iAuthStockModel',
                  ),
                  icon: 'mdi:animation-outline',
                  authority: ['my'],
                },
                name: 'IAuthStockModel',
                path: '/my/relation/iauth-waremert/stockmng/model',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/stockmng/model.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.wareMertsAuthByMe.iAuthStockManage.iAuthStockGoods',
                  ),
                  icon: 'mdi:view-module-outline',
                  authority: ['my'],
                },
                name: 'IAuthStockGoods',
                path: '/my/relation/iauth-waremert/stockmng/goods',
                component: () =>
                  import(
                    '#/views/my/relation/iauth-waremert/stockmng/goods.vue'
                  ),
              },
            ],
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.relationManagement.authFactoryForMe.title'),
          icon: 'mdi:invoice-text-outline',
          authority: ['my'],
        },
        name: 'AuthFactoryForMe',
        path: '/my/relation/authme-factory',
        children: [
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMe.factoryListAuthForMe',
              ),
              icon: 'mdi:factory',
              authority: ['my'],
            },
            name: 'FactoryListAuthForMe',
            path: '/my/relation/authme-factory/factories',
            component: () =>
              import('#/views/my/relation/authme-factory/factories.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMe.warehouseListAuthForMe',
              ),
              icon: 'mdi:warehouse',
              authority: ['my'],
            },
            name: 'WarehouseListAuthForMe',
            path: '/my/relation/authme-factory/warehouses',
            component: () =>
              import('#/views/my/relation/authme-factory/warehouses.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMe.goodsAuthForMeManage.title',
              ),
              icon: 'mdi:file-table-box-multiple-outline',
              authority: ['my'],
            },
            name: 'GoodsAuthForMeManage',
            path: '/my/relation/authme-factory/goodsmng',
            children: [
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.goodsAuthForMeManage.authMeStorageProduct',
                  ),
                  icon: 'solar:box-minimalistic-outline',
                  authority: ['my'],
                },
                name: 'AuthMeStorageProduct',
                path: '/my/relation/authme-factory/goodsmng/product',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/goodsmng/product.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.goodsAuthForMeManage.authMeStorageModel',
                  ),
                  icon: 'mdi:animation-outline',
                  authority: ['my'],
                },
                name: 'authMeStorageModel',
                path: '/my/relation/authme-factory/goodsmng/model',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/goodsmng/model.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.goodsAuthForMeManage.authMeStorageGoods',
                  ),
                  icon: 'mdi:view-module-outline',
                  authority: ['my'],
                },
                name: 'AuthMeStorageGoods',
                path: '/my/relation/authme-factory/goodsmng/goods',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/goodsmng/goods.vue'
                  ),
              },
            ],
          },
          {
            meta: {
              title: $t(
                'page.my.relationManagement.authFactoryForMe.stockAuthForMeManage.title',
              ),
              icon: 'mdi:home-search-outline',
              authority: ['my'],
            },
            name: 'StockAuthForMeManage',
            path: '/my/relation/authme-factory/stockmng',
            children: [
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.stockAuthForMeManage.authMeWarehouseProduct',
                  ),
                  icon: 'solar:box-minimalistic-outline',
                  authority: ['my'],
                },
                name: 'AuthMeWarehouseProduct',
                path: '/my/relation/authme-factory/stockmng/product',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/stockmng/product.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.stockAuthForMeManage.authMeWarehouseModel',
                  ),
                  icon: 'mdi:animation-outline',
                  authority: ['my'],
                },
                name: 'AuthMeWarehouseModel',
                path: '/my/relation/authme-factory/stockmng/model',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/stockmng/model.vue'
                  ),
              },
              {
                meta: {
                  title: $t(
                    'page.my.relationManagement.authFactoryForMe.stockAuthForMeManage.authMeWarehouseGoods',
                  ),
                  icon: 'mdi:view-module-outline',
                  authority: ['my'],
                },
                name: 'AuthMeWarehouseGoods',
                path: '/my/relation/authme-factory/stockmng/goods',
                component: () =>
                  import(
                    '#/views/my/relation/authme-factory/stockmng/goods.vue'
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
