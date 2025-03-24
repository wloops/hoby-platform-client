<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-23 15:34:45
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-24 14:42:03
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\gen-order\importOrder.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref } from 'vue';

import ConfigureImport from './components/import/ConfigureImport.vue';
import ImportResult from './components/import/ImportResult.vue';
import PreviewAndImport from './components/import/PreviewAndImport.vue';
import SelectPlatform from './components/import/SelectPlatform.vue';
import StepHeader from './components/import/StepHeader.vue';
import UploadFile from './components/import/UploadFile.vue';
import RecentOrders from './components/RecentOrders.vue';
import { useImportState } from './composables';

// 导入步骤
const steps = ref([
  '选择平台',
  '上传文件',
  '配置导入',
  '预览并导入',
  '导入结果',
]);
const currentStep = ref(0);

// 使用导入状态组合函数
const {
  platforms,
  selectedPlatform,
  uploadedFile,
  thirdPartyFields,
  fieldMappings,
  importOptions,
  previewData,
  importResult,
  handleFileUpload,
  startImport,
  resetForm,
  getPlatformName,
} = useImportState();

// 下一步处理函数
const goNextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
};

// 上一步处理函数
const goPreviousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 步骤完成处理函数
const handleStepComplete = () => {
  goNextStep();
};

// 重置处理函数
const handleReset = () => {
  resetForm();
  currentStep.value = 0;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">导入第三方订单</h2>
        </div>

        <!-- Import Steps -->
        <StepHeader
          :steps="steps"
          :current-step="currentStep"
          @step-click="currentStep = $event"
        />

        <!-- Step 1: Select Platform -->
        <SelectPlatform
          v-if="currentStep === 0"
          :platforms="platforms"
          :selected-platform="selectedPlatform"
          @update:selected-platform="selectedPlatform = $event"
          @complete="handleStepComplete"
        />

        <!-- Step 2: Upload File -->
        <UploadFile
          v-if="currentStep === 1"
          :uploaded-file="uploadedFile"
          @file-upload="handleFileUpload"
          @delete-file="uploadedFile = null"
          @previous="goPreviousStep"
          @complete="handleStepComplete"
        />

        <!-- Step 3: Configure Import -->
        <ConfigureImport
          v-if="currentStep === 2"
          :field-mappings="fieldMappings"
          :third-party-fields="thirdPartyFields"
          v-model:import-options="importOptions"
          @previous="goPreviousStep"
          @complete="handleStepComplete"
        />

        <!-- Step 4: Preview and Import -->
        <PreviewAndImport
          v-if="currentStep === 3"
          :preview-data="previewData"
          @previous="goPreviousStep"
          @start-import="startImport"
        />

        <!-- Step 5: Import Result -->
        <ImportResult
          v-if="currentStep === 4"
          :import-result="importResult"
          :uploaded-file="uploadedFile"
          :selected-platform="selectedPlatform"
          :get-platform-name="getPlatformName"
          @reset="handleReset"
        />
      </div>
      <RecentOrders />
    </main>
  </div>
</template>

<style scoped>
.bg-primary-50 {
  background-color: rgb(59 130 246 / 5%);
}

.bg-primary-600 {
  background-color: rgb(37 99 235);
}

.bg-primary-700 {
  background-color: rgb(29 78 216);
}

.border-primary-500 {
  border-color: rgb(59 130 246);
}

.text-primary-500 {
  color: rgb(59 130 246);
}

.text-primary-600 {
  color: rgb(37 99 235);
}

.text-primary-900 {
  color: rgb(30 58 138);
}

.focus-ring-primary-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

.focus-border-primary-500:focus {
  border-color: rgb(59 130 246);
}
</style>
