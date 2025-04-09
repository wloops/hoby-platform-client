<script setup>
import { computed, ref } from 'vue';

import { Modal, Select } from 'ant-design-vue';

import { useMainGetData } from '#/composables';

const isOpen = ref(false);
const productName = ref('');
const srlID = ref('');
// const newSpecTypeName = ref('');
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);

// 规格列表数据结构
// const specsList = ref([]);

const editedSpecsList = ref([]);
const productData = ref(null);
// const availableSpecCategories = ref([]); // 存储所有可选的规格类型
const selectedNewSpecTypes = ref([]); // 存储新选择的规格类型

// 获取所有可用的规格类型
const availableSpecTypes = computed(() => {
  return editedSpecsList.value.map((item) => item.specCate);
});

// 获取规格类型名称
const getSpecTypeName = (type) => type;

// 处理规格变化
const handleStockSpecChange = (value) => (selectedStockSpecs.value = value);
const handlePriceSpecChange = (value) => (selectedPriceSpecs.value = value);

// 重置表单
const resetForm = () => {
  // productName.value = '';
  srlID.value = '';
  // selectedStockSpecs.value = [];
  // selectedPriceSpecs.value = [];
  editedSpecsList.value = [];
  selectedNewSpecTypes.value = [];
};

// 打开弹窗
const open = async (product) => {
  productData.value = product;
  resetForm();
  editedSpecsList.value = [];
  let list = [];
  list = await getSpecTypeNameList(product);
  // 初始化时给每个规格值添加 isNew 字段
  list.queryProductSpecCate.forEach((spec) => {
    spec.queryProductSpecValue.forEach((value) => {
      value.isNew = 'false'; // 已有数据标记为非新增
      value.deleteStatus = 'normal'; // 初始化状态为normal
    });
  });
  editedSpecsList.value = list.queryProductSpecCate;

  console.warn('打开弹窗', productData.value);
  productName.value = product.name;
  selectedStockSpecs.value = list.specAttrCateListForWare
    ? list.specAttrCateListForWare.split(',')
    : [];
  selectedPriceSpecs.value = list.specAttrCateListForPrice
    ? list.specAttrCateListForPrice.split(',')
    : [];
  isOpen.value = true;
  // 如果有已有规格，初始化 editedSpecsList
  // if (product.existingSpecs) {
  //   editedSpecsList.value = product.existingSpecs.map((spec) => ({
  //     ...spec,
  //     productModelSpecValue: spec.productModelSpecValue.map((v) => ({
  //       ...v,
  //       name: v.specValue, // 添加 name 属性用于 v-model 绑定
  //     })),
  //   }));
  // }
};

// 获取规格类型名称
const getSpecTypeNameList = async (product) => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  const reqParams = {
    pageID: '',
    pageDataGrpID: 'factoryProductStandard',
    productName: product.name,
    companyName: userInfoObj.TELLERCOMPANY,
  };
  const { data } = await useMainGetData(reqParams);

  return data.value;
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
  editedSpecsList.value.forEach((item) => {
    if (item.specCate === specCate) {
      const specValue = item.queryProductSpecValue[index];
      if (specValue.isNew === 'true') {
        // 如果是新增的规格值，直接从数组中移除
        item.queryProductSpecValue.splice(index, 1);
      } else {
        // 如果是已有规格值，标记为删除状态
        specValue.deleteStatus =
          specValue.deleteStatus === 'normal' ? 'pending_delete' : 'normal';
      }
    }
  });
};

// 添加新规格类型
// const addNewSpecType = () => {
//   if (selectedNewSpecTypes.value.length === 0) {
//     message.warning('请至少选择一个规格类型');
//     return;
//   }

//   selectedNewSpecTypes.value.forEach((specCate) => {
//     // 检查是否已存在
//     const alreadyExists = editedSpecsList.value.some(
//       (spec) => spec.specCate === specCate,
//     );

//     if (!alreadyExists) {
//       // 添加到 editedSpecsList
//       editedSpecsList.value.push({
//         productName: productData.value.name,
//         srlID: productData.value.model,
//         specCate,
//         productModelSpecValue: [
//           {
//             productName: productData.value.name,
//             srlID: productData.value.model,
//             specValue: '',
//             specCate,
//             isNew: 'true',
//             name: '', // 用于 v-model 绑定
//           },
//         ],
//       });
//     }
//   });

//   selectedNewSpecTypes.value = [];
//   fetchAvailableSpecCategories();
// };

// 删除规格类型
// const removeSpecType = (index) => {
//   const specType = editedSpecsList.value[index].specCate;

//   Modal.confirm({
//     title: '确认删除',
//     content: `确定要删除 "${specType}" 规格类型吗？此操作无法撤销。`,
//     okText: '确认删除',
//     cancelText: '取消',
//     onOk: () => {
//       // 从已选的规格中移除
//       selectedStockSpecs.value = selectedStockSpecs.value.filter(
//         (spec) => spec !== specType,
//       );
//       selectedPriceSpecs.value = selectedPriceSpecs.value.filter(
//         (spec) => spec !== specType,
//       );

//       editedSpecsList.value.splice(index, 1);
//     },
//   });
// };

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
  const saveData = {
    name: productName.value.trim(),
    srlID: srlID.value.trim(),
    stockSpecs: selectedStockSpecs.value,
    priceSpecs: selectedPriceSpecs.value,
    specs: editedSpecsList.value.map((spec) => ({
      specCate: spec.specCate,
      productModelSpecValue: spec.productModelSpecValue.map((v) => ({
        ...v,
        specValue: v.name?.trim() || v.specValue?.trim() || '',
      })),
    })),
  };

  console.warn('保存的产品数据:', saveData);

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
              创建产品型号
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
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-center gap-2">
                <h4 class="flex-1 text-sm font-medium text-gray-900">产品：</h4>
                <input
                  v-model="productName"
                  type="text"
                  disabled
                  class="opshadow-sm flex-1 cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-1.5 py-2"
                  placeholder="请输入产品名称"
                />
              </div>
              <div class="flex items-center gap-2">
                <h4 class="flex-1 text-sm font-medium text-gray-900">型号：</h4>
                <input
                  v-model="srlID"
                  type="text"
                  class="flex-1 rounded-md border border-gray-300 px-1.5 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入产品型号"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <!-- SKU规格清单 -->
              <div class="flex items-center justify-between">
                <h4 class="flex-1 text-sm font-medium text-gray-900">
                  SKU规格清单：
                </h4>
                <Select
                  v-model:value="selectedStockSpecs"
                  mode="multiple"
                  style="width: 300px"
                  placeholder=""
                  @change="handleStockSpecChange"
                  class="flex-1 rounded-md border border-gray-300 bg-gray-100 shadow-sm"
                  disabled
                >
                  <SelectOption
                    v-for="type in availableSpecTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getSpecTypeName(type) }}
                  </SelectOption>
                </Select>
                <!-- <p
                  v-if="availableSpecTypes.length === 0"
                  class="py-1.5 text-sm text-gray-500"
                >
                  暂无规格类型，请先添加
                </p> -->
              </div>

              <!-- 价格规格清单 -->
              <div class="flex items-center justify-between">
                <h4 class="flex-1 text-sm font-medium text-gray-900">
                  价格规格清单：
                </h4>
                <Select
                  v-model:value="selectedPriceSpecs"
                  mode="multiple"
                  style="width: 300px"
                  placeholder=""
                  @change="handlePriceSpecChange"
                  class="flex-1 rounded-md border border-gray-300 bg-gray-100 shadow-sm"
                  disabled
                >
                  <SelectOption
                    v-for="type in availableSpecTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getSpecTypeName(type) }}
                  </SelectOption>
                </Select>
                <!-- <p
                  v-if="availableSpecTypes.length === 0"
                  class="py-1.5 text-sm text-gray-500"
                >
                  暂无规格类型，请先添加
                </p> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 可滚动的规格内容区域 -->
        <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
          <!-- 2. 添加新规格类型 -->
          <!-- <div class="mb-6 rounded-lg border bg-gray-50 p-4">
            <div class="flex items-center gap-3">
              <h4 class="whitespace-nowrap text-sm font-medium text-gray-900">
                添加新规格类型：
              </h4>
              <Select
                v-model:value="selectedNewSpecTypes"
                mode="multiple"
                style="width: 100%"
                placeholder="请选择要添加的规格类型"
                :options="
                  availableSpecCategories.map((item) => ({
                    value: item.specCate,
                    label: item.specCate,
                  }))
                "
              >
                <SelectOption
                  v-for="item in availableSpecCategories"
                  :key="item.specCate"
                  :value="item.specCate"
                >
                  {{ item.specCate }}
                </SelectOption>
              </Select>
              <button
                class="inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                @click="addNewSpecType"
                :disabled="selectedNewSpecTypes.length === 0"
                :class="{
                  'cursor-not-allowed opacity-50':
                    selectedNewSpecTypes.length === 0,
                }"
              >
                添加规格类型
              </button>
            </div>
          </div> -->

          <!-- 3. 规格类型列表 -->
          <div class="space-y-8">
            <div
              v-for="(item, index) in editedSpecsList"
              :key="index"
              class="spec-section rounded-md border bg-white p-2 shadow-sm"
            >
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-base font-medium text-gray-900">
                  规格：{{ item.specCate }}
                </h3>
                <div class="flex items-center gap-2">
                  <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    @click="addSpecValue(item.specCate)"
                  >
                    添加{{ item.specCate }}
                  </button>
                  <!-- <button
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                    @click="removeSpecType(item.specCate, index)"
                  >
                    删除规格
                  </button> -->
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="(value, index) in item.queryProductSpecValue"
                  :key="index"
                  class="flex items-center gap-2 rounded-md bg-white p-2 transition-colors hover:bg-gray-50"
                >
                  <input
                    v-model="value.specValue"
                    type="text"
                    class="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    :placeholder="`请输入${item.specCate}`"
                    :disabled="value.isNew === 'false'"
                    :class="{
                      'cursor-not-allowed bg-gray-100 focus:outline-none focus:ring-0':
                        value.isNew === 'false',
                      'bg-white': value.isNew === 'true',
                      'text-gray-400 line-through':
                        value.deleteStatus === 'pending_delete',
                    }"
                  />
                  <button
                    class="flex-shrink-0 text-red-500 hover:text-red-700"
                    @click="removeSpecValue(item.specCate, index)"
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
                        v-if="
                          value.deleteStatus !== 'pending_delete' &&
                          value.isNew !== 'true'
                        "
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                      <path
                        v-if="value.deleteStatus === 'pending_delete'"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M20 13.5a6.5 6.5 0 0 1-6.5 6.5H6v-2h7.5c2.5 0 4.5-2 4.5-4.5S16 9 13.5 9H7.83l3.08 3.09L9.5 13.5L4 8l5.5-5.5l1.42 1.41L7.83 7h5.67a6.5 6.5 0 0 1 6.5 6.5"
                      />
                      <path
                        v-if="value.isNew === 'true'"
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
          <!-- <div
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
          </div> -->
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
