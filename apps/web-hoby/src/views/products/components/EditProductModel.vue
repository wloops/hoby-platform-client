<script setup>
import { computed, ref } from 'vue';

import { message, Modal, Select } from 'ant-design-vue';

import { mainSendFileDataApi, mainServiceApi } from '#/api';
import { useMainGetData } from '#/composables';

// const props = defineProps({
//   productId: {
//     type: [Number, String],
//     required: true,
//   },
//   specifications: {
//     type: Object,
//     required: true,
//   },
// });

// const emit = defineEmits(['close', 'save']);

const { Option: SelectOption } = Select;
const isOpen = ref(false);
// 编辑状态的规格数据
// const editedSpecs = reactive({});

// 新规格类型名称
// const newSpecTypeName = ref('');

// 已选择的规格类型
const selectedStockSpecs = ref([]);
const selectedPriceSpecs = ref([]);

// 默认显示的tab
const activeTab = ref('information');

// 获取所有可用的规格类型
const availableSpecTypes = computed(() => {
  return editedSpecsList.value.map((item) => item.specCate);
});

// 切换规格类型选择 - 修改为直接赋值
const handleStockSpecChange = (productModelSpecValue) => {
  selectedStockSpecs.value = productModelSpecValue;
};

const handlePriceSpecChange = (productModelSpecValue) => {
  selectedPriceSpecs.value = productModelSpecValue;
};

// // 监听规格数据变化，初始化编辑状态
// watch(
//   () => props.specifications,
//   (newSpecs) => {
//     if (newSpecs) {
//       // 清空现有数据
//       Object.keys(editedSpecs).forEach((key) => {
//         delete editedSpecs[key];
//       });

//       // 复制所有规格数据
//       Object.keys(newSpecs).forEach((key) => {
//         editedSpecs[key] = [...newSpecs[key]];
//       });
//     }
//   },
//   { immediate: true },
// );

// 添加规格值
const addSpecValue = (specCate) => {
  editedSpecsList.value.forEach((item) => {
    if (item.specCate === specCate) {
      item.productModelSpecValue.push({
        productName: productData.value.name,
        srlID: productData.value.model,
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
      const specValue = item.productModelSpecValue[index];
      if (specValue.isNew === 'true') {
        // 如果是新增的规格值，直接从数组中移除
        item.productModelSpecValue.splice(index, 1);
      } else {
        // 如果是已有规格值，标记为删除状态
        specValue.deleteStatus =
          specValue.deleteStatus === 'normal' ? 'pending_delete' : 'normal';
      }
    }
  });
};

// 添加新规格类型
const addNewSpecType = () => {
  if (selectedNewSpecTypes.value.length === 0) {
    message.warning('请至少选择一个规格类型');
    return;
  }

  selectedNewSpecTypes.value.forEach((specCate) => {
    // 检查是否已存在
    const alreadyExists = editedSpecsList.value.some(
      (item) => item.specCate === specCate,
    );

    if (!alreadyExists) {
      // 添加新规格类型
      editedSpecsList.value.push({
        productName: productData.value.name,
        srlID: productData.value.model,
        specCate,
        productModelSpecValue: [
          {
            productName: productData.value.name,
            srlID: productData.value.model,
            specValue: '',
            specCate,
            isNew: 'true',
          },
        ],
      });
    }
  });

  // 清空选择
  selectedNewSpecTypes.value = [];
  // 重新获取可选的规格类型（过滤掉已添加的）
  fetchAvailableSpecCategories();
};

// 删除规格类型
const removeSpecType = (specCate, index) => {
  // console.log('当前规格列表:', editedSpecsList.value, specCate); // 更清晰的日志输出

  Modal.confirm({
    title: '提示',
    content: `确定要删除 "${specCate}" 规格吗？`,
    async onOk() {
      try {
        const params = {
          pageID: 'EditProductModel',
          pageButtonID: 'prdModelDeleteSpec',
          companyName: productData.value?.company,
          productName: productData.value?.name,
          srlID: productData.value?.model,
          specAttrCate: specCate,
        };

        await mainServiceApi(params);

        // 从本地数据中移除规格类型
        editedSpecsList.value.splice(index, 1);

        // 重新获取可选的规格类型
        await fetchAvailableSpecCategories();

        message.success('规格删除成功');
      } catch (error) {
        message.error(`删除失败：${error.message || '服务器错误'}`);
      }
    },
  });
};

// 获取规格类型名称
const getSpecTypeName = (specCate) => {
  const names = {
    colors: '颜色',
    sizes: '尺寸',
    materials: '材质',
  };
  return names[specCate] || specCate;
};

// 保存更改
const saveChanges = () => {
  // 先检查是否有未填写的新增规格值
  const hasEmptyNewSpec = editedSpecsList.value.some((spec) =>
    spec.productModelSpecValue.some(
      (item) => item.isNew === 'true' && !item.specValue.trim(),
    ),
  );

  if (hasEmptyNewSpec) {
    Modal.error({
      title: '保存失败',
      content: '请填写所有新增的规格值后再保存',
    });
    return;
  }

  Modal.confirm({
    title: '确认保存',
    content: '确定要保存当前产品型号信息吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        // 1. 准备待删除的数据
        const toDeleteSpecs = [];

        // 分离待删除的数据
        editedSpecsList.value.forEach((spec) => {
          const deleteValues = spec.productModelSpecValue
            .filter((item) => item.deleteStatus === 'pending_delete')
            .map((item) => ({
              productName: item.productName,
              srlID: item.srlID,
              specValue: item.specValue,
              specCate: item.specCate,
              isNew: item.isNew,
              deleteStatus: item.deleteStatus,
            }));

          if (deleteValues.length > 0) {
            toDeleteSpecs.push({
              specCate: spec.specCate,
              productModelSpecValue: deleteValues,
              productName: productData.value.name,
              srlID: productData.value.model,
            });
          }
        });

        // 2. 如果有待删除项，先执行删除
        if (toDeleteSpecs.length > 0) {
          const deleteParams = {
            bllID: 'hobyFactoryPrdModelPreview',
            dataGrpIDList: 'productModelSpecValue',
            serviceID: 2,
            fileDate: JSON.stringify({
              productModel: [
                {
                  companyName: productData.value.company,
                  productName: productData.value.name,
                  srlID: productData.value.model,
                  specAttrCateListForWare: selectedStockSpecs.value.join(','),
                  specAttrCateListForPrice: selectedPriceSpecs.value.join(','),
                  distributorPrice: distributorPrice.value,
                  terminalPrice: terminalPrice.value,
                  productModelSpecCate: toDeleteSpecs,
                },
              ],
            }),
          };
          await mainSendFileDataApi(deleteParams);
          message.success('已删除标记的规格值');

          // 从本地数据中移除已删除的项
          editedSpecsList.value.forEach((spec) => {
            spec.productModelSpecValue = spec.productModelSpecValue.filter(
              (item) => item.deleteStatus !== 'pending_delete',
            );
          });

          // 移除空规格类型
          editedSpecsList.value = editedSpecsList.value.filter(
            (spec) => spec.productModelSpecValue.length > 0,
          );
        }

        // 3. 准备保存的数据
        const toSaveSpecs = editedSpecsList.value
          .map((spec) => ({
            specCate: spec.specCate,
            productModelSpecValue: spec.productModelSpecValue
              .filter(
                (item) =>
                  item.specValue.trim() &&
                  item.deleteStatus !== 'pending_delete',
              )
              .map((item) => ({
                productName: item.productName,
                srlID: item.srlID,
                specValue: item.specValue,
                specCate: item.specCate,
                isNew: item.isNew,
                deleteStatus: item.deleteStatus,
              })),
            productName: productData.value.name,
            srlID: productData.value.model,
          }))
          .filter((spec) => spec.productModelSpecValue.length > 0);

        // 4. 执行保存
        if (toSaveSpecs.length > 0) {
          const saveParams = {
            bllID: 'hobyFactoryPrdModelPreview',
            serviceID: 1,
            fileDate: JSON.stringify({
              productModel: [
                {
                  companyName: productData.value.company,
                  productName: productData.value.name,
                  srlID: productData.value.model,
                  specAttrCateListForWare: selectedStockSpecs.value.join(','),
                  specAttrCateListForPrice: selectedPriceSpecs.value.join(','),
                  distributorPrice: distributorPrice.value,
                  terminalPrice: terminalPrice.value,
                  productModelSpecCate: toSaveSpecs,
                },
              ],
            }),
          };
          await mainSendFileDataApi(saveParams);
          message.success('产品型号信息保存成功');
        } else {
          message.warning('没有需要保存的产品型号数据');
        }

        // isOpen.value = false;
      } catch (error) {
        message.error(`操作失败：${error.message || '服务器错误'}`);
      }
    },
  });
};

const editedSpecsList = ref([]);
const productData = ref(null);
const availableSpecCategories = ref([]); // 存储所有可选的规格类型
const selectedNewSpecTypes = ref([]); // 存储新选择的规格类型
const distributorPrice = ref(null);
const terminalPrice = ref(null);
// 打开模态框
const open = async (product) => {
  productData.value = product;
  console.warn(productData.value);

  editedSpecsList.value = [];
  let list = [];
  list = await getSpecTypeNameList(product);
  // 初始化时给每个规格值添加 isNew 字段
  list.productModelSpecCate.forEach((spec) => {
    spec.productModelSpecValue.forEach((value) => {
      value.isNew = 'false'; // 已有数据标记为非新增
      value.deleteStatus = 'normal'; // 初始化状态为normal
    });
  });

  // console.warn(list);
  distributorPrice.value = list.distributorPrice;
  terminalPrice.value = list.terminalPrice;
  editedSpecsList.value = list.productModelSpecCate;
  selectedPriceSpecs.value = list.specAttrCateListForPrice
    ? list.specAttrCateListForPrice.split(',')
    : [];
  selectedStockSpecs.value = list.specAttrCateListForWare
    ? list.specAttrCateListForWare.split(',')
    : [];

  // 获取所有可选的规格类型
  await fetchAvailableSpecCategories();
  isOpen.value = true;
};
// 获取可选的规格类型列表
const fetchAvailableSpecCategories = async () => {
  try {
    const params = {
      pageID: 'productStandards',
      pageDataGrpID: 'queryProductSpecCate',
      companyName: productData.value?.company,
      productName: productData.value?.name,
    };
    const { data } = await useMainGetData(params);
    availableSpecCategories.value = data.value || [];

    // 过滤掉已经存在的规格类型
    availableSpecCategories.value = availableSpecCategories.value.filter(
      (item) =>
        !editedSpecsList.value.some((spec) => spec.specCate === item.specCate),
    );
  } catch (error) {
    message.error(`获取规格类型失败: ${error.message}`);
  }
};
// 获取规格类型名称
const getSpecTypeNameList = async (product) => {
  const userInfo = window.sessionStorage.getItem('userInfo');
  const userInfoObj = JSON.parse(userInfo);
  const reqParams = {
    pageID: '',
    pageDataGrpID: 'hobyFactoryPrdModelPreview',
    companyName: userInfoObj.TELLERCOMPANY,
    productName: product.name,
    srlID: product.model,
  };
  const { data } = await useMainGetData(reqParams);

  return data.value;
};

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
  activeTab.value = 'information';
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
    <!-- Backdrop -->
    <!-- <div
      class="fixed inset-0 h-full bg-black bg-opacity-50 transition-opacity"
    ></div> -->

    <!-- Modal -->
    <div class="flex h-full items-end justify-center text-center">
      <div
        class="relative flex h-full w-full transform flex-col overflow-hidden bg-white text-left shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">编辑产品型号</h3>
            <div
              class="flex flex-1 items-center justify-center text-lg font-medium text-gray-500"
            >
              <span class="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
              {{ productData.name }}&nbsp;—&nbsp;{{ productData.model }}
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
        <!-- 编辑的产品型号 -->
        <!-- <div
          class="flex-shrink-0 border-b border-yellow-500 bg-white px-6 py-4"
        >
          <h3 class="flex items-center text-lg font-medium text-gray-800">
            <span class="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            {{ productData.name }}&nbsp;—&nbsp;{{ productData.model }}
          </h3>
        </div> -->
        <!-- 选项卡区域 -->
        <div class="tabs mt-2 flex flex-shrink-0 border-b-2 border-yellow-500">
          <button
            @click="activeTab = 'information'"
            :class="{
              'bg-yellow-500 text-white': activeTab === 'information',
            }"
            class="rounded-t-lg p-2 pl-4 pr-4"
          >
            产品信息
          </button>
          <button
            @click="activeTab = 'specifications'"
            :class="{
              'bg-yellow-500 text-white': activeTab === 'specifications',
            }"
            class="rounded-t-lg p-2 pl-4 pr-4"
          >
            产品规格
          </button>
          <button
            @click="activeTab = 'introduction'"
            :class="{
              'bg-yellow-500 text-white': activeTab === 'introduction',
            }"
            class="rounded-t-lg px-4 py-3"
          >
            产品介绍
          </button>
          <button
            @click="activeTab = 'images'"
            :class="{ 'bg-yellow-500 text-white': activeTab === 'images' }"
            class="rounded-t-lg p-2 pl-4 pr-4"
          >
            产品图片
          </button>
        </div>

        <!-- 产品信息选项卡 -->
        <div
          v-if="activeTab === 'information'"
          class="flex-grow overflow-y-auto border-b border-gray-200 bg-white"
        >
          <!-- 产品信息区域 -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- 第一行 -->
              <div class="flex items-center gap-2">
                <h4 class="w-28 text-sm font-medium text-gray-900">
                  SKU规格清单：
                </h4>
                <Select
                  v-model:value="selectedStockSpecs"
                  mode="multiple"
                  placeholder="请选择SKU规格"
                  @change="handleStockSpecChange"
                  class="h-8 flex-1"
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
                  placeholder="请选择价格规格"
                  @change="handlePriceSpecChange"
                  class="h-8 flex-1"
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
              <!-- 第二行 -->
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
        </div>

        <!-- 产品规格选项卡 -->
        <div
          v-if="activeTab === 'specifications'"
          class="flex flex-grow flex-col overflow-y-auto"
        >
          <!-- 可滚动的规格内容区域 -->
          <div class="flex-grow overflow-y-auto bg-white px-6 py-5">
            <div v-if="editedSpecsList.length > 0" class="space-y-8">
              <!-- 现有规格 -->
              <div
                v-for="(item, index) in editedSpecsList"
                :key="index"
                class="spec-section rounded-md border bg-white p-2 shadow-sm"
              >
                <div class="mb-4 flex items-center justify-between">
                  <h4 class="text-base font-medium text-gray-900">
                    规格：{{ item.specCate }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <button
                      class="text-sm font-medium text-blue-600 hover:text-blue-700"
                      @click="addSpecValue(item.specCate)"
                    >
                      添加{{ item.specCate }}
                    </button>
                    <button
                      class="text-sm font-medium text-red-600 hover:text-red-700"
                      @click="removeSpecType(item.specCate, index)"
                    >
                      删除规格
                    </button>
                  </div>
                </div>
                <div
                  class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
                >
                  <div
                    v-for="(value, index) in item.productModelSpecValue"
                    :key="index"
                    class="flex items-center gap-2 rounded-md bg-white p-2 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="text"
                      v-model="value.specValue"
                      class="min-w-0 flex-1 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                暂无规格类型
              </h3>
              <p class="mt-1 text-sm text-gray-500">请在下方添加规格类型</p>
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
              <!-- <input
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
              </button> -->
            </div>
          </div>
        </div>

        <!-- 产品介绍选项卡 -->
        <div
          v-if="activeTab === 'introduction'"
          class="flex flex-grow flex-col overflow-y-auto"
        >
          暂无产品介绍
        </div>

        <!-- 产品图片选项卡 -->
        <div
          v-if="activeTab === 'images'"
          class="flex flex-grow flex-col overflow-y-auto"
        >
          暂无产品图片
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
