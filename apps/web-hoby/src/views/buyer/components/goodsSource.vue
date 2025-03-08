<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-07 17:21:26
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-07 18:16:24
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\components\goodsSource.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { TableColumnType } from 'ant-design-vue';
import type { AlignType } from 'ant-design-vue/es/vc-table/interface';

import { h, ref } from 'vue';

import { Button, Drawer, InputNumber, Table } from 'ant-design-vue';

interface ProductDetail {
  name: string;
  image: string;
  specs: string[];
  brand: string;
  category: string;
}

interface SourceItem {
  id: string;
  store: string;
  price: number;
  stock: number;
  delivery: string;
  address: string;
}

interface SelectedSource {
  source: SourceItem;
  quantity: number;
}

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
});

const handleSelect = (record: SourceItem) => {
  // 检查是否已经选择了该货源
  if (selectedSources.value.some((item) => item.source.id === record.id)) {
    return;
  }
  selectedSources.value.push({
    source: record,
    quantity: 1,
  });
};

const handleRemoveSource = (sourceId: string) => {
  selectedSources.value = selectedSources.value.filter(
    (item) => item.source.id !== sourceId,
  );
};

const columns: TableColumnType<SourceItem>[] = [
  {
    title: '店铺',
    dataIndex: 'store',
    width: 150,
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
    title: '发货',
    dataIndex: 'delivery',
    width: 120,
  },
  {
    title: '发货地',
    dataIndex: 'address',
    width: 180,
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
        () => '采购',
      ),
  },
];

const dataSource = ref<SourceItem[]>([
  {
    id: '1',
    store: '美的官方旗舰店',
    price: 2999,
    stock: 100,
    delivery: '24小时内',
    address: '广东省佛山市顺德区',
  },
  {
    id: '2',
    store: '格力官方旗舰店',
    price: 3199,
    stock: 50,
    delivery: '48小时内',
    address: '广东省珠海市香洲区',
  },
  {
    id: '3',
    store: '海尔官方旗舰店',
    price: 3099,
    stock: 80,
    delivery: '24小时内',
    address: '山东省青岛市崂山区',
  },
]);

const close = () => {
  visible.value = false;
  selectedSources.value = [];
};

const handleOk = () => {
  if (selectedSources.value.length === 0) {
    return;
  }
  // TODO: 处理确认选择逻辑
  console.warn('采购成功', selectedSources.value);
  close();
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
      <div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div class="flex items-start gap-4">
          <img
            :src="productDetail.image"
            :alt="productDetail.name"
            class="h-24 w-24 rounded-lg object-cover"
          />
          <div class="flex flex-1 flex-col gap-2">
            <div class="text-lg font-medium">{{ productDetail.name }}</div>
            <div class="flex items-center gap-2 text-gray-500">
              <span>品牌：{{ productDetail.brand }}</span>
              <span class="text-gray-300">|</span>
              <span>品类：{{ productDetail.category }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="spec in productDetail.specs"
                :key="spec"
                class="rounded bg-white px-2 py-1 text-sm text-gray-600"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 已选货源列表 -->
      <div v-if="selectedSources.length > 0" class="mb-4 space-y-2">
        <div
          v-for="item in selectedSources"
          :key="item.source.id"
          class="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"
        >
          <div class="flex items-center gap-4">
            <span class="font-medium">{{ item.source.store }}</span>
            <span class="text-gray-500">|</span>
            <span class="text-red-500"
              >¥{{ item.source.price.toFixed(2) }}</span
            >
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">采购数量：</span>
              <InputNumber
                v-model:value="item.quantity"
                :min="1"
                :max="item.source.stock"
                :precision="0"
                style="width: 120px"
              />
            </div>
            <Button type="link" @click="handleRemoveSource(item.source.id)">
              取消
            </Button>
          </div>
        </div>
      </div>

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
        <Button
          type="primary"
          :disabled="selectedSources.length === 0"
          @click="handleOk"
        >
          确定采购
        </Button>
      </div>
    </div>
  </Drawer>
</template>

<style lang="scss" scoped>
:deep(.ant-table-wrapper) {
  .ant-table-cell {
    padding: 12px 16px !important;
  }
}
</style>
