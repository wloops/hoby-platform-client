<script setup>
import { ref } from 'vue';

import { message, Modal } from 'ant-design-vue';

import { mainSendFileDataApi } from '#/api';
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

// const { Option: SelectOption } = Select;
const isOpen = ref(false);
// 编辑状态的规格数据
// const editedSpecs = reactive({});

// 新规格类型名称
// const newSpecTypeName = ref('');

// 已选择的规格类型
// const selectedStockSpecs = ref([]);
// const selectedPriceSpecs = ref([]);

// 获取所有可用的规格类型
// const availableSpecTypes = computed(() => {
//   return editedSpecsList.value.map((item) => item.specCate);
// });

// 切换规格类型选择 - 修改为直接赋值
// const handleStockSpecChange = (queryProductSpecValue) => {
//   selectedStockSpecs.value = queryProductSpecValue;
// };

// const handlePriceSpecChange = (queryProductSpecValue) => {
//   selectedPriceSpecs.value = queryProductSpecValue;
// };

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
  const specItem = editedSpecsList.value.find(
    (item) => item.specCate === specCate,
  );
  if (specItem) {
    specItem.querySpecValue = specItem.querySpecValue || [];
    specItem.querySpecValue.push({
      companyName: specData.value.company,
      specAttrCate: specData.value.name,
      specValue: '',
      specAttr: '',
      isNew: 'true', // 标记为新添加的规格值
      deleteStatus: 'normal', // 新添加的规格值初始状态
    });
  }
};

// 删除规格值
const removeSpecValue = (specCate, index) => {
  editedSpecsList.value.forEach((item) => {
    if (item.specCate === specCate) {
      const specValue = item.querySpecValue[index];
      if (specValue.isNew === 'true') {
        // 如果是新增的规格值，直接从数组中移除
        item.querySpecValue.splice(index, 1);
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
//   if (!newSpecTypeName.value.trim()) return;

//   // 转换为驼峰命名作为key
//   const specTypeKey = newSpecTypeName.value
//     .trim()
//     .replaceAll(/[\s-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
//     .replace(/^[A-Z]/, (c) => c.toLowerCase());

//   // 检查是否已存在
//   editedSpecsList.value.forEach((item) => {
//     if (item.specCate === specTypeKey) {
//       message.error(`规格类型 "${newSpecTypeName.value}" 已存在`);
//       return false;
//     }
//   });

//   // 添加新规格类型
//   editedSpecsList.value.push({
//     specCate: specTypeKey,
//     queryProductSpecValue: [
//       {
//         specValue: '',
//       },
//     ],
//   });

//   // 清空输入
//   newSpecTypeName.value = '';
// };

// 删除规格类型
// const removeSpecType = (specCate, index) => {
//   Modal.confirm({
//     title: '提示',
//     content: `确定要删除 "${specCate}" 规格吗？`,
//     onOk: () => {
//       editedSpecsList.value.forEach((item) => {
//         if (item.specCate === specCate) {
//           editedSpecsList.value.splice(index, 1);
//         }
//       });
//     },
//   });
// };

// 获取规格类型名称
// const getSpecTypeName = (specCate) => {
//   const names = {
//     colors: '颜色',
//     sizes: '尺寸',
//     materials: '材质',
//   };
//   return names[specCate] || specCate;
// };

// 保存更改
const saveChanges = () => {
  // 先检查是否有未填写的新增规格值
  const hasEmptyNewSpec = editedSpecsList.value.some((spec) =>
    spec.querySpecValue.some(
      (item) => item.isNew === 'true' && !item.specAttr.trim(),
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
    content: '确定要保存当前规格信息吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        // 1. 准备待删除的数据 - 按照新格式构建
        const toDeleteSpecs = {
          querySpecCate: [],
        };
        // 分离待删除的数据
        editedSpecsList.value.forEach((spec) => {
          const deleteValues = spec.querySpecValue
            .filter((item) => item.deleteStatus === 'pending_delete')
            .map((item) => ({
              companyName: specData.value.company,
              specAttrCate: specData.value.name,
              specAttr: item.specAttr || item.specValue,
            }));

          if (deleteValues.length > 0) {
            toDeleteSpecs.querySpecCate.push({
              companyName: specData.value.company,
              specAttrCate: specData.value.name,
              querySpecValue: deleteValues,
            });
          }
        });

        // 2. 如果有待删除项，先执行删除
        if (toDeleteSpecs.querySpecCate.length > 0) {
          const deleteParams = {
            bllID: 'hobyFactorySpecStdPreview',
            dataGrpIDList: 'querySpecValue',
            serviceID: 2,
            fileDate: JSON.stringify(toDeleteSpecs),
          };

          console.warn('删除参数:', deleteParams); // 调试用
          await mainSendFileDataApi(deleteParams);
          message.success('已删除标记的规格值');

          // 从本地数据中移除已删除的项
          editedSpecsList.value.forEach((spec) => {
            spec.querySpecValue = spec.querySpecValue.filter(
              (item) => item.deleteStatus !== 'pending_delete',
            );
          });

          // 移除空规格类型
          editedSpecsList.value = editedSpecsList.value.filter(
            (spec) => spec.querySpecValue.length > 0,
          );
        }

        // 3. 准备保存的数据 - 调整为要求的格式
        const toSaveSpecs = {
          querySpecCate: [
            {
              companyName: specData.value.company,
              specAttrCate: specData.value.name,
              querySpecValue: editedSpecsList.value[0].querySpecValue
                .filter(
                  (item) =>
                    (item.specValue || item.specAttr) &&
                    item.deleteStatus !== 'pending_delete',
                )
                .map((item) => ({
                  companyName: specData.value.company,
                  specAttrCate: specData.value.name,
                  specAttr: item.specAttr || item.specValue,
                })),
            },
          ],
        };

        // 4. 执行保存
        if (toSaveSpecs.querySpecCate[0].querySpecValue.length > 0) {
          const saveParams = {
            bllID: 'hobyFactorySpecStdPreview',
            serviceID: 1,
            fileDate: JSON.stringify(toSaveSpecs),
          };
          console.warn('保存参数:', saveParams); // 调试用
          await mainSendFileDataApi(saveParams);
          message.success('规格信息保存成功');
        } else {
          message.warning('没有需要保存的规格数据');
        }

        isOpen.value = false;
      } catch (error) {
        message.error(`操作失败：${error.message || '服务器错误'}`);
      }
    },
  });
};
const editedSpecsList = ref([]);
const specData = ref(null);
// 打开模态框
const open = async (product) => {
  specData.value = product;
  editedSpecsList.value = [];
  try {
    const apiData = await getSpecTypeNameList(product);
    console.warn('API数据:', apiData);

    // 处理API返回的数据
    const querySpecValue = apiData.querySpecValue || [];

    const processedValues = querySpecValue.map((value) => ({
      companyName: value.companyName || product.company,
      specAttrCate: value.specAttrCate || product.name,
      specValue: value.specAttr || value.specValue || '',
      specAttr: value.specAttr || value.specValue || '',
      isNew: 'false',
      deleteStatus: 'normal',
    }));

    editedSpecsList.value = [
      {
        specCate: product.name,
        querySpecValue: processedValues,
      },
    ];

    isOpen.value = true;
  } catch (error) {
    console.error('打开模态框失败:', error);
    message.error(`加载规格数据失败: ${error.message || '未知错误'}`);
  }
};
// 获取规格类型名称
const getSpecTypeNameList = async (product) => {
  try {
    const userInfo = JSON.parse(
      window.sessionStorage.getItem('userInfo') || '{}',
    );
    const reqParams = {
      pageID: '',
      pageDataGrpID: 'hobyFactorySpecStdPreview',
      companyName: userInfo?.TELLERCOMPANY || '',
      specAttrCate: product.name,
    };

    const { data } = await useMainGetData(reqParams);
    console.warn('API返回数据:', data.value);

    // 直接返回API数据，不需要包装成querySpecCate
    return data.value || { querySpecValue: [] };
  } catch (error) {
    console.error('获取规格类型列表失败:', error);
    return { querySpecValue: [] };
  }
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
            <h3 class="text-lg font-medium text-gray-900">编辑规格标准</h3>
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
            <div class="spec-section rounded-md border bg-white p-2 shadow-sm">
              <div class="mb-4 flex items-center justify-between">
                <h4 class="text-base font-medium text-gray-900">
                  规格：{{ specData.name }}
                </h4>
                <div class="flex items-center gap-2">
                  <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    @click="addSpecValue(specData.name)"
                  >
                    添加{{ specData.name }}
                  </button>
                  <!-- <button
                    class="text-sm font-medium text-red-600 hover:text-red-700"
                    @click="removeSpecType(specData.name)"
                  >
                    删除规格
                  </button> -->
                </div>
              </div>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
                    :placeholder="`请输入${valueItem.specValue}`"
                    :readonly="valueItem.isNew === 'false'"
                    :class="{
                      'cursor-not-allowed bg-gray-100 focus:outline-none focus:ring-0':
                        valueItem.isNew === 'false',
                      'bg-white': valueItem.isNew === 'true',
                      'text-gray-400 line-through':
                        valueItem.deleteStatus === 'pending_delete',
                    }"
                  />
                  <button
                    class="flex-shrink-0 text-red-500 hover:text-red-700"
                    @click="removeSpecValue(specData.name, index)"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      :class="{
                        'text-red-500':
                          valueItem.deleteStatus !== 'pending_delete' &&
                          valueItem.isNew !== 'true',
                        'text-blue-500':
                          valueItem.deleteStatus === 'pending_delete',
                        'text-gray-500': valueItem.isNew === 'true',
                      }"
                    >
                      <path
                        v-if="
                          valueItem.deleteStatus !== 'pending_delete' &&
                          valueItem.isNew !== 'true'
                        "
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                      <path
                        v-if="valueItem.deleteStatus === 'pending_delete'"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M20 13.5a6.5 6.5 0 0 1-6.5 6.5H6v-2h7.5c2.5 0 4.5-2 4.5-4.5S16 9 13.5 9H7.83l3.08 3.09L9.5 13.5L4 8l5.5-5.5l1.42 1.41L7.83 7h5.67a6.5 6.5 0 0 1 6.5 6.5"
                      />
                      <path
                        v-if="valueItem.isNew === 'true'"
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
