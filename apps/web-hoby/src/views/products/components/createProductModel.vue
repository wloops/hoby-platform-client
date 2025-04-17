<script setup>
import { computed, defineEmits, ref } from 'vue';

import { message, Modal, Select } from 'ant-design-vue';

import { mainSendFileDataApi } from '#/api';
import { useMainGetData } from '#/composables';

const emit = defineEmits(['refresh']);
const isOpen = ref(false);
const productName = ref('');
const srlID = ref('');
// const newSpecTypeName = ref('');
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);
const distributorPrice = ref('0.00');
const terminalPrice = ref('0.00');

// 规格列表数据结构
// const specsList = ref([]);

// const availableSpecCategories = ref([]); // 存储所有可选的规格类型
const selectedNewSpecTypes = ref([]); // 存储新选择的规格类型

// 获取所有可用的规格类型
const availableSpecTypes = computed(() => {
  return editedSpecsList.value.map((item) => item.specCate);
});

// 获取规格类型名称
const getSpecTypeName = (type) => type;

// 重置表单
const resetForm = () => {
  // productName.value = '';
  srlID.value = '';
  // selectedStockSpecs.value = [];
  // selectedPriceSpecs.value = [];
  editedSpecsList.value = [];
  selectedNewSpecTypes.value = [];
};

const editedSpecsList = ref([]);
const productData = ref(null);
// 打开弹窗
const open = async (product) => {
  productData.value = product;
  resetForm();
  editedSpecsList.value = [];

  const list = await getSpecTypeNameList(product);

  // 初始化规格数据 - 修正字段映射
  editedSpecsList.value = (list.queryProductSpecCate || []).map((spec) => ({
    specCate: spec.specCate,
    productName: spec.productName,
    queryProductSpecValue: (spec.queryProductSpecValue || []).map((value) => ({
      specValue: value.specValue,
      specCate: value.specCate,
      isNew: 'false', // 标记为已有数据
      deleteStatus: 'normal', // 初始状态
    })),
  }));

  productName.value = product.name;
  selectedStockSpecs.value = list.specAttrCateListForWare
    ? list.specAttrCateListForWare.split(',')
    : [];
  selectedPriceSpecs.value = list.specAttrCateListForPrice
    ? list.specAttrCateListForPrice.split(',')
    : [];
  isOpen.value = true;
};

// 获取规格类型名称
const getSpecTypeNameList = async (product) => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  const reqParams = {
    pageID: '',
    pageDataGrpID: 'factoryProductStandard',
    companyName: userInfoObj.TELLERCOMPANY,
    productName: product.name,
    // srlID: product.model,
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
  const specItem = editedSpecsList.value.find(
    (item) => item.specCate === specCate,
  );
  if (specItem) {
    if (!specItem.queryProductSpecValue) {
      specItem.queryProductSpecValue = [];
    }
    specItem.queryProductSpecValue.push({
      productName: productData.value.name,
      srlID: srlID.value,
      specValue: '',
      specCate,
      isNew: 'true',
      deleteStatus: 'normal',
    });
  }
};

// 删除规格值
const removeSpecValue = (specCate, index) => {
  const specItem = editedSpecsList.value.find(
    (item) => item.specCate === specCate,
  );
  if (specItem && specItem.queryProductSpecValue) {
    const specValue = specItem.queryProductSpecValue[index];
    if (specValue.isNew === 'true') {
      // 直接删除新增的规格值
      specItem.queryProductSpecValue.splice(index, 1);

      // 如果删除后该规格类型下没有值了，移除整个规格类型
      if (specItem.queryProductSpecValue.length === 0) {
        const specIndex = editedSpecsList.value.findIndex(
          (item) => item.specCate === specCate,
        );
        if (specIndex !== -1) {
          editedSpecsList.value.splice(specIndex, 1);
        }
      }
    } else {
      // 标记为待删除状态
      specValue.deleteStatus =
        specValue.deleteStatus === 'normal' ? 'pending_delete' : 'normal';
    }
  }
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
  // 验证产品型号
  if (!srlID.value.trim()) {
    Modal.error({
      title: '新增失败',
      content: '请输入产品型号',
    });
    return;
  }

  // 验证至少有一个规格类型
  // if (editedSpecsList.value.length === 0) {
  //   Modal.error({
  //     title: '新增失败',
  //     content: '请至少添加一个规格类型',
  //   });
  //   return;
  // }

  // 检查是否有空的规格值
  const hasEmptyNewSpec = editedSpecsList.value.some((spec) => {
    const specValues = spec.queryProductSpecValue || [];
    return specValues.some(
      (item) => item.isNew === 'true' && !item.specValue.trim(),
    );
  });

  if (hasEmptyNewSpec) {
    Modal.error({
      title: '保存失败',
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
  //     title: '保存失败',
  //     content: '请选择决定库存和价格的规格',
  //   });
  //   return;
  // }
  Modal.confirm({
    title: '确认新增',
    content: '确定要新增此产品型号吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        // 准备数据
        const payload = {
          productModel: [
            {
              companyName: productData.value.company,
              productName: productName.value,
              srlID: srlID.value,
              specAttrCateListForWare: selectedStockSpecs.value.join(','),
              specAttrCateListForPrice: selectedPriceSpecs.value.join(','),
              distributorPrice: distributorPrice.value,
              terminalPrice: terminalPrice.value,
              productModelSpecCate: editedSpecsList.value.map((spec) => ({
                srlID: srlID.value,
                specCate: spec.specCate,
                productName: productName.value,
                productModelSpecValue: (spec.queryProductSpecValue || [])
                  .filter((item) => item.deleteStatus !== 'pending_delete')
                  .map((item) => ({
                    srlID: srlID.value,
                    specValue: item.specValue,
                    specCate: spec.specCate,
                    productName: productName.value,
                  })),
              })),
            },
          ],
        };

        // 区分新增和修改操作
        const isEdit = !!productData.value.model;
        const serviceID = isEdit ? 2 : 1; // 1-新增 2-修改

        const params = {
          bllID: 'hobyFactoryPrdModelPreview',
          serviceID,
          fileDate: JSON.stringify(payload),
        };

        await mainSendFileDataApi(params);
        message.success(isEdit ? '修改成功' : '新增产品型号成功');
        // closeModal();
        emit('refresh');
      } catch (error) {
        message.error(`操作失败：${error.message}`);
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
              创建产品型号
            </h3>
            <div
              class="flex flex-1 items-center justify-center text-lg font-medium text-gray-500"
            >
              <span class="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
              {{ productName }}
            </div>
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
        <!--  内容区域 -->
        <div
          class="flex-grow overflow-y-auto border-b border-gray-200 bg-white"
        >
          <!-- 产品信息区域 -->
          <div class="border-b border-gray-200 px-6 py-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- 第一行 -->
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">型号：</h4>
                <input
                  v-model="srlID"
                  type="text"
                  class="h-8 flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入产品型号"
                />
              </div>
              <div></div>
              <!-- 空单元格保持对齐 -->

              <!-- 第二行 -->
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">
                  SKU规格清单：
                </h4>
                <Select
                  v-model:value="selectedStockSpecs"
                  mode="multiple"
                  class="h-8 flex-1 rounded-md border border-gray-300 bg-gray-100 shadow-sm"
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
              </div>
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">
                  价格规格清单：
                </h4>
                <Select
                  v-model:value="selectedPriceSpecs"
                  mode="multiple"
                  class="h-8 flex-1 rounded-md border border-gray-300 bg-gray-100 shadow-sm"
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
              </div>

              <!-- 第三行 -->
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">
                  分销商价格：
                </h4>
                <input
                  v-model="distributorPrice"
                  type="text"
                  class="h-8 flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入分销商价格"
                />
              </div>
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">
                  终端价格：
                </h4>
                <input
                  v-model="terminalPrice"
                  type="text"
                  class="h-8 flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入终端价格"
                />
              </div>
            </div>
          </div>
          <!-- 规格区域 -->
          <div class="px-6 py-5">
            <!-- 3. 规格类型列表 -->
            <div class="space-y-8">
              <div
                v-for="(spec, index) in editedSpecsList"
                :key="index"
                class="spec-section rounded-md border bg-white p-2 shadow-sm"
              >
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="text-base font-medium text-gray-900">
                    规格：{{ spec.specCate }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <button
                      class="text-sm font-medium text-blue-600 hover:text-blue-700"
                      @click="addSpecValue(spec.specCate)"
                    >
                      添加{{ spec.specCate }}
                    </button>
                    <!-- <button
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                    @click="removeSpecType(item.specCate, index)"
                  >
                    删除规格
                  </button> -->
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
                >
                  <div
                    v-for="(value, valueIndex) in spec.queryProductSpecValue"
                    :key="valueIndex"
                    class="flex items-center gap-2 rounded-md bg-white p-2 transition-colors hover:bg-gray-50"
                  >
                    <input
                      v-model="value.specValue"
                      type="text"
                      class="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      :placeholder="`请输入${spec.specCate}`"
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
                      @click="removeSpecValue(spec.specCate, valueIndex)"
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
