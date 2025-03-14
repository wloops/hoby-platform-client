<script setup lang="ts">
import type { ProductDetail, SourceItem } from './types';

import { computed, defineExpose, ref } from 'vue';

import { Button, InputNumber, message, Modal } from 'ant-design-vue';

import { mainServiceApi } from '#/api';

import ProductInfo from './ProductInfo.vue';

const props = defineProps<{
  data: ProductDetail;
}>();

const emit = defineEmits(['confirm', 'update']);

// 采购相关
const loading = ref(false);
const recordData = ref<any>();
const purchaseModalVisible = ref(false);
const purchaseQuantity = ref(0);
const purchasePrice = ref(0);
const purchaseMaxQuantity = ref(0);
const purchaseTotal = computed(
  () => purchaseQuantity.value * purchasePrice.value,
);

const open = (record: SourceItem) => {
  recordData.value = record;
  purchasePrice.value = record.price;
  purchaseQuantity.value = record.restockingNumStill ?? 0; // 待进货数量
  purchaseMaxQuantity.value = record.restockingNumStill ?? 0; // 最大进货数量
  purchaseModalVisible.value = true;
};

const handleConfirm = async () => {
  loading.value = true;
  try {
    emit('confirm', purchaseQuantity.value);
    const userInfo = sessionStorage.getItem('userInfo');
    const userInfoObj = JSON.parse(userInfo || '{}');
    const data = {
      pageID: 'sourceOfGoodsShowPage', // 页面ID
      pageButtonID: 'addGoodsToCart', // 按钮ID
      purchaseCompanyName: userInfoObj.TELLERCOMPANY, // 采购公司名称 (从用户信息中获取)
      billNo: recordData.value?.billNo, // 单据号
      oriObjectID: recordData.value?.oriObjectID,
      orderDtlNo: recordData.value?.orderDtlNo,
      saleCmpName: recordData.value?.store,
      wareName: recordData.value?.warehouse,
      actNo: recordData.value?.record.actNo,
      prdNo: recordData.value?.record.prdNo,
      prdSrlID: recordData.value?.record.prdSrlID,
      terminalPchCmpName: recordData.value?.purchaseCompanyName,
      tellerNo: recordData.value?.billNo,
      prdNum: purchaseQuantity.value,
    };
    const { rs: code } = await mainServiceApi(data);
    if (code === '1') {
      message.success('已添加到采购车');
      // 更新产品详情
      emit('update');
    } else {
      message.error(`添加失败: ${code}`);
    }
    purchaseModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
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
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleConfirm" :loading="loading">
            确定
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
