<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 17:24:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-09 13:38:54
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\settlement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table';

import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Form, Input, Table } from 'ant-design-vue';

interface MySKUItem {
  id: string;
  product: string;
  srlID: string;
  skuValue: string;
  allSKU: string;
  distributionPrice: number;
  terminalPrice: number;
  totalInventory: number;
  soldQuantity: number;
  divisionRules: string;
}

interface SearchForm {
  product: string;
  srlID: string;
  skuValue: string;
}

const router = useRouter();
const loading = ref(false);
const dataSource = ref<MySKUItem[]>([]);

// 搜索表单
const searchForm = ref<SearchForm>({
  product: '',
  srlID: '',
  skuValue: '',
});

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns: ColumnsType<MySKUItem> = [
  {
    title: '产品',
    dataIndex: 'product',
    align: 'center',
  },
  {
    title: '型号',
    dataIndex: 'srlID',
    align: 'center',
  },
  {
    title: 'SKU值',
    dataIndex: 'skuValue',
    align: 'center',
    width: 130,
  },
  {
    title: '完整的SKU',
    dataIndex: 'allSKU',
    align: 'center',
    width: 200,
  },
  {
    title: '分销商价格',
    dataIndex: 'distributionPrice',
    align: 'center',
    width: 120,
    customRender: ({ text }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '终端价格',
    dataIndex: 'terminalPrice',
    align: 'center',
    width: 120,
    customRender: ({ text }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '库存总数',
    dataIndex: 'totalInventory',
    align: 'center',
    width: 90,
  },
  {
    title: '已售数',
    dataIndex: 'soldQuantity',
    align: 'center',
    width: 90,
  },
  {
    title: '分成规则',
    dataIndex: 'divisionRules',
    align: 'center',
    width: 120,
  },
  {
    title: '操作',
    width: 120,
    fixed: 'right',
    align: 'center',
    customRender: ({ record }) => {
      return [
        h('div', { class: 'flex gap-4 justify-center' }, [
          h(
            'button',
            {
              class: 'text-blue-500 hover:text-blue-600',
              onClick: () => viewDetail(record),
            },
            '查询',
          ),
          h(
            'button',
            {
              class: 'text-blue-500 hover:text-blue-600',
              onClick: () => viewDetail(record),
            },
            '更新售价',
          ),
        ]),
      ];
    },
  },
];

// 表格滚动配置
const scroll = computed(() => ({
  y: 'calc(100vh - 300px)',
}));

// 查看详情
function viewDetail(row: MySKUItem) {
  router.push({
    name: 'BuyerSettlementDetail',
    params: { id: row.id },
  });
}

// 处理表格变化
const handleTableChange = async (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  await fetchSettlementList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    product: '',
    srlID: '',
    skuValue: '',
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  pagination.value.current = 1;
  fetchSettlementList();
};

// 获取结算列表数据
async function fetchSettlementList() {
  loading.value = true;
  try {
    const { pageSize } = pagination.value;
    const response = {
      items: Array.from({ length: pageSize }, (_, index) => ({
        id: `${111 + index}`,
        product: '男士T恤衫',
        srlID: '圆领文化衫',
        skuValue: 'L.白色',
        allSKU: '尺寸=L,颜色=白色',
        distributionPrice: 50,
        terminalPrice: 100,
        totalInventory: 10,
        soldQuantity: 5,
        divisionRules: '厂商50%-经销商49.5%-平台0.5%',
      })),
      total: 100,
    };

    dataSource.value = response.items;
    pagination.value.total = response.total;
  } finally {
    loading.value = false;
  }
}

// 初始加载
fetchSettlementList();
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col overflow-hidden">
      <!-- 搜索区域 -->
      <div class="mb-2 rounded-lg bg-white p-4 shadow-sm">
        <Form layout="inline" :model="searchForm">
          <Form.Item label="产品">
            <Input
              v-model:value="searchForm.product"
              placeholder="请输入产品名称"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="型号">
            <Input
              v-model:value="searchForm.srlID"
              placeholder="请输入产品型号"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="SKU值">
            <Input
              v-model:value="searchForm.skuValue"
              placeholder="请输入SKU值"
              allow-clear
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" @click="handleSearch">搜索</Button>
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
