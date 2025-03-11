<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-10 16:38:24
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-10 17:39:55
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\seller\apply-to-open-store\components\StoreOperation.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
// import { useRouter } from 'vue-router';

import { Button, message, Result } from 'ant-design-vue';

// const router = useRouter();

const goToGoodsList = () => {
  // router.push('/seller/goods/list');
  message.info('暂未开放');
};
</script>

<template>
  <div class="step-content">
    <div class="center-wrapper">
      <Result
        status="success"
        title="恭喜您完成入驻！"
        sub-title="现在您可以开始管理店铺，添加商品了"
      >
        <template #extra>
          <Button type="primary" @click="goToGoodsList">去添加商品</Button>
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

:deep(.ant-result-icon) {
  margin-bottom: 24px;
}
</style>
