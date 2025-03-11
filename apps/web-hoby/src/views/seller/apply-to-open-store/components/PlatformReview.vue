<script setup lang="ts">
import { Button, Result } from 'ant-design-vue';

const emit = defineEmits(['next']);
</script>

<template>
  <div class="step-content">
    <div class="center-wrapper">
      <Result
        status="info"
        title="申请已提交，等待平台审核"
        sub-title="平台将在2-5个工作日内完成审核，请保持电话畅通"
      >
        <template #extra>
          <Button type="primary" @click="emit('next')">确定</Button>
        </template>
      </Result>
    </div>
  </div>
</template>

<style scoped>
.step-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.center-wrapper {
  width: 100%;
  text-align: center;
}

:deep(.ant-result) {
  padding: 24px 32px 48px;
}
</style>
