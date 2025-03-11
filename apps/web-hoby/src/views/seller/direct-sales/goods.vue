<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:30:35
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 17:10:29
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\seller\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 店铺管理
-->
<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

interface GoodsItem {
  name: string;
  status: string;
  totalStock: number;
  lockedStock: number;
  defectiveStock: number;
}

// 表格列定义
const columns = [
  {
    title: '产品名称',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '15%',
  },
  {
    title: '库存总数量',
    dataIndex: 'totalStock',
    width: '20%',
  },
  {
    title: '锁住的库存数量',
    dataIndex: 'lockedStock',
    width: '20%',
  },
  {
    title: '报废库存数量',
    dataIndex: 'defectiveStock',
    width: '15%',
  },
];

// 模拟数据
const dataSource = ref<GoodsItem[]>([
  {
    name: '男士T恤衫',
    status: '正常销售',
    totalStock: 1000,
    lockedStock: 5,
    defectiveStock: 0,
  },
  {
    name: '女士T恤衫',
    status: '正常销售',
    totalStock: 2000,
    lockedStock: 100,
    defectiveStock: 0,
  },
]);

// 分页配置
const pagination = ref({
  total: dataSource.value.length,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// 处理分页变化
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  // 这里可以调用接口获取数据
};
</script>

<template>
  <Page title="直销的产品" auto-content-height>
    <div class="bg-white p-6">
      <Table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :row-key="(record) => record.name"
        class="bg-white"
        @change="handleTableChange"
      >
        <template #headerCell="{ column }">
          <span class="font-medium">{{ column.title }}</span>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <span
              :class="{
                'text-success': record.status === '正常销售',
                'text-warning': record.status === '库存不足',
                'text-danger': record.status === '已下架',
              }"
            >
              {{ record.status }}
            </span>
          </template>
        </template>
      </Table>
    </div>
  </Page>
</template>

<style scoped>
.text-success {
  @apply text-green-600;
}

.text-warning {
  @apply text-yellow-600;
}

.text-danger {
  @apply text-red-600;
}
</style>
