/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-19 10:42:46
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
    path: '/warehouse',
    children: [
      {
        meta: {
          title: $t('page.warehouse.myPrivateWarehouse.management.title'),
          authority: ['warehouse'],
          icon: 'mdi:animation',
        },
        name: 'PrivateWarehouseManagement',
        path: '/warehouse/private/management',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.management.warehouseModel',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseModel',
            path: '/warehouse/private/management/model',
            component: () =>
              import('#/views/warehouse/private/management/model.vue'),
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
          icon: 'solar:bill-list-bold',
        },
        name: 'PrivateWarehouseGeneralLedger',
        path: '/warehouse/private/general-ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.openWarehouse',
              ),
              authority: ['warehouse'],
            },
            name: 'OpenWarehouse',
            path: '/warehouse/private/general-ledger/open',
            component: () =>
              import('#/views/warehouse/private/general-ledger/open.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.storageProduct',
              ),
              authority: ['warehouse'],
            },
            name: 'StorageProducts',
            path: '/warehouse/private/general-ledger/products',
            component: () =>
              import('#/views/warehouse/private/general-ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.storageModel',
              ),
              authority: ['warehouse'],
            },
            name: 'StorageModel',
            path: '/warehouse/private/general-ledger/model',
            component: () =>
              import('#/views/warehouse/private/general-ledger/model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.generalLedger.storageSKU',
              ),
              authority: ['warehouse'],
            },
            name: 'StorageSKU',
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
          icon: 'solar:bill-list-broken',
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
            name: 'PrivateWarehouseLedgerOpenPrivateWarehouse',
            path: '/warehouse/private/ledger/open',
            component: () =>
              import('#/views/warehouse/private/ledger/open.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.storageProduct',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseLedgerStorageProduct',
            path: '/warehouse/private/ledger/products',
            component: () =>
              import('#/views/warehouse/private/ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.storageModel',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseLedgerStorageModel',
            path: '/warehouse/private/ledger/model',
            component: () =>
              import('#/views/warehouse/private/ledger/model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.warehouse.myPrivateWarehouse.warehouseLedger.storageSKU',
              ),
              authority: ['warehouse'],
            },
            name: 'PrivateWarehouseLedgerStorageSKU',
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
          icon: 'solar:bill-list-bold',
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
                'page.warehouse.myBranchWarehouse.generalLedger.branchModel',
              ),
              authority: ['warehouse'],
            },
            name: 'BranchModel',
            path: '/warehouse/branch/general-ledger/model',
            component: () =>
              import('#/views/warehouse/branch/general-ledger/model.vue'),
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
          icon: 'solar:bill-list-broken',
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
                'page.warehouse.myBranchWarehouse.warehouseLedger.consultedModel',
              ),
              authority: ['warehouse'],
            },
            name: 'ConsultedModel',
            path: '/warehouse/branch/ledger/model',
            component: () =>
              import('#/views/warehouse/branch/ledger/model.vue'),
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
          icon: 'solar:info-square-bold-duotone',
        },
        name: 'WarehouseInfoManagement',
        path: '/warehouse/info/management',
        component: () => import('#/views/warehouse/info/management.vue'),
      },
      {
        meta: {
          title: $t('page.warehouse.myWarehouse.shelf'),
          authority: ['warehouse'],
          icon: 'solar:bedside-table-linear',
        },
        name: 'WarehouseShelf',
        path: '/warehouse/info/shelf',
        component: () => import('#/views/warehouse/info/shelf.vue'),
      },
      {
        meta: {
          title: $t('page.warehouse.myWarehouse.deficit'),
          authority: ['warehouse'],
          icon: 'solar:home-smile-bold-duotone',
        },
        name: 'WarehouseDeficit',
        path: '/warehouse/info/deficit',
        component: () => import('#/views/warehouse/info/deficit.vue'),
      },
    ],
  },
];

export default routes;
