<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 17:24:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-14 14:24:53
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\settlement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Dayjs } from 'dayjs';

import { computed, h, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, DatePicker, Form, Input, Table, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useEnums, useMainGetData } from '#/composables';

interface SettlementItem {
  id: string;
  orderNo: string; // 进货订单号
  voucherType: string; // 凭证类型
  purchaseUnit: string; // 收款单位
  amount: number; // 结算金额
  period: string; // 账期
  interest: number; // 利率
  estimatedInterest: number; // 预计利息
  dueDate: string; // 履约日期
  paymentStatus: string; // 付款状态
  paidAmount: number; // 已付金额
}

interface SearchForm {
  orderNo: string; // 进货订单号
  purchaseUnit: string; // 收款单位
  dueDate: Dayjs | undefined; // 履约日期
}

const router = useRouter();
const loading = ref(false);
const dataSource = ref<SettlementItem[]>([]);

const { getEnumLabel, getEnumColor } = useEnums();

// 搜索表单
const searchForm = ref<SearchForm>({
  orderNo: '',
  purchaseUnit: '',
  dueDate: undefined,
});

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns: ColumnsType<SettlementItem> = [
  {
    title: '进货订单号',
    dataIndex: 'orderNo',
    align: 'center',
    width: 180,
  },
  {
    title: '凭证类型',
    dataIndex: 'voucherType',
    align: 'center',
    width: 180,
    customRender: ({ text }) => getEnumLabel('voucherType', text),
  },
  {
    title: '收款单位',
    dataIndex: 'purchaseUnit',
    align: 'center',
    width: 180,
  },
  {
    title: '结算金额',
    dataIndex: 'amount',
    align: 'right',
    width: 120,
    customRender: ({ text }) => `¥${text}`,
  },
  {
    title: '账期',
    dataIndex: 'period',
    align: 'center',
    width: 100,
  },
  {
    title: '利率',
    dataIndex: 'interest',
    align: 'right',
    width: 100,
    customRender: ({ text }) => `¥${text}`,
  },
  {
    title: '预计利息',
    dataIndex: 'estimatedInterest',
    align: 'right',
    width: 100,
    customRender: ({ text }) => `¥${text}`,
  },
  {
    title: '履约日期',
    dataIndex: 'dueDate',
    align: 'center',
    width: 120,
    customRender: ({ text }) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
  },
  {
    title: '付款状态',
    dataIndex: 'paymentStatus',
    align: 'center',
    width: 100,
    customRender: ({ text }) => {
      return h(Tag, { color: getEnumColor('paymentStatus', text) }, () =>
        getEnumLabel('paymentStatus', text),
      );
    },
  },
  {
    title: '已付金额',
    dataIndex: 'paidAmount',
    align: 'right',
    width: 120,
    customRender: ({ text }) => `¥${text}`,
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
          onClick: () => viewDetail(record),
        },
        () => '完成付款',
      );
    },
  },
];

// 表格滚动配置
const scroll = computed(() => ({
  y: 'calc(100vh - 300px)',
}));

// 查看详情
function viewDetail(row: SettlementItem) {
  router.push({
    name: 'BuyerSettlementDetail',
    params: { id: row.id },
  });
}

// 处理表格变化
const handleTableChange = async (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  await fetchList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    orderNo: '',
    purchaseUnit: '',
    dueDate: undefined,
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  pagination.value.current = 1;
  fetchList();
};

// 获取结算列表数据
async function fetchList() {
  loading.value = true;
  try {
    // TODO: 替换为实际的API调用
    // const { current, pageSize } = pagination.value;
    const { current, pageSize } = pagination.value;
    const reqParams = {
      pageID: 'myPurchasingOrderVoucherPage',
      pageDataGrpID: 'purchasingOrderVoucherWaitPayment',
      currentPage: current,
      numOfPerPage: pageSize,
    };
    const { data, total } = await useMainGetData(reqParams);

    // 监听 data 的变化
    watch(data, (newData) => {
      if (newData) {
        // 将原始数据转换为目标格式
        const response = {
          items: (newData as any[]).map((item: any, index: number) => ({
            id: `${index + 1}`, // 生成唯一 ID
            orderNo: item.billNo,
            voucherType: item.billCate,
            purchaseUnit: item.recvCompany,
            amount: item.predictedInterest,
            period: item.accountPeriodID,
            interest: item.interestRate,
            estimatedInterest: item.predictedInterest,
            dueDate: item.endDate,
            paymentStatus: item.payStatus,
            paidAmount: item.paidAmt,
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
fetchList();
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col overflow-hidden">
      <!-- 搜索区域 -->
      <div class="mb-2 rounded-lg bg-white p-4 shadow-sm">
        <Form layout="inline" :model="searchForm">
          <Form.Item label="进货订单号">
            <Input
              v-model:value="searchForm.orderNo"
              placeholder="请输入进货订单号"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="收款单位">
            <Input
              v-model:value="searchForm.purchaseUnit"
              placeholder="请输入收款单位"
              allow-clear
            />
          </Form.Item>
          <Form.Item label="履约日期">
            <DatePicker
              v-model:value="searchForm.dueDate"
              placeholder="请选择履约日期"
              style="width: 200px"
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
