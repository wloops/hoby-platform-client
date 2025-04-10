<script setup>
import { computed, defineEmits, ref } from 'vue';

import { message, Modal, Select } from 'ant-design-vue';

import { mainSendFileDataApi, mainServiceApi } from '#/api';

const emit = defineEmits(['refresh']);
const isOpen = ref(false);
const productName = ref('');
const newSpecTypeName = ref('');
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);

// 规格列表数据结构
// const specsList = ref([]);
const editedSpecsList = ref([]);
// 计算可用的规格类型
const availableSpecTypes = computed(() => {
  return editedSpecsList.value.map((spec) => spec.specCate);
});

// 获取规格类型名称
const getSpecTypeName = (type) => {
  return type;
};

// 处理库存规格变化
const handleStockSpecChange = (value) => {
  selectedStockSpecs.value = value;
};

// 处理价格规格变化
const handlePriceSpecChange = (value) => {
  selectedPriceSpecs.value = value;
};

// 重置表单
const resetForm = () => {
  productName.value = '';
  newSpecTypeName.value = '';
  selectedStockSpecs.value = [];
  selectedPriceSpecs.value = [];
  // specsList.value = [];
};

// const productData = ref(null);
// 打开弹窗
const open = () => {
  resetForm();
  isOpen.value = true;
};

// 关闭弹窗
const closeModal = () => {
  isOpen.value = false;
};

// 添加规格值
const addSpecValue = (specCate) => {
  editedSpecsList.value.forEach((item) => {
    if (item.specCate === specCate) {
      item.queryProductSpecValue.push({
        specValue: '',
        specCate,
        isNew: 'true', // 标记为新添加的规格值
        deleteStatus: 'normal', // 新添加的规格值初始状态
      });
    }
  });
};

// 删除规格值
const removeSpecValue = (specCate, index) => {
  const spec = editedSpecsList.value.find((item) => item.specCate === specCate);
  if (spec) {
    if (spec.queryProductSpecValue.length <= 1) {
      Modal.warning({
        title: '操作提示',
        content: '每个规格类型至少需要保留一个规格值',
      });
      return;
    }
    spec.queryProductSpecValue.splice(index, 1);
  }
};
// const removeSpecValue = (specCate, index) => {
//   editedSpecsList.value.forEach((item) => {
//     if (item.specCate === specCate) {
//       const specValue = item.queryProductSpecValue[index];
//       if (specValue.isNew === 'true') {
//         // 如果是新增的规格值，直接从数组中移除
//         item.queryProductSpecValue.splice(index, 1);
//       } else {
//         // 如果是已有规格值，标记为删除状态
//         specValue.deleteStatus =
//           specValue.deleteStatus === 'normal' ? 'pending_delete' : 'normal';
//       }
//     }
//   });
// };

// 添加新规格类型
const addNewSpecType = () => {
  if (!newSpecTypeName.value.trim()) return;

  // 转换为驼峰命名作为key
  const specTypeKey = newSpecTypeName.value
    .trim()
    .replaceAll(/[\s-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());

  // 检查是否已存在
  editedSpecsList.value.forEach((item) => {
    if (item.specCate === specTypeKey) {
      message.error(`规格类型 "${newSpecTypeName.value}" 已存在`);
      return false;
    }
  });

  // 添加新规格类型
  editedSpecsList.value.push({
    productName: productName.value,
    specCate: specTypeKey,
    queryProductSpecValue: [
      {
        specValue: '',
        specCate: specTypeKey,
        isNew: 'true',
        deleteStatus: 'normal',
      },
    ],
  });

  // 清空输入框
  newSpecTypeName.value = '';
};

// 删除规格类型
const removeSpecType = (specCate, index) => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  Modal.confirm({
    title: '提示',
    content: `确定要删除 "${specCate}" 规格吗？`,
    onOk: () => {
      editedSpecsList.value.forEach((item) => {
        if (item.specCate === specCate) {
          const params = {
            pageID: 'EditSpecificationModal', // 页面ID
            pageButtonID: 'prdStdDeleteSpec', // 按钮ID
            companyName: userInfoObj.TELLERCOMPANY,
            productName: productName.value,
            specAttrCate: specCate,
          };

          mainServiceApi(params)
            .then((res) => {
              console.warn(res);
              editedSpecsList.value.splice(index, 1);
              message.success('规格删除成功');
            })
            .catch((error) => {
              message.error(`删除失败：${error.message || '服务器错误'}`);
            });
        }
      });
    },
  });
};

// 保存更改
const saveChanges = () => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  // 验证产品名称
  if (!productName.value.trim()) {
    Modal.error({
      title: '新增失败',
      content: '请输入产品名称',
    });
    return;
  }

  // 验证至少有一个规格类型
  if (editedSpecsList.value.length === 0) {
    Modal.error({
      title: '新增失败',
      content: '请至少添加一个规格类型',
    });
    return;
  }

  // 检查是否有空的规格值
  const hasEmptyNewSpec = editedSpecsList.value.some((spec) =>
    spec.queryProductSpecValue.some(
      (item) => item.isNew === 'true' && !item.specValue.trim(),
    ),
  );
  if (hasEmptyNewSpec) {
    Modal.error({
      title: '新增失败',
      content: '请填写所有新增的规格值',
    });
    return;
  }

  // 检查是否选择了库存和价格规格
  // if (
  //   selectedStockSpecs.value.length === 0 ||
  //   selectedPriceSpecs.value.length === 0
  // ) {
  //   Modal.error({
  //     title: '新增失败',
  //     content: '请选择决定库存和价格的规格',
  //   });
  //   return;
  // }
  Modal.confirm({
    title: '确认新增',
    content: '确定要新增此产品吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        // 构建保存的数据
        const toSaveSpecs = editedSpecsList.value
          .map((spec) => ({
            specCate: spec.specCate,
            queryProductSpecValue: spec.queryProductSpecValue
              .filter(
                (item) =>
                  item.specValue.trim() &&
                  item.deleteStatus !== 'pending_delete',
              )
              .map((item) => ({
                specValue: item.specValue,
                specCate: item.specCate,
                isNew: item.isNew,
                deleteStatus: item.deleteStatus,
              })),
            productName: productName.value,
          }))
          .filter((spec) => spec.queryProductSpecValue.length > 0);

        // 4. 执行保存
        if (toSaveSpecs.length > 0) {
          const saveParams = {
            bllID: 'factoryProductStandard',
            serviceID: 1,
            fileDate: JSON.stringify({
              queryProduct: [
                {
                  companyName: userInfoObj.TELLERCOMPANY,
                  productName: productName.value,
                  specAttrCateListForWare: selectedStockSpecs.value.join(','),
                  specAttrCateListForPrice: selectedPriceSpecs.value.join(','),
                  queryProductSpecCate: toSaveSpecs,
                },
              ],
            }),
          };
          await mainSendFileDataApi(saveParams);
          message.success('新增产品成功');
        } else {
          message.warning('没有需要新增的产品信息');
        }
        closeModal();

        emit('refresh'); // 触发父组件刷新
      } catch (error) {
        message.error(`操作失败：${error.message || '服务器错误'}`);
      }
    },
  });
};

// 暴露方法给父组件
defineExpose({ open });
</script>

<template>
  <div
    v-if="isOpen"
    class="absolute inset-0 h-full overflow-y-auto"
    style="z-index: 202"
    @click.self="closeModal"
  >
    <!-- 弹窗容器 -->
    <div class="flex h-full items-end justify-center text-center">
      <div
        class="relative flex h-full w-full transform flex-col overflow-hidden bg-white text-left shadow-xl transition-all"
      >
        <!-- 头部 -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="flex items-center text-lg font-medium text-gray-800">
              新增产品标准
            </h3>
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
        <!--  产品名称和规格选择 -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="space-y-4">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="flex-1 text-sm font-medium text-gray-900">产品：</h4>
                <input
                  v-model="productName"
                  type="text"
                  class="flex-1 rounded-md border border-gray-300 px-1.5 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入产品名称"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <!-- 决定库存的规格 -->
              <div class="flex items-center justify-between">
                <h4 class="flex-1 text-sm font-medium text-gray-900">
                  决定库存的规格：
                </h4>
                <Select
                  v-if="availableSpecTypes.length > 0"
                  v-model:value="selectedStockSpecs"
                  mode="multiple"
                  placeholder="请选择库存规格"
                  @change="handleStockSpecChange"
                  class="flex-1"
                >
                  <SelectOption
                    v-for="type in availableSpecTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getSpecTypeName(type) }}
                  </SelectOption>
                </Select>
                <p
                  v-if="availableSpecTypes.length === 0"
                  class="py-1.5 text-sm text-gray-500"
                >
                  暂无规格类型，请先添加
                </p>
              </div>

              <!-- 决定价格的规格 -->
              <div class="flex items-center justify-between">
                <h4 class="flex-1 text-sm font-medium text-gray-900">
                  决定价格的规格：
                </h4>
                <Select
                  v-if="availableSpecTypes.length > 0"
                  v-model:value="selectedPriceSpecs"
                  mode="multiple"
                  style="width: 300px"
                  placeholder="请选择价格规格"
                  @change="handlePriceSpecChange"
                  class="flex-1"
                >
                  <SelectOption
                    v-for="type in availableSpecTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getSpecTypeName(type) }}
                  </SelectOption>
                </Select>
                <p
                  v-if="availableSpecTypes.length === 0"
                  class="py-1.5 text-sm text-gray-500"
                >
                  暂无规格类型，请先添加
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 添加新规格类型 -->
        <div class="flex-shrink-0 border-b border-gray-200 px-6 py-4">
          <div
            class="flex items-center gap-3 rounded-lg border bg-gray-50 px-6 py-4"
          >
            <h4 class="whitespace-nowrap text-sm font-medium text-gray-900">
              添加新规格类型：
            </h4>
            <input
              v-model="newSpecTypeName"
              type="text"
              class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例如：颜色、尺寸等"
              @keyup.enter="addNewSpecType"
            />
            <button
              class="inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50"
              @click="addNewSpecType"
              :disabled="!newSpecTypeName.trim()"
              :class="{
                'cursor-not-allowed opacity-50': !newSpecTypeName.trim(),
              }"
            >
              添加规格类型
            </button>
          </div>
        </div>

        <!-- 可滚动的规格内容区域 -->
        <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
          <!-- 3. 规格类型列表 -->
          <div v-if="editedSpecsList.length > 0" class="space-y-8">
            <div
              v-for="(spec, index) in editedSpecsList"
              :key="index"
              class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-medium text-gray-900">
                  规格：{{ spec.specCate }}
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="addSpecValue(spec.specCate)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    添加{{ spec.specCate }}
                  </button>
                  <button
                    @click="removeSpecType(spec.specCate, index)"
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    删除规格
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="(value, valueIndex) in spec.queryProductSpecValue"
                  :key="valueIndex"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="value.specValue"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    :placeholder="`请输入${spec.specCate}值`"
                  />
                  <button
                    @click="removeSpecValue(spec.specCate, valueIndex)"
                    class="rounded-md text-red-500 hover:text-red-700"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      :class="{
                        'text-red-500':
                          value.deleteStatus !== 'pending_delete' &&
                          value.isNew !== 'true',
                        'text-blue-500':
                          value.deleteStatus === 'pending_delete',
                        'text-gray-500': value.isNew === 'true',
                      }"
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

          <!-- 无规格时的提示 -->
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center"
          >
            <svg
              class="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无规格类型</h3>
            <p class="mt-1 text-sm text-gray-500">请在上方添加规格类型</p>
          </div>
        </div>

        <!-- 底部按钮 -->
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
