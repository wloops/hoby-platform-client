<script setup>
import { computed, defineEmits, nextTick, ref } from 'vue';

import { message, Modal, Select } from 'ant-design-vue';

import { mainSendFileDataApi } from '#/api';
import { useMainGetData } from '#/composables';

const emit = defineEmits(['refresh']);
const isOpen = ref(false);
const productName = ref(null);
const srlID = ref('');
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);

// 产品列表
const productList = ref([]);
// 规格数据
// const specData = ref({});

// 获取规格类型名称
// const getSpecTypeName = (type) => type;

// 处理规格变化
const handleStockSpecChange = (value) => (selectedStockSpecs.value = value);
const handlePriceSpecChange = (value) => (selectedPriceSpecs.value = value);

// 重置表单
const resetForm = () => {
  productName.value = null;
  srlID.value = '';
  selectedStockSpecs.value = [];
  selectedPriceSpecs.value = [];
  editedSpecsList.value = [];
};

const editedSpecsList = ref([]);
// 添加搜索过滤方法
const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

// 添加加载状态
const loadingProduct = ref(false);
const loadingSpecs = ref(false);

// 打开弹窗
const open = async () => {
  try {
    loadingProduct.value = true;
    resetForm();
    editedSpecsList.value = [];

    // 获取产品列表
    const productParams = {
      pageID: 'productStandards',
      pageDataGrpID: 'queryProduct',
    };

    const { data: productData } = await useMainGetData(productParams);

    // 处理产品列表数据
    if (!productData.value) {
      throw new Error('产品数据获取失败');
    }

    const rawProductList = productData.value.queryProduct || productData.value;
    if (!Array.isArray(rawProductList)) {
      throw new TypeError('产品数据格式不正确');
    }

    productList.value = rawProductList
      .filter((item) => item && item.productName)
      .map((item) => ({
        value: item.productName,
        label: item.productName,
      }));

    isOpen.value = true;
  } catch (error) {
    message.error(`数据加载失败: ${error.message}`);
    console.error('详细错误:', error);
  } finally {
    loadingProduct.value = false;
  }
};

// 产品选择变化时加载规格数据
const handleProductChange = async (selectedProductName) => {
  try {
    loadingSpecs.value = true;
    editedSpecsList.value = [];
    selectedStockSpecs.value = [];
    selectedPriceSpecs.value = [];

    console.warn('开始获取规格数据...', selectedProductName);

    const userInfo = window.sessionStorage.getItem('userInfo');
    const userInfoObj = JSON.parse(userInfo);
    const specParams = {
      pageID: '',
      pageDataGrpID: 'factoryProductStandard',
      companyName: userInfoObj.TELLERCOMPANY,
      productName: selectedProductName,
    };

    console.warn('请求参数:', specParams);

    const { data: specDataRes } = await useMainGetData(specParams);
    console.warn('返回的规格数据:', specDataRes.value);

    if (!specDataRes.value) {
      throw new Error('规格数据获取失败');
    }

    // 更灵活的数据提取方式
    const responseData = await specDataRes.value;
    console.warn(
      '完整响应数据:',
      specDataRes.value,
      JSON.stringify(responseData),
    );
    let selectedProductSpecs = null;

    // 尝试不同的数据提取方式
    if (responseData.queryProduct && Array.isArray(responseData.queryProduct)) {
      selectedProductSpecs = responseData.queryProduct[0];
    } else if (Array.isArray(responseData)) {
      selectedProductSpecs = responseData[0];
    } else if (responseData.factoryProductStandard) {
      selectedProductSpecs = responseData.factoryProductStandard;
    } else {
      selectedProductSpecs = responseData;
    }

    console.warn(
      '提取的产品规格数据:',
      selectedProductSpecs,
      selectedProductSpecs.specAttrCateListForPrice
        ? selectedProductSpecs.specAttrCateListForPrice
            .split(',')
            .filter(Boolean)
        : [],
    );

    if (!selectedProductSpecs) {
      console.error('未找到该产品的规格数据');
      message.error('未找到该产品的规格数据');
      return;
    }

    // 设置库存和价格规格
    selectedStockSpecs.value = selectedProductSpecs.specAttrCateListForWare
      ? selectedProductSpecs.specAttrCateListForWare.split(',')
      : [];
    selectedPriceSpecs.value = selectedProductSpecs.specAttrCateListForPrice
      ? selectedProductSpecs.specAttrCateListForPrice.split(',')
      : [];
    console.warn('库存规格:', selectedStockSpecs.value);
    console.warn('价格规格:', selectedPriceSpecs.value);

    // 规格数据初始化
    let specsData = [];

    // 获取规格数据
    if (selectedProductSpecs?.queryProductSpecCate) {
      specsData = selectedProductSpecs.queryProductSpecCate;
    } else if (selectedProductSpecs?.specs) {
      specsData = selectedProductSpecs.specs;
    } else if (selectedProductSpecs?.specCategories) {
      specsData = selectedProductSpecs.specCategories;
    } else if (selectedProductSpecs?.productSpecs) {
      specsData = selectedProductSpecs.productSpecs;
    }

    console.warn('原始规格数据:', specsData);

    // 如果没有获取到规格数据，但存在库存/价格规格，则创建空规格
    if (
      specsData.length === 0 &&
      (selectedStockSpecs.value.length > 0 ||
        selectedPriceSpecs.value.length > 0)
    ) {
      const allSpecTypes = [
        ...new Set([...selectedPriceSpecs.value, ...selectedStockSpecs.value]),
      ];

      specsData = allSpecTypes.map((specCate) => ({
        specCate,
        queryProductSpecValue: [],
      }));
    }

    // 处理规格数据
    editedSpecsList.value = specsData.map((spec) => ({
      specCate: spec.specCate || spec.name || spec.type,
      productName: selectedProductName,
      queryProductSpecValue: (
        spec.queryProductSpecValue ||
        spec.values ||
        []
      ).map((value) => ({
        specValue: value.specValue || value.value,
        specCate: value.specCate || spec.specCate || spec.name,
        isNew: 'false',
        deleteStatus: 'normal',
      })),
    }));

    console.warn('处理后的规格列表:', editedSpecsList.value);

    await nextTick();
    console.warn('UI已更新');
  } catch (error) {
    console.error('处理产品变更时出错:', error);
    message.error(`加载产品规格失败: ${error.message}`);
  } finally {
    loadingSpecs.value = false;
  }
};

// 获取所有可用的规格类型
const availableSpecTypes = computed(() => {
  return editedSpecsList.value.map((item) => item.specCate) || [];
});

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
      productName: productName.value,
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

  // 验证产品名称
  if (!productName.value.trim()) {
    Modal.error({
      title: '新增失败',
      content: '请选择产品名称',
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
              companyName: JSON.parse(window.sessionStorage.getItem('userInfo'))
                .TELLERCOMPANY,
              productName: productName.value,
              srlID: srlID.value,
              specAttrCateListForWare: selectedStockSpecs.value.join(','),
              specAttrCateListForPrice: selectedPriceSpecs.value.join(','),
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

        const params = {
          bllID: 'hobyFactoryPrdModelPreview',
          serviceID: 1, // 1-新增
          fileDate: JSON.stringify(payload),
        };

        await mainSendFileDataApi(params);
        message.success('新增产品型号成功');
        closeModal();
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
              新增产品型号
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
              <div class="flex items-center">
                <h4 class="flex-1 text-sm font-medium text-gray-900">产品：</h4>
                <Select
                  v-model:value="productName"
                  style="width: 100%"
                  placeholder="请选择产品名称"
                  :options="productList"
                  @change="handleProductChange"
                  :loading="loadingProduct"
                  class="product-select flex-1"
                  show-search
                  option-filter-prop="label"
                  :filter-option="filterOption"
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
                  class="flex-1 rounded-md border border-gray-300 bg-gray-100 shadow-sm"
                  @change="handleStockSpecChange"
                  :options="
                    availableSpecTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))
                  "
                  disabled
                />
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
                  class="flex-1 rounded-md border border-gray-300 bg-gray-100"
                  @change="handlePriceSpecChange"
                  :options="
                    availableSpecTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))
                  "
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 可滚动的规格内容区域 -->
        <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
          <div v-if="loadingSpecs" class="flex justify-center p-4">
            <span>加载规格数据中...</span>
          </div>

          <!-- 规格类型列表 -->
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
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
          <!-- <div v-else-if="!loadingSpecs" class="flex flex-col items-center p-4">
            <span class="text-gray-500">暂无规格数据</span>
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

:deep(
  .product-select.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
) {
  display: flex;
  align-items: center;
  height: 40px;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}

:deep(
  .product-select.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input
) {
  height: 40px;
}
</style>
