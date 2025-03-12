<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 15:14:28
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-12 14:42:31
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\components\goodsSource.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-07 17:21:26
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-09 15:47:03
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\components\goodsSource.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { TableColumnType } from 'ant-design-vue';
import type { AlignType } from 'ant-design-vue/es/vc-table/interface';

import type { ProductDetail, SourceItem } from './types';

import { h, ref } from 'vue';

import { Button, Drawer, Table } from 'ant-design-vue';

import ProductInfo from './ProductInfo.vue';
import PurchaseModal from './PurchaseModal.vue';

interface SelectedSource {
  source: SourceItem;
  quantity: number;
}

const productInfoRef = ref();
const purchaseModalRef = ref();
const visible = ref(false);
const selectedSources = ref<SelectedSource[]>([]);

// 模拟商品详情数据
const productDetail = ref<ProductDetail>({
  name: '美的空调 1.5匹 变频冷暖',
  image:
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  specs: ['1.5匹', '变频', '冷暖', '壁挂式'],
  brand: '美的',
  category: '空调',
  purchaseUnit: '湖南省长沙市第一中学',
  manufacturer: '皮尔卡丹',
  model: '圆领文化衫',
  sku: 'L 白色',
  unitPrice: 400,
  totalPrice: 40_000,
  quantity: 100,
  requiredQuantity: 100,
  orderNo: '147524081311232011',
  product: '男士T恤衫',
});

const handleSelect = (record: SourceItem) => {
  if (selectedSources.value.some((item) => item.source.id === record.id)) {
    return;
  }
  purchaseModalRef.value?.open(record);
};

const columns: TableColumnType<SourceItem>[] = [
  {
    title: '仓商',
    dataIndex: 'store',
    width: 150,
  },
  {
    title: '仓商仓库',
    dataIndex: 'warehouse',
    width: 120,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 120,
    align: 'right' as AlignType,
    customRender: ({ text }: { text: number }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    width: 100,
    align: 'center' as AlignType,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center' as AlignType,
    fixed: 'right' as const,
    customRender: ({ record }) =>
      h(
        Button,
        {
          disabled:
            record.stock <= 0 ||
            selectedSources.value.some((item) => item.source.id === record.id),
          type: 'link',
          onClick: () => handleSelect(record),
        },
        () => '确定采购',
      ),
  },
];

const dataSource = ref<SourceItem[]>([
  {
    id: '1',
    store: '美的官方旗舰店',
    price: 2999,
    stock: 100,
    warehouse: '美的广州仓',
  },
  {
    id: '2',
    store: '格力官方旗舰店',
    price: 3199,
    stock: 50,
    warehouse: '格力珠海仓',
  },
  {
    id: '3',
    store: '海尔官方旗舰店',
    price: 3099,
    stock: 80,
    warehouse: '海尔青岛仓',
  },
]);

const close = () => {
  visible.value = false;
  selectedSources.value = [];
};

defineExpose({
  open: () => {
    visible.value = true;
  },
});
</script>

<template>
  <Drawer
    v-model:visible="visible"
    title="选择货源"
    width="800"
    :footer-style="{ textAlign: 'right' }"
    @close="close"
  >
    <div class="flex h-full flex-col">
      <!-- 商品信息区域 -->
      <ProductInfo ref="productInfoRef" :data="productDetail" class="mb-6" />

      <!-- 货源列表 -->
      <div class="flex-1">
        <Table
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          :row-key="(record: SourceItem) => record.id"
          bordered
        />
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button @click="close">取消</Button>
      </div>
    </div>
    <PurchaseModal ref="purchaseModalRef" :data="productDetail" />
    />
  </Drawer>
</template>

<style lang="scss" scoped>
:deep(.ant-table-wrapper) {
  .ant-table-cell {
    padding: 12px 16px !important;
  }
}

:deep(.ant-modal-body) {
  padding: 24px;
}
</style>
