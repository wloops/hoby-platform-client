<script setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';

import { message, Modal, Select } from 'ant-design-vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  productId: {
    type: [Number, String],
    required: true,
  },
  specifications: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

const { Option: SelectOption } = Select;

// 编辑状态的规格数据
const editedSpecs = reactive({});

// 新规格类型名称
const newSpecTypeName = ref('');

// 已选择的规格类型
const selectedStockSpecs = ref(['sizes', 'colors']);
const selectedPriceSpecs = ref(['sizes', 'colors']);

// 获取所有可用的规格类型
const availableSpecTypes = computed(() => {
  return Object.keys(editedSpecs);
});

// 切换规格类型选择 - 修改为直接赋值
const handleStockSpecChange = (values) => {
  selectedStockSpecs.value = values;
};

const handlePriceSpecChange = (values) => {
  selectedPriceSpecs.value = values;
};

// 监听规格数据变化，初始化编辑状态
watch(
  () => props.specifications,
  (newSpecs) => {
    if (newSpecs) {
      // 清空现有数据
      Object.keys(editedSpecs).forEach((key) => {
        delete editedSpecs[key];
      });

      // 复制所有规格数据
      Object.keys(newSpecs).forEach((key) => {
        editedSpecs[key] = [...newSpecs[key]];
      });
    }
  },
  { immediate: true },
);

// 添加规格值
const addSpecValue = (specType) => {
  editedSpecs[specType].push('');
};

// 删除规格值
const removeSpecValue = (specType, index) => {
  editedSpecs[specType].splice(index, 1);
};

// 添加新规格类型
const addNewSpecType = () => {
  if (!newSpecTypeName.value.trim()) return;

  // 转换为驼峰命名作为key
  const specTypeKey = newSpecTypeName.value
    .trim()
    .replaceAll(/[\s-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());

  // 检查是否已存在
  if (editedSpecs[specTypeKey]) {
    message.error(`规格类型 "${newSpecTypeName.value}" 已存在`);
    return;
  }

  // 添加新规格类型
  editedSpecs[specTypeKey] = [];

  // 清空输入
  newSpecTypeName.value = '';
};

// 删除规格类型
const removeSpecType = (specType) => {
  Modal.confirm({
    title: '提示',
    content: `确定要删除 "${getSpecTypeName(specType)}" 规格吗？`,
    onOk: () => {
      delete editedSpecs[specType];
    },
  });
};

// 获取规格类型名称
const getSpecTypeName = (specType) => {
  const names = {
    colors: '颜色',
    sizes: '尺寸',
    materials: '材质',
  };
  return names[specType] || specType;
};

// 保存更改
const saveChanges = () => {
  // 过滤掉空值
  const updatedSpecs = {};

  Object.keys(editedSpecs).forEach((key) => {
    const filteredValues = editedSpecs[key].filter((value) => value.trim());
    if (filteredValues.length > 0) {
      updatedSpecs[key] = filteredValues;
    }
  });

  emit('save', {
    productId: props.productId,
    specifications: updatedSpecs,
    stockSpecs: selectedStockSpecs.value,
    priceSpecs: selectedPriceSpecs.value,
  });
};

// 关闭模态框
const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Modal -->
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <div
        class="relative flex max-h-[90vh] transform flex-col overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
      >
        <!-- Header -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">编辑产品规格</h3>
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

        <!-- 固定的规格选择区域 -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="space-y-4">
            <!-- 库存规格选择 -->
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">
                决定库存的规格：
              </h4>
              <Select
                v-model:value="selectedStockSpecs"
                mode="multiple"
                style="width: 300px"
                placeholder="请选择库存规格"
                @change="handleStockSpecChange"
              >
                <SelectOption
                  v-for="type in availableSpecTypes"
                  :key="type"
                  :value="type"
                >
                  {{ getSpecTypeName(type) }}
                </SelectOption>
              </Select>
            </div>

            <!-- 价格规格选择 -->
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">
                决定价格的规格：
              </h4>
              <Select
                v-model:value="selectedPriceSpecs"
                mode="multiple"
                style="width: 300px"
                placeholder="请选择价格规格"
                @change="handlePriceSpecChange"
              >
                <SelectOption
                  v-for="type in availableSpecTypes"
                  :key="type"
                  :value="type"
                >
                  {{ getSpecTypeName(type) }}
                </SelectOption>
              </Select>
            </div>
          </div>
        </div>

        <!-- 可滚动的规格内容区域 -->
        <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
          <div class="space-y-8">
            <!-- 现有规格 -->
            <div
              v-for="(values, specType) in editedSpecs"
              :key="specType"
              class="spec-section rounded-md border bg-white p-2 shadow-sm"
            >
              <div class="mb-4 flex items-center justify-between">
                <h4 class="text-base font-medium text-gray-900">
                  {{ getSpecTypeName(specType) }}规格
                </h4>
                <div class="flex items-center gap-2">
                  <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    @click="addSpecValue(specType)"
                  >
                    添加{{ getSpecTypeName(specType) }}
                  </button>
                  <button
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                    @click="removeSpecType(specType)"
                  >
                    删除规格
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="(value, index) in values"
                  :key="index"
                  class="flex items-center gap-2 rounded-md bg-white p-2 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="text"
                    v-model="editedSpecs[specType][index]"
                    class="min-w-0 flex-1 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :placeholder="`请输入${getSpecTypeName(specType)}`"
                  />
                  <button
                    class="flex-shrink-0 text-red-500 hover:text-red-700"
                    @click="removeSpecValue(specType, index)"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加新规格类型 - 固定在底部 -->
        <div
          class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4"
        >
          <div class="flex items-center gap-3">
            <h4 class="whitespace-nowrap text-sm font-medium text-gray-900">
              添加新规格类型：
            </h4>
            <input
              type="text"
              v-model="newSpecTypeName"
              class="flex-1 rounded-md border px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入规格类型名称"
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

        <!-- Footer -->
        <div
          class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6"
        >
          <button
            class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3"
            @click="saveChanges"
          >
            保存
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
