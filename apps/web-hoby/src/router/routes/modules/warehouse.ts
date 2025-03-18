/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-18 10:30:43
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\warehouse.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.warehouse.myPrivateWarehouse.title'),
      authority: ['warehouse'],
      icon: 'mdi:home-lock',
    },
    name: 'PrivateWarehouse',
    path: '/warehouse/private',
    children: [
      {
        meta: {
          title: $t('page.warehouse.myPrivateWarehouse.management.title'),
          authority: ['warehouse'],
        },
        name: 'PrivateWarehouseManagement',
        path: '/warehouse/private/management',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.warehouseType',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseType',
            path: '/warehouse/private/management/type',
            component: () =>
              import('#/views/warehouse/private/management/type.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.warehouseSKU',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseSKU',
            path: '/warehouse/private/management/sku',
            component: () =>
              import('#/views/warehouse/private/management/sku.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.warehouseBatch',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseBatch',
            path: '/warehouse/private/management/batch',
            component: () =>
              import('#/views/warehouse/private/management/batch.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.batchGoods',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseBatchGoods',
            path: '/warehouse/private/management/batch-goods',
            component: () =>
              import('#/views/warehouse/private/management/batch-goods.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.purchaseOrder',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehousePurchaseOrder',
            path: '/warehouse/private/management/purchase-order',
            component: () =>
              import('#/views/warehouse/private/management/purchase-order.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.storageIn',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseStorageIn',
            path: '/warehouse/private/management/storage-in-store',
            component: () =>
              import(
                '#/views/warehouse/private/management/storage-in-store.vue'
              ),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.storageOut',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseStorageOut',
            path: '/warehouse/private/management/storage-out',
            component: () =>
              import('#/views/warehouse/private/management/storage-out.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.storageTransfer',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseStorageTransfer',
            path: '/warehouse/private/management/storage-in',
            component: () =>
              import('#/views/warehouse/private/management/storage-in.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.storageBatch',
                ``,
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseStorageBatch',
            path: '/warehouse/private/management/storage-sheet',
            component: () =>
              import('#/views/warehouse/private/management/storage-sheet.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.warehouse.myPrivateWarehouse.generalLedger.title'),
          authority: ['warehouse'],
        },
        name: 'PrivateWarehouseGeneralLedger',
        path: '/warehouse/private/general-ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.openWarehouseService',
              ),
              authority: ['warehouse'],
            },
            name: 'OpenWarehouseService',
            path: '/warehouse/private/general-ledger/service',
            component: () =>
              import('#/views/warehouse/private/general-ledger/service.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.storageCatalog',
              ),
              authority: ['warehouse'],
            },
            name: 'StorageCatalog',
            path: '/warehouse/private/general-ledger/catalog',
            component: () =>
              import('#/views/warehouse/private/general-ledger/catalog.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.warehouseTypeLog',
              ),
              authority: ['warehouse'],
            },
            name: 'WarehouseTypeLog',
            path: '/warehouse/private/general-ledger/type',
            component: () =>
              import('#/views/warehouse/private/general-ledger/type.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.warehouseSKULog',
              ),
              authority: ['warehouse'],
            },
            name: 'WarehouseSKULog',
            path: '/warehouse/private/general-ledger/sku',
            component: () =>
              import('#/views/warehouse/private/general-ledger/sku.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.warehouse.myPrivateWarehouse.warehouseLedger.title'),
          authority: ['warehouse'],
        },
        name: 'PrivateWarehouseLedger',
        path: '/warehouse/private/ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.openPrivateWarehouse',
              ),
              authority: ['warehouse'],
            },
            name: 'OpenPrivateWarehouse',
            path: '/warehouse/private/ledger/open',
            component: () =>
              import('#/views/warehouse/private/ledger/open.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.productList',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseProductList',
            path: '/warehouse/private/ledger/products',
            component: () =>
              import('#/views/warehouse/private/ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.typeList',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseTypeList',
            path: '/warehouse/private/ledger/types',
            component: () =>
              import('#/views/warehouse/private/ledger/types.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.skuList',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseSKUList',
            path: '/warehouse/private/ledger/sku',
            component: () => import('#/views/warehouse/private/ledger/sku.vue'),
          },
        ],
      },
    ],
  },
  {
    meta: {
      title: $t('page.warehouse.myBranchWarehouse.title'),
      authority: ['warehouse'],
      icon: 'mdi:home-floor-1',
    },
    name: 'MyBranchWarehouse',
    path: '/warehouse/branch',
    children: [
      {
        meta: {
          title: $t('page.warehouse.myBranchWarehouse.generalLedger.title'),
          authority: ['warehouse'],
        },
        name: 'MyBranchWarehouseGeneralLedger',
        path: '/warehouse/branch/general-ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.generalLedger.branchService',
              ),
              authority: ['warehouse'],
            },
            name: 'BranchProtocol',
            path: '/warehouse/branch/general-ledger/protocol',
            component: () =>
              import('#/views/warehouse/branch/general-ledger/protocol.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.generalLedger.branchProducts',
              ),
              authority: ['warehouse'],
            },
            name: 'BranchProducts',
            path: '/warehouse/branch/general-ledger/products',
            component: () =>
              import('#/views/warehouse/branch/general-ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.generalLedger.branchTypes',
              ),
              authority: ['warehouse'],
            },
            name: 'BranchType',
            path: '/warehouse/branch/general-ledger/type',
            component: () =>
              import('#/views/warehouse/branch/general-ledger/type.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.generalLedger.branchSKU',
              ),
              authority: ['warehouse'],
            },
            name: 'BranchSKU',
            path: '/warehouse/branch/general-ledger/sku',
            component: () =>
              import('#/views/warehouse/branch/general-ledger/sku.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.warehouse.myBranchWarehouse.warehouseLedger.title'),
          authority: ['warehouse'],
        },
        name: 'BranchWarehouseLedger',
        path: '/warehouse/branch/ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.warehouseLedger.consultedWarehouse',
              ),
              authority: ['warehouse'],
            },
            name: 'ConsultedWarehouse',
            path: '/warehouse/branch/ledger/warehouse',
            component: () =>
              import('#/views/warehouse/branch/ledger/warehouse.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.warehouseLedger.consultedProducts',
              ),
              authority: ['warehouse'],
            },
            name: 'ConsultedProducts',
            path: '/warehouse/branch/ledger/products',
            component: () =>
              import('#/views/warehouse/branch/ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.warehouseLedger.consultedTypes',
              ),
              authority: ['warehouse'],
            },
            name: 'ConsultedType',
            path: '/warehouse/branch/ledger/type',
            component: () => import('#/views/warehouse/branch/ledger/type.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myBranchWarehouse.warehouseLedger.consultedSKU',
              ),
              authority: ['warehouse'],
            },
            name: 'ConsultedSKU',
            path: '/warehouse/branch/ledger/sku',
            component: () => import('#/views/warehouse/branch/ledger/sku.vue'),
          },
        ],
      },
    ],
  },
  {
    meta: {
      title: $t('page.warehouse.myWarehouse.title'),
      authority: ['warehouse'],
      icon: 'mdi:home-group',
    },
    name: 'WarehouseInfo',
    path: '/warehouse/info',
    children: [
      {
        meta: {
          title: $t('page.warehouse.myWarehouse.info'),
          authority: ['warehouse'],
        },
        name: 'WarehouseInfoManagement',
        path: '/warehouse/info/management',
        component: () => import('#/views/warehouse/info/management.vue'),
      },
      {
        meta: {
          title: $t('page.warehouse.myWarehouse.shelf'),
          authority: ['warehouse'],
        },
        name: 'WarehouseShelf',
        path: '/warehouse/info/shelf',
        component: () => import('#/views/warehouse/info/shelf.vue'),
      },
      {
        meta: {
          title: $t('page.warehouse.myWarehouse.deficit'),
          authority: ['warehouse'],
        },
        name: 'WarehouseDeficit',
        path: '/warehouse/info/deficit',
        component: () => import('#/views/warehouse/info/deficit.vue'),
      },
    ],
  },
];

export default routes;
