<script setup lang="ts">
import { ref, watch } from 'vue';

import { Button, Checkbox, Modal } from 'ant-design-vue';

interface SkuItem {
  size: string;
  color: string;
  id: string;
}
interface Props {
  visible: boolean;
  title?: string;
  skuList?: SkuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '请选择SKU',
  skuList: () => [],
});

const emit = defineEmits(['update:visible', 'confirm']);

// 选中的SKU列表
const checkedList = ref<string[]>([]);
const indeterminate = ref(false);
const checkAll = ref(false);

// 示例数据，实际应该从props传入
const defaultSkuList = [
  { size: 'M', color: '粉色', id: 'M-pink' },
  { size: 'M', color: '绿色', id: 'M-green' },
  { size: 'L', color: '粉色', id: 'L-pink' },
  { size: 'L', color: '蓝色', id: 'L-blue' },
  { size: 'XL', color: '红色', id: 'XL-red' },
  { size: 'XL', color: '黄色', id: 'XL-yellow' },
  { size: 'XXL', color: '红色', id: 'XXL-red' },
  { size: 'XXL', color: '红色', id: 'XXL-red-2' },
];

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 重置选中状态
      checkedList.value = [];
      checkAll.value = false;
      indeterminate.value = false;
    }
  },
);

// 处理全选
const onCheckAllChange = (e: { target: { checked: boolean } }) => {
  checkedList.value = e.target.checked
    ? defaultSkuList.map((item) => item.id)
    : [];
  indeterminate.value = false;
  checkAll.value = e.target.checked;
};

// 处理单个选择
const onCheckChange = (checkedValue: (boolean | number | string)[]) => {
  const list = checkedValue as string[];
  checkedList.value = list;
  indeterminate.value = list.length > 0 && list.length < defaultSkuList.length;
  checkAll.value = list.length === defaultSkuList.length;
};

// 关闭弹窗
const handleCancel = () => {
  emit('update:visible', false);
};

// 确认选择
const handleConfirm = () => {
  emit('confirm', checkedList.value);
  handleCancel();
};

// 获取显示文本
const getSkuText = (sku: SkuItem) => `${sku.size} ${sku.color}`;
</script>

<template>
  <Modal
    :visible="visible"
    :title="title"
    :width="500"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="flex flex-col gap-4">
      <!-- 全选区域 -->
      <div class="border-b border-gray-200 pb-2">
        <Checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          全选
        </Checkbox>
      </div>

      <!-- SKU列表 -->
      <div class="max-h-[400px] overflow-y-auto">
        <Checkbox.Group v-model:value="checkedList" @change="onCheckChange">
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="sku in defaultSkuList"
              :key="sku.id"
              class="flex items-center"
            >
              <Checkbox :value="sku.id">{{ getSkuText(sku) }}</Checkbox>
            </div>
          </div>
        </Checkbox.Group>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end gap-2 border-t border-gray-200 pt-4">
        <Button @click="handleCancel">取消</Button>
        <Button
          type="primary"
          :disabled="checkedList.length === 0"
          @click="handleConfirm"
        >
          确定
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
:deep(.ant-checkbox-wrapper) {
  @apply select-none;
}

:deep(.ant-modal-body) {
  @apply p-6;
}
</style>
