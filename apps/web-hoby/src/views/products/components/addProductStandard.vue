<script setup>
import { computed, ref } from 'vue';

import { Modal, Select } from 'ant-design-vue';

const isOpen = ref(false);
const productName = ref('');
const newSpecTypeName = ref('');
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);

// 规格列表数据结构
const specsList = ref([]);

// 计算可用的规格类型
const availableSpecTypes = computed(() => {
  return specsList.value.map((spec) => spec.type);
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
  specsList.value = [];
};

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
const addSpecValue = (specIndex) => {
  specsList.value[specIndex].values.push({ name: '' });
};

// 删除规格值
const removeSpecValue = (specIndex, valueIndex) => {
  if (specsList.value[specIndex].values.length <= 1) {
    Modal.warning({
      title: '操作提示',
      content: '每个规格类型至少需要保留一个规格值',
    });
    return;
  }
  specsList.value[specIndex].values.splice(valueIndex, 1);
};

// 添加新规格类型
const addNewSpecType = () => {
  const typeName = newSpecTypeName.value.trim();
  if (!typeName) return;

  // 检查是否已存在
  if (availableSpecTypes.value.includes(typeName)) {
    Modal.error({
      title: '添加失败',
      content: `规格类型 "${typeName}" 已存在，请使用不同的名称`,
    });
    return;
  }

  // 添加新规格类型
  specsList.value.push({
    type: typeName,
    values: [{ name: '' }], // 默认添加一个空值
  });

  // 清空输入框
  newSpecTypeName.value = '';
};

// 删除规格类型
const removeSpecType = (index) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 "${specsList.value[index].type}" 规格类型吗？此操作无法撤销。`,
    okText: '确认删除',
    cancelText: '取消',
    onOk: () => {
      // 从已选的规格中移除
      selectedStockSpecs.value = selectedStockSpecs.value.filter(
        (spec) => spec !== specsList.value[index]?.type,
      );
      selectedPriceSpecs.value = selectedPriceSpecs.value.filter(
        (spec) => spec !== specsList.value[index]?.type,
      );

      specsList.value.splice(index, 1);
    },
  });
};

// 保存更改
const saveChanges = () => {
  // 验证产品名称
  if (!productName.value.trim()) {
    Modal.error({
      title: '保存失败',
      content: '请输入产品名称',
    });
    return;
  }

  // 验证至少有一个规格类型
  if (specsList.value.length === 0) {
    Modal.error({
      title: '保存失败',
      content: '请至少添加一个规格类型',
    });
    return;
  }

  // 检查是否有空的规格值
  const hasEmptyValue = specsList.value.some((spec) =>
    spec.values.some((value) => !value.name.trim()),
  );

  if (hasEmptyValue) {
    Modal.error({
      title: '保存失败',
      content: '请填写所有规格值',
    });
    return;
  }

  // 检查是否选择了库存和价格规格
  if (
    selectedStockSpecs.value.length === 0 ||
    selectedPriceSpecs.value.length === 0
  ) {
    Modal.error({
      title: '保存失败',
      content: '请选择决定库存和价格的规格',
    });
    return;
  }

  // 构建保存的数据
  const productData = {
    name: productName.value.trim(),
    stockSpecs: selectedStockSpecs.value,
    priceSpecs: selectedPriceSpecs.value,
    specs: specsList.value.map((spec) => ({
      type: spec.type,
      values: spec.values.map((v) => v.name.trim()),
    })),
  };

  console.warn('保存的产品数据:', productData);

  Modal.success({
    title: '保存成功',
    content: '产品标准已保存',
  });

  closeModal();
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

        <!-- 主体内容 - 固定高度，可滚动 -->
        <div class="flex-grow overflow-y-auto px-6 py-4">
          <!-- 1. 产品名称和规格选择 -->
          <div class="mb-6 space-y-4">
            <div class="flex items-center gap-2">
              <label
                class="mb-1 block flex-none text-sm font-medium text-gray-700"
                >产品：</label
              >
              <input
                v-model="productName"
                type="text"
                class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入产品名称"
              />
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
                  style="width: 300px"
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

          <!-- 2. 添加新规格类型 -->
          <div class="mb-6 rounded-lg border bg-gray-50 p-4">
            <div class="flex items-center gap-3">
              <h3 class="whitespace-nowrap text-sm font-medium text-gray-900">
                添加新规格类型：
              </h3>
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

          <!-- 3. 规格类型列表 -->
          <div v-if="specsList.length > 0" class="space-y-4">
            <div
              v-for="(spec, index) in specsList"
              :key="index"
              class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-medium text-gray-900">规格：{{ spec.type }}</h3>
                <div class="flex gap-2">
                  <button
                    @click="addSpecValue(index)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    添加{{ spec.type }}
                  </button>
                  <button
                    @click="removeSpecType(index)"
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    删除规格
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="(value, valueIndex) in spec.values"
                  :key="valueIndex"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="value.name"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    :placeholder="`请输入${spec.type}值`"
                  />
                  <button
                    @click="removeSpecValue(index, valueIndex)"
                    class="rounded-md text-red-500 hover:text-red-700"
                    :title="`删除${value.name || '该'}${spec.type}`"
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
