<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:30:35
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 17:46:48
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\seller\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 店铺管理
-->
<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { DownOutlined } from '@ant-design/icons-vue';
import { Button, Dropdown, Space, Table } from 'ant-design-vue';

import SelectSkuModal from './components/SelectSkuModal.vue';

interface GoodsModel extends Record<string, any> {}

// 表格数据
const dataSource = ref<GoodsModel[]>([
  {
    product: '男士T恤衫',
    model: '酷炫火箭衫',
    status: '正常销售',
  },
  {
    product: '男士T恤衫',
    model: '圆领文化衫',
    status: '正常销售',
  },
]);

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '产品',
    dataIndex: 'product',
    width: '25%',
  },
  {
    title: '产品型号',
    dataIndex: 'model',
    width: '25%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '20%',
  },
  {
    title: '操作',
    key: 'action',
    width: '30%',
    align: 'left',
  },
];

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
};

// 按钮操作项
const handleEditPrice = (record: GoodsModel) => {
  console.warn('编辑售价', record);
};

const handleDeleteModel = (record: GoodsModel) => {
  console.warn('删除型号', record);
};

const handleUploadAll = (record: GoodsModel) => {
  console.warn('上架全部SKU', record);
};

// 添加弹窗控制状态
const skuModalVisible = ref(false);
const skuModalType = ref<'download' | 'upload'>('upload');
const currentRecord = ref<GoodsModel | null>(null);

// 修改处理函数
const handleUploadPart = (record: GoodsModel) => {
  currentRecord.value = record;
  skuModalType.value = 'upload';
  skuModalVisible.value = true;
};

const handleDownloadAll = (record: GoodsModel) => {
  console.warn('下架全部SKU', record);
};

const handleDownloadPart = (record: GoodsModel) => {
  currentRecord.value = record;
  skuModalType.value = 'download';
  skuModalVisible.value = true;
};

// 处理 SKU 选择确认
const handleSkuConfirm = (selectedSkus: string[]) => {
  console.warn(
    '选中的SKU:',
    selectedSkus,
    '当前记录:',
    currentRecord.value,
    '操作类型:',
    skuModalType.value,
  );
};
</script>

<template>
  <Page title="产品型号管理" auto-content-height>
    <div class="bg-white p-6">
      <Table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :row-key="(record) => record.model"
        class="bg-white"
        @change="handleTableChange"
      >
        <template #headerCell="{ column }">
          <span class="font-medium">{{ column.title }}</span>
        </template>

        <template #bodyCell="{ column, record }">
          <!-- 状态列 -->
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

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <Space>
              <!-- 基础操作按钮 -->
              <Button size="small" @click="handleEditPrice(record)">
                编辑售价
              </Button>
              <Button size="small" @click="handleDeleteModel(record)">
                删除型号
              </Button>

              <!-- 上架操作下拉菜单 -->
              <Dropdown>
                <Button size="small">
                  上架SKU
                  <DownOutlined />
                </Button>
                <template #overlay>
                  <ul class="ant-dropdown-menu">
                    <li
                      class="ant-dropdown-menu-item"
                      @click="handleUploadAll(record as GoodsModel)"
                    >
                      上架全部SKU
                    </li>
                    <li
                      class="ant-dropdown-menu-item"
                      @click="handleUploadPart(record as GoodsModel)"
                    >
                      上架部分SKU
                    </li>
                  </ul>
                </template>
              </Dropdown>

              <!-- 下架操作下拉菜单 -->
              <Dropdown>
                <Button size="small">
                  下架SKU
                  <DownOutlined />
                </Button>
                <template #overlay>
                  <ul class="ant-dropdown-menu">
                    <li
                      class="ant-dropdown-menu-item"
                      @click="handleDownloadAll(record as GoodsModel)"
                    >
                      下架全部SKU
                    </li>
                    <li
                      class="ant-dropdown-menu-item"
                      @click="handleDownloadPart(record as GoodsModel)"
                    >
                      下架部分SKU
                    </li>
                  </ul>
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>
    </div>

    <!-- 添加 SKU 选择弹窗 -->
    <SelectSkuModal
      v-model:visible="skuModalVisible"
      :title="`请选择需要${skuModalType === 'upload' ? '上架' : '下架'}的SKU`"
      @confirm="handleSkuConfirm"
    />
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

:deep(.ant-dropdown-menu) {
  @apply min-w-[120px];
}

:deep(.ant-dropdown-menu-item) {
  @apply cursor-pointer px-4 py-2 hover:bg-gray-50;
}

:deep(.ant-space) {
  gap: 8px !important;
}
</style>
