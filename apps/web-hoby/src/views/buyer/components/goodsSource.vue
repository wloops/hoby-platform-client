<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 15:14:28
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-14 14:23:19
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
import { useRoute } from 'vue-router';

import { Button, Drawer, Form, Input, Space, Table } from 'ant-design-vue';

import { useMainGetData } from '#/composables';

import ProductInfo from './ProductInfo.vue';
import PurchaseModal from './PurchaseModal.vue';

interface SelectedSource {
  source: SourceItem;
  quantity: number;
}

const route = useRoute();
const productInfoRef = ref();
const purchaseModalRef = ref();
const visible = ref(false);
const loading = ref(false);
const selectedSources = ref<SelectedSource[]>([]);

const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const formState = ref({
  store: '',
  warehouse: '',
  minPrice: '',
  maxPrice: '',
});

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
  restockingNum: 0,
  restockingNumStill: 0,
  restockingNumReady: 0,
  record: {},
});

const handleSelect = (record: SourceItem) => {
  record.restockingNum = productDetail.value.restockingNum;
  record.restockingNumStill = productDetail.value.restockingNumStill;
  if (selectedSources.value.some((item) => item.source.id === record.id)) {
    return;
  }
  const result = {
    ...record,
    billNo: productDetail.value?.record.billNo,
    orderDtlNo: productDetail.value?.record.orderDtlNo,
    purchaseCompanyName: productDetail.value?.record.purchaseCompanyName,
  };
  purchaseModalRef.value?.open(result);
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
    customRender: ({ text }: { text: number }) => text,
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

// 获取订单列表数据
async function fetchList(record: any) {
  loading.value = true;
  try {
    // TODO: 替换为实际的API调用
    // const { current, pageSize } = pagination.value;
    const { current, pageSize } = pagination.value;
    const reqParams = {
      pageID: 'sourceOfGoodsShowPage',
      pageDataGrpID: 'sourceOfMySaleOrderGoods',
      currentPage: current,
      numOfPerPage: pageSize,
      companyName: record.companyName,
      productName: record.productName,
      srlID: record.srlID,
      wareAttrValueList: record.wareAttrValueList,
    };
    const { data, total } = await useMainGetData(reqParams);
    console.warn('data', data.value);
    // 将原始数据转换为目标格式
    const response = {
      items: (data.value as any[]).map((item: any, index: number) => ({
        id: `${index + 1}`, // 生成唯一 ID
        store: item.saleCmpName,
        price: item.priceAfterDiscount,
        stock: item.avaNum,
        warehouse: item.wareName,
        record: item,
      })),
      total: total.value, // 总条数
    };

    // 更新数据源和分页信息
    dataSource.value = response.items;
    pagination.value.total = response.total;
  } finally {
    loading.value = false;
  }
}

const close = () => {
  visible.value = false;
  selectedSources.value = [];
};

const handleSearch = () => {
  pagination.value.current = 1;
  console.warn('formState', formState.value);
};

const handleReset = () => {
  formState.value = {
    store: '',
    warehouse: '',
    minPrice: '',
    maxPrice: '',
  };
  handleSearch();
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchList(productDetail.value);
};

defineExpose({
  open: (row: any) => {
    visible.value = true;
    console.warn('goodsSource', row, route.query.id);
    productDetail.value = {
      ...row,
      orderNo: route.query.id,
      purchaseUnit: route.query.unit,
      product: row.record.productName,
      model: row.record.srlID,
      sku: row.record.wareAttrValueList,
      quantity: row.record.restockingNumNeeded,
      requiredQuantity: row.record.prdNum,
    };

    // 初始加载
    fetchList(row.record);
  },
});

// 价格输入验证
// const validatePrice = (value: string) => {
//   if (value === '') return true;
//   const num = Number(value);
//   return !isNaN(num) && num >= 0;
// };
</script>

<template>
  <Drawer
    v-model:visible="visible"
    title="选择货源"
    width="50%"
    :footer-style="{ textAlign: 'right' }"
    @close="close"
  >
    <div class="flex h-full flex-col">
      <!-- 商品信息区域 -->
      <ProductInfo ref="productInfoRef" :data="productDetail" class="mb-6" />

      <!-- 搜索表单 -->
      <Form layout="inline" :model="formState" class="mb-4">
        <Form-item label="仓商名称" class="flex-grom-1 m-1 ml-0">
          <Input
            v-model:value="formState.store"
            placeholder="请输入仓商名称"
            allow-clear
          />
        </Form-item>
        <Form-item label="仓库名称" class="m-1 ml-0 flex-grow-0">
          <Input
            v-model:value="formState.warehouse"
            placeholder="请输入仓库名称"
            allow-clear
          />
        </Form-item>
        <Form-item label="价格区间" class="m-1 ml-0 flex-grow-0">
          <Space :size="8">
            <Input
              v-model:value="formState.minPrice"
              placeholder="最小价格"
              style="width: 100px"
              allow-clear
            />
            <span>-</span>
            <Input
              v-model:value="formState.maxPrice"
              placeholder="最大价格"
              style="width: 100px"
              allow-clear
            />
          </Space>
        </Form-item>
        <Form-item class="m-1 ml-0 flex-grow-0">
          <Space :size="8">
            <Button type="primary" @click="handleSearch">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </Space>
        </Form-item>
      </Form>

      <!-- 货源列表 -->
      <div class="flex-1">
        <Table
          :columns="columns"
          :data-source="dataSource"
          :pagination="{
            ...pagination,
            size: 'small',
          }"
          :row-key="(record: SourceItem) => record.id"
          :loading="loading"
          bordered
          @change="handleTableChange"
        />
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button @click="close">取消</Button>
      </div>
    </div>
    <PurchaseModal ref="purchaseModalRef" :data="productDetail" />
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

:deep(.ant-form) {
  .ant-form-item {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}

:deep(.ant-pagination) {
  &.mini {
    .ant-pagination-item,
    .ant-pagination-prev,
    .ant-pagination-next {
      min-width: 24px;
      height: 24px;
      line-height: 22px;
    }
  }
}
</style>
