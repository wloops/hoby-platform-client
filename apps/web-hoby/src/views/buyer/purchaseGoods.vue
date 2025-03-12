<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-06 16:00:00
 * @Description: 待进货商品页面
-->
<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Dayjs } from 'dayjs';

import { computed, h, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, DatePicker, Form, Input, Table, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useEnums, useMainGetData } from '#/composables';

interface OrderItem {
  id: string; // 唯一ID
  orderNo: string; // 销售订单号
  purchaseUnit: string; // 采购单位
  quantity: number; // 商品数量
  totalPrice: number; // 销售总价
  productCategoryList: string[]; // 产品品类清单
  productModelList: string[]; // 产品型号清单
  date: string; // 日期
  status: string; // 状态
}

interface SearchForm {
  orderNo: string;
  purchaseUnit: string;
  productCategory: string;
  date: Dayjs | undefined;
}

const router = useRouter();
const loading = ref(false);
const dataSource = ref<OrderItem[]>([]);
const { getEnumLabel, getEnumColor } = useEnums();

// 搜索表单
const searchForm = ref<SearchForm>({
  orderNo: '',
  purchaseUnit: '',
  productCategory: '',
  date: undefined,
});

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns: ColumnsType<OrderItem> = [
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    align: 'center',
    width: 180,
    ellipsis: true,
  },
  {
    title: '采购单位',
    dataIndex: 'purchaseUnit',
    align: 'center',
    width: 180,
    ellipsis: true,
  },
  {
    title: '商品数量',
    dataIndex: 'quantity',
    width: 120,
    align: 'center',
  },
  {
    title: '销售总价',
    dataIndex: 'totalPrice',
    width: 180,
    align: 'right',
    customRender: ({ text }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '产品品类清单',
    dataIndex: 'productCategoryList',
    width: 180,
    align: 'center',
    ellipsis: true,
    customRender: ({ text }) => text.join('、'),
  },
  {
    title: '产品型号清单',
    dataIndex: 'productModelList',
    width: 180,
    align: 'center',
    ellipsis: true,
    customRender: ({ text }) => text.join('、'),
  },
  {
    title: '日期',
    dataIndex: 'date',
    width: 120,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return h(Tag, { color: getEnumColor('restockingStatus', text) }, () =>
        getEnumLabel('restockingStatus', text),
      );
    },
  },
  {
    title: '操作',
    width: 120,
    fixed: 'right',
    align: 'center',
    customRender: ({ record }) => {
      return h(
        Button,
        {
          type: 'link',
          onClick: () => viewGoods(record),
        },
        () => '待进货商品',
      );
    },
  },
];

// 表格滚动配置
const scroll = computed(() => ({
  y: 'calc(100vh - 300px)',
}));

// 查看待进货商品
function viewGoods(row: OrderItem) {
  router.push({
    name: 'BuyerOrderProduct',
    query: { id: row.orderNo, unit: row.purchaseUnit },
  });
}

// 处理表格变化
const handleTableChange = async (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  await fetchOrderList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    orderNo: '',
    purchaseUnit: '',
    productCategory: '',
    date: undefined,
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  pagination.value.current = 1;
  fetchOrderList();
};

// 获取订单列表数据
async function fetchOrderList() {
  loading.value = true;
  try {
    const { current, pageSize } = pagination.value;
    const reqParams = {
      pageID: 'mySaleOrderForRestockingPage',
      pageDataGrpID: 'mySaleOrderForRestocking',
      currentPage: current,
      numOfPerPage: pageSize,
    };
    const { data, total } = useMainGetData(reqParams);

    // 监听 data 的变化
    watch(data, (newData) => {
      if (newData) {
        // 将原始数据转换为目标格式
        const response = {
          items: (newData as any[]).map((item: any, index: number) => ({
            id: `${111 + index}`, // 生成唯一 ID
            orderNo: item.billNo, // 销售订单号
            purchaseUnit: item.purchaseCompanyName, // 采购单位
            quantity: Number.parseInt(item.saleOrderPrdNum, 10), // 商品数量
            totalPrice: Number.parseFloat(item.totalAmtAfterDiscount), // 销售总价
            productCategoryList: item.prdTypeList.split(','), // 产品品类清单
            productModelList: item.prdSrlIDList.split(','), // 产品型号清单
            date: dayjs(item.transDate).format('YYYY-MM-DD'), // 日期
            status: item.restockingStatus, // 状态
          })),
          total: total.value, // 总条数
        };

        // 更新数据源和分页信息
        dataSource.value = response.items;
        pagination.value.total = response.total;
      }
    });
  } finally {
    loading.value = false;
  }
}

// 初始加载
onMounted(async () => {
  await fetchOrderList();
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col overflow-hidden">
      <!-- 搜索区域 -->
      <div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <Form layout="inline" :model="searchForm">
          <Form.Item label="销售订单号">
            <Input
              v-model:value="searchForm.orderNo"
              placeholder="请输入销售订单号"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="采购单位">
            <Input
              v-model:value="searchForm.purchaseUnit"
              placeholder="请输入采购单位"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="产品品类">
            <Input
              v-model:value="searchForm.productCategory"
              placeholder="请输入产品品类"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="日期">
            <DatePicker
              v-model:value="searchForm.date"
              placeholder="请选择日期"
              style="width: 200px"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" @click="handleSearch">查询</Button>
            <Button class="ml-2" @click="resetSearch">重置</Button>
          </Form.Item>
        </Form>
      </div>

      <!-- 表格区域 -->
      <div class="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          :scroll="scroll"
          bordered
          size="middle"
          row-key="id"
          @change="handleTableChange"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped>
:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.ant-table) {
  flex: 1;
  overflow: hidden;
}

:deep(.ant-table-container) {
  height: 100%;
}

:deep(.ant-table-body) {
  height: calc(100% - 55px) !important;
}

:deep(.ant-pagination) {
  margin: 16px !important;
}

:deep(.ant-form-inline .ant-form-item) {
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>
