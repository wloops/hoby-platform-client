<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import { Table, Tag } from 'ant-design-vue';

const columns = ref([
  {
    title: '申请业务',
    dataIndex: 'applyBusiness',
    key: 'applyBusiness',
  },
  {
    title: '处理状态',
    dataIndex: 'handleStatus',
    key: 'handleStatus',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
  },
]);

const applyList = ref([
  {
    applyBusiness: '直销店铺',
    handleStatus: '处理中',
    applyTime: '2025-03-09 14:35:25',
  },
  {
    applyBusiness: '直营店铺',
    handleStatus: '已开通',
    applyTime: '2025-03-09 14:35:25',
  },
]);

const statusMap: Record<string, { color: string; icon: any }> = {
  待处理: { color: 'default', icon: ClockCircleOutlined },
  处理中: { color: 'processing', icon: SyncOutlined },
  已开通: { color: 'green', icon: CheckCircleOutlined },
  已关闭: { color: 'red', icon: CloseCircleOutlined },
};
</script>

<template>
  <Page title="我的开店申请">
    <div>
      <div class="rounded-lg bg-white shadow-sm">
        <Table :data-source="applyList" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'handleStatus'">
              <span>
                <Tag :color="statusMap[record.handleStatus]?.color">
                  <template #icon>
                    <component
                      :is="statusMap[record.handleStatus]?.icon"
                      :spin="
                        statusMap[record.handleStatus]?.color === 'processing'
                      "
                    />
                  </template>
                  {{ record.handleStatus }}
                </Tag>
              </span>
            </template>
          </template>
        </Table>
      </div>
    </div>
  </Page>
</template>
