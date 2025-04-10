<script setup>
import { defineEmits, ref } from 'vue';

import { message, Modal } from 'ant-design-vue';

import { mainSendFileDataApi } from '#/api';

const emit = defineEmits(['refresh']);
const isOpen = ref(false);
const editedSpecsList = ref([]);
const specCate = ref('');

// 添加规格值
const addSpecValue = () => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  if (!specCate.value.trim()) {
    message.warning('请先输入规格类型');
    return;
  }

  // Initialize if empty
  if (editedSpecsList.value.length === 0) {
    editedSpecsList.value.push({
      specCate: specCate.value,
      querySpecValue: [],
    });
  }

  // Add new spec value
  editedSpecsList.value[0].querySpecValue.push({
    companyName: userInfoObj.TELLERCOMPANY,
    specAttrCate: specCate.value,
    specValue: '',
    specAttr: '',
    isNew: 'true',
    deleteStatus: 'normal',
  });
};

// 删除规格值
const removeSpecValue = (specCate, index) => {
  const specItem = editedSpecsList.value.find(
    (item) => item.specCate === specCate,
  );
  if (specItem) {
    const specValue = specItem.querySpecValue[index];
    if (specValue.isNew === 'true') {
      specItem.querySpecValue.splice(index, 1);
    } else {
      specValue.deleteStatus =
        specValue.deleteStatus === 'normal' ? 'pending_delete' : 'normal';
    }
  }
};

// 保存更改
const saveChanges = () => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  // Validate input
  if (!specCate.value.trim()) {
    Modal.error({
      title: '新增失败',
      content: '请填写规格类型',
    });
    return;
  }

  const hasEmptyNewSpec = editedSpecsList.value.some((spec) =>
    spec.querySpecValue.some(
      (item) => item.isNew === 'true' && !item.specAttr.trim(),
    ),
  );

  if (hasEmptyNewSpec) {
    Modal.error({
      title: '新增失败',
      content: '请填写所有新增的规格值',
    });
    return;
  }

  Modal.confirm({
    title: '确认新增',
    content: '确定要新增当前规格标准吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        // 准备保存的数据
        const toSaveSpecs = {
          querySpecCate: editedSpecsList.value.map((spec) => ({
            companyName: userInfoObj.TELLERCOMPANY,
            specAttrCate: spec.specCate,
            querySpecValue: spec.querySpecValue
              .filter((item) => item.deleteStatus !== 'pending_delete')
              .map((item) => ({
                companyName: userInfoObj.TELLERCOMPANY,
                specAttrCate: spec.specCate,
                specAttr: item.specAttr || item.specValue,
              })),
          })),
        };

        // 执行保存
        if (
          toSaveSpecs.querySpecCate.length > 0 &&
          toSaveSpecs.querySpecCate[0].querySpecValue.length > 0
        ) {
          const saveParams = {
            bllID: 'hobyFactorySpecStdPreview',
            serviceID: 1,
            fileDate: JSON.stringify(toSaveSpecs),
          };

          await mainSendFileDataApi(saveParams);
          message.success('新增规格标准成功');
          closeModal();
          emit('refresh'); // 触发父组件刷新
        } else {
          message.warning('请至少添加一个规格值');
        }
      } catch (error) {
        message.error(`操作失败：${error.message || '服务器错误'}`);
      }
    },
  });
};

// 重置表单
const resetForm = () => {
  specCate.value = '';
  editedSpecsList.value = [];
};

// 打开模态框
const open = async () => {
  resetForm();
  isOpen.value = true;
};

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
};

defineExpose({
  open,
});
</script>

<template>
  <div
    v-if="isOpen"
    class="absolute inset-0 h-full overflow-y-auto"
    style="z-index: 202"
  >
    <!-- Modal -->
    <div class="flex h-full items-end justify-center text-center">
      <div
        class="relative flex h-full w-full transform flex-col overflow-hidden bg-white text-left shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">新增规格标准</h3>
            <button
              class="text-gray-400 hover:text-gray-500"
              @click="closeModal"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 可滚动的规格内容区域 -->
        <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
          <div class="space-y-8">
            <!-- 现有规格 -->
            <div
              class="spec-section rounded-md border bg-white px-2 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-20">
                <div class="flex flex-1 items-center gap-2">
                  <h4 class="flex-none text-base font-medium text-gray-900">
                    规格：
                  </h4>
                  <input
                    v-model="specCate"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-1.5 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入规格类型"
                  />
                </div>
                <div class="flex-1 items-center text-right">
                  <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    @click="addSpecValue"
                    :class="{
                      'cursor-not-allowed opacity-50': !specCate.trim(),
                    }"
                    :disabled="!specCate.trim()"
                  >
                    添加规格值
                  </button>
                </div>
              </div>

              <!-- 规格值列表 -->
              <div
                class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
              >
                <div
                  v-for="(valueItem, index) in editedSpecsList[0]
                    ?.querySpecValue || []"
                  :key="index"
                  class="flex items-center gap-2 rounded-md bg-white p-2 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="text"
                    v-model="valueItem.specAttr"
                    class="min-w-0 flex-1 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入规格值"
                    :class="{
                      'cursor-not-allowed bg-gray-100':
                        valueItem.isNew === 'false',
                      'text-gray-400 line-through':
                        valueItem.deleteStatus === 'pending_delete',
                    }"
                  />
                  <button
                    class="flex-shrink-0"
                    @click="
                      removeSpecValue(editedSpecsList[0]?.specCate, index)
                    "
                  >
                    <svg
                      class="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6"
        >
          <button
            class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3"
            @click="saveChanges"
          >
            确定
          </button>
          <button
            class="mt-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
