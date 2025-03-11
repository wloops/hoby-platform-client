<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-10 14:35:25
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-10 16:57:22
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\seller\apply-to-open-store\submit-apply.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Steps } from 'ant-design-vue';

import CompanyInfo from './components/CompanyInfo.vue';
import PlatformReview from './components/PlatformReview.vue';
import StoreOperation from './components/StoreOperation.vue';
import StoreType from './components/StoreType.vue';

const currentStep = ref(0);

const formState = reactive({
  // 企业信息
  companyName: '',
  businessLicense: '',
  legalPerson: '',
  contactPhone: '',
  businessAddress: '',
  businessScope: '',
  // 店铺信息
  agreement: false,
  storeType: 'direct',
});

const showAgreement = () => {
  console.warn('需要实现显示协议的逻辑');
};

const handleNext = () => {
  currentStep.value++;
};

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};
</script>

<template>
  <Page title="开店申请">
    <div class="store-registration">
      <div class="steps-wrapper">
        <Steps
          direction="vertical"
          :current="currentStep"
          class="registration-steps"
        >
          <Steps.Step
            title="完善企业信息"
            description="需如实填写营业执照、法人信息"
          />
          <Steps.Step
            title="申请开店"
            description="阅读并同意《供应商入驻协议》，选择店铺类型，提交开店申请"
          />
          <Steps.Step
            title="平台审核"
            description="若贵公司的条件满足供应链入驻标准，平台会在2-5个工作日与您取得联系，待审核通过后即入驻成功"
          />
          <Steps.Step
            title="店铺经营"
            description="为店铺添加商品，平台审核后通过后即可上架售卖商品"
          />
        </Steps>
      </div>

      <div class="step-content-wrapper">
        <CompanyInfo
          v-if="currentStep === 0"
          :form-state="formState"
          @next="handleNext"
          @update:form-state="(val) => Object.assign(formState, val)"
        />

        <StoreType
          v-if="currentStep === 1"
          :form-state="formState"
          @prev="handlePrev"
          @next="handleNext"
          @show-agreement="showAgreement"
          @update:form-state="(val) => Object.assign(formState, val)"
        />

        <PlatformReview v-if="currentStep === 2" @next="handleNext" />

        <StoreOperation v-if="currentStep === 3" />
      </div>
    </div>
  </Page>
</template>

<style scoped>
.store-registration {
  display: flex;
  gap: 32px;
  align-items: stretch;
  min-height: calc(100vh - 180px);
  padding: 24px;
  margin: 0 auto;
}

.steps-wrapper {
  display: flex;
  flex: 0 0 330px;
  flex-direction: column;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.registration-steps {
  flex: 1;
}

.step-content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

:deep(.ant-steps-vertical) {
  height: 100%;
}

:deep(.ant-steps-vertical .ant-steps-item-description) {
  padding-bottom: 16px;
}

:deep(.step-content) {
  height: 100%;
}

:deep(.ant-result) {
  margin: auto;
}
</style>
