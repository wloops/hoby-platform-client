<script setup lang="ts">
import type { ProductDetail, SourceItem } from './types';

import { computed, defineExpose, ref } from 'vue';

import { Button, InputNumber, Modal } from 'ant-design-vue';

import ProductInfo from './ProductInfo.vue';

const props = defineProps<{
  data: ProductDetail;
}>();

const emit = defineEmits(['confirm']);

// 采购相关
const purchaseModalVisible = ref(false);
const purchaseQuantity = ref(0);
const purchasePrice = ref(0);
const purchaseMaxQuantity = ref(0);
const purchaseTotal = computed(
  () => purchaseQuantity.value * purchasePrice.value,
);

const open = (record: SourceItem) => {
  purchasePrice.value = record.price;
  purchaseQuantity.value = record.stock;
  purchaseMaxQuantity.value = record.stock;
  purchaseModalVisible.value = true;
};

const handleConfirm = () => {
  emit('confirm', purchaseQuantity.value);
  purchaseModalVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
  open,
});
</script>

<template>
  <div>
    <!-- 采购确认框 -->
    <Modal
      v-model:visible="purchaseModalVisible"
      title="商品信息"
      @ok="handleConfirm"
      :mask-closable="false"
      width="50%"
    >
      <div class="space-y-6">
        <div class="rounded-lg border-gray-200 bg-gray-50 p-4">
          <ProductInfo :data="props.data" />
        </div>

        <div class="flex flex-col gap-4 rounded-lg border p-4">
          <div class="flex items-center justify-between">
            <span class="text-base">请输入进货数量</span>
            <InputNumber
              v-model:value="purchaseQuantity"
              :min="1"
              :max="purchaseMaxQuantity"
              :precision="0"
              style="width: 160px"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-base">进货总价</span>
            <span class="text-primary text-lg"
              >¥{{ purchaseTotal.toFixed(2) }}</span
            >
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="purchaseModalVisible = false">取消</Button>
          <Button type="primary" @click="handleConfirm">确定</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
