<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

import {
  DeleteOutlined,
  FireOutlined,
  HistoryOutlined,
  RightOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagOutlined,
} from '@ant-design/icons-vue';
import { Button, Input, Tag } from 'ant-design-vue';

const searchText = ref('');
const showDropdown = ref(false);
const searchBoxRef = ref(null);

// 热门搜索词
const hotSearches = ['电子元件', '五金工具', '原材料', '机械设备'];

// 搜索历史
const searchHistory = ref(['不锈钢', '电机']);

// 执行搜索
const onSearch = (value: string) => {
  // 搜索逻辑
  console.warn('搜索:', value);
  showDropdown.value = false;
};

// 清除历史记录
const clearHistory = () => {
  searchHistory.value = [];
};

// 删除单个历史记录
const removeHistory = (index: number) => {
  searchHistory.value.splice(index, 1);
};

// 焦点事件
const handleFocus = () => {
  showDropdown.value = true;
};

// 点击外部关闭下拉框
const handleClickOutside = (event: MouseEvent) => {
  if (
    searchBoxRef.value &&
    !(searchBoxRef.value as HTMLElement).contains(event.target as HTMLElement)
  ) {
    showDropdown.value = false;
  }
};

// 添加和移除全局点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 模拟搜索结果
const searchResults = [
  {
    category: '商品',
    items: [
      { name: '电子元器件', count: 1200 },
      { name: '工业电机', count: 950 },
      { name: '标准件', count: 760 },
    ],
  },
  {
    category: '供应商',
    items: [
      { name: '上海电气有限公司', type: '制造商' },
      { name: '北京机械设备有限公司', type: '经销商' },
    ],
  },
  {
    category: '品牌',
    items: [
      { name: '西门子', origin: '德国' },
      { name: 'ABB', origin: '瑞士' },
    ],
  },
];
</script>

<template>
  <div class="search-box p-3" ref="searchBoxRef">
    <div class="relative">
      <Input.Search
        v-model:value="searchText"
        placeholder="请输入关键词搜索"
        size="large"
        @search="onSearch"
        @focus="handleFocus"
        class="w-full"
      >
        <template #enterButton>
          <Button type="primary">
            <SearchOutlined />
            <span>搜索</span>
          </Button>
        </template>
      </Input.Search>

      <!-- 搜索下拉结果 -->
      <div
        v-if="showDropdown"
        class="absolute left-0 right-0 top-full z-[1001] mt-1 rounded-md border border-gray-200 bg-white shadow-lg"
      >
        <!-- 热门搜索 -->
        <div class="border-b p-3">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <FireOutlined class="mr-1 text-red-500" />
              <span class="text-sm font-medium">热门搜索</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="item in hotSearches"
              :key="item"
              size="small"
              class="text-gray-700 hover:text-blue-500"
              @click="
                searchText = item;
                onSearch(item);
              "
            >
              {{ item }}
            </Button>
          </div>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="border-b p-3">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <HistoryOutlined class="mr-1" />
              <span class="text-sm font-medium">搜索历史</span>
            </div>
            <Button
              type="link"
              size="small"
              class="flex items-center text-gray-400 hover:text-gray-600"
              @click="clearHistory"
            >
              <DeleteOutlined class="mr-1" />
              <span class="text-xs">清空</span>
            </Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="(item, index) in searchHistory"
              :key="index"
              closable
              @close="removeHistory(index)"
              class="cursor-pointer px-3 py-1"
              @click="
                searchText = item;
                onSearch(item);
              "
            >
              {{ item }}
            </Tag>
          </div>
        </div>

        <!-- 搜索结果分类展示 -->
        <div class="p-3">
          <div
            v-for="(category, index) in searchResults"
            :key="index"
            class="mb-3"
          >
            <div class="mb-2 flex items-center">
              <TagOutlined
                v-if="category.category === '商品'"
                class="mr-1 text-blue-500"
              />
              <ShopOutlined
                v-else-if="category.category === '供应商'"
                class="mr-1 text-orange-500"
              />
              <ShoppingOutlined v-else class="mr-1 text-green-500" />
              <span class="text-sm font-medium">{{ category.category }}</span>
            </div>

            <div class="flex flex-col space-y-1">
              <div
                v-for="(item, idx) in category.items"
                :key="idx"
                class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-gray-50"
                @click="
                  searchText = item.name;
                  onSearch(item.name);
                "
              >
                <div>
                  <div class="text-sm font-medium">{{ item.name }}</div>
                  <div class="text-xs text-gray-500">
                    <template
                      v-if="category.category === '商品' && 'count' in item"
                    >
                      {{ item.count }}个产品
                    </template>
                    <template
                      v-else-if="
                        category.category === '供应商' && 'type' in item
                      "
                    >
                      {{ item.type }}
                    </template>
                    <template v-else-if="'origin' in item">
                      {{ item.origin }}
                    </template>
                  </div>
                </div>
                <RightOutlined class="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- 底部快捷操作 -->
        <div class="border-t p-2 text-center">
          <Button
            type="link"
            size="small"
            class="text-blue-500"
            @click="onSearch(searchText || '全部')"
          >
            查看所有搜索结果
          </Button>
        </div>
      </div>
    </div>

    <div class="mt-2 flex items-center text-sm text-gray-500">
      <span class="mr-2">热搜:</span>
      <div class="flex flex-wrap gap-x-4">
        <a
          v-for="(word, index) in hotSearches"
          :key="index"
          href="#"
          class="transition-colors hover:text-blue-500"
        >
          {{ word }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-box {
  position: relative;
}
</style>
