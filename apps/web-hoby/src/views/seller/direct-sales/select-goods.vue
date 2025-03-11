<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:30:35
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 17:11:39
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\seller\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 店铺管理
-->
<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Table, Tag } from 'ant-design-vue';

import SelectGoodsDrawer from './components/SelectGoodsDrawer.vue';

interface TableRecord {
  key: string;
  supplier: string;
  storeType: string;
  status: string;
}

// 抽屉可见性
const drawerVisible = ref(false);
const currentSupplier = ref<string>();

// 表格列定义
const columns = [
  {
    title: '供应商',
    dataIndex: 'supplier',
    key: 'supplier',
    width: '30%',
  },
  {
    title: '店铺类型',
    dataIndex: 'storeType',
    key: 'storeType',
    width: '30%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '20%',
  },
  {
    title: '操作',
    key: 'action',
    width: '20%',
  },
];

// 表格数据
const dataSource = ref<TableRecord[]>([
  {
    key: '1',
    supplier: '湖南新马制衣有限公司',
    storeType: '直销店铺',
    status: '正常经营',
  },
  // 可以添加更多数据...
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
  // 这里可以调用接口重新获取数据
  fetchData();
};

// 选择商品
const handleSelectGoods = (record: Record<string, any>) => {
  currentSupplier.value = record.supplier;
  drawerVisible.value = true;
};

// 处理商品选择
const handleGoodsSelected = (selectedGoods: string[]) => {
  // 这里处理选中的商品
  console.warn('selectedGoods', selectedGoods);
};

// 获取数据
const fetchData = async () => {
  // 这里可以添加获取数据的逻辑
};
</script>

<template>
  <Page title="选择商品" auto-content-height>
    <div class="bg-white p-6">
      <!-- 表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
        class="bg-white"
      >
        <!-- 自定义状态列 -->
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="text === '正常经营' ? 'success' : 'default'">
              {{ text }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" @click="handleSelectGoods(record)">
              选择商品
            </Button>
          </template>
        </template>
      </Table>

      <!-- 商品选择抽屉 -->
      <SelectGoodsDrawer
        v-model:visible="drawerVisible"
        :supplier="currentSupplier"
        @select="handleGoodsSelected"
      />
    </div>
  </Page>
</template>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background: #f5f5f5;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa;
}
</style>
