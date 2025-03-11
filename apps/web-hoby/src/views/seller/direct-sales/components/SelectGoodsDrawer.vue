<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import { computed, ref, watch } from 'vue';

import { Button, Drawer, Tag, Tree } from 'ant-design-vue';

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

const props = defineProps<{
  supplier?: string;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'select']);

// 选中的商品
const checkedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>(['空调']);

// 树形数据
const treeData = ref<TreeNode[]>([
  {
    title: '空调',
    key: '空调',
    children: [
      {
        title: 'TEST壁挂式空调-Ver1.0',
        key: 'TEST壁挂式空调-Ver1.0',
      },
      {
        title: 'TEST中央空调-Ver1.0',
        key: 'TEST中央空调-Ver1.0',
      },
      {
        title: 'TEST立柜式空调-Ver1.0',
        key: 'TEST立柜式空调-Ver1.0',
      },
    ],
  },
  {
    title: '男士T恤衫',
    key: '男士T恤衫',
    children: [
      {
        title: '酷炫火箭衫',
        key: '酷炫火箭衫',
      },
      {
        title: '圆领文化衫',
        key: '圆领文化衫',
      },
    ],
  },
]);

// 计算已选商品的层级关系
const selectedGroups = computed(() => {
  const groups: Record<string, string[]> = {};

  checkedKeys.value.forEach((key) => {
    // 查找商品所属的分类
    for (const category of treeData.value) {
      if (category.children) {
        const found = category.children.find((item) => item.key === key);
        if (found) {
          const title = category.title!;
          if (!groups[title]) {
            groups[title] = [];
          }
          groups[title].push(key);
          break;
        }
      }
    }
  });

  return groups;
});

// 处理选中变化
const onCheck: TreeProps['onCheck'] = (checked) => {
  if (Array.isArray(checked)) {
    // 过滤掉父节点，只保留叶子节点
    const leafNodes = checked.filter((key) => {
      const isParent = treeData.value.some((category) => category.key === key);
      return !isParent;
    });
    checkedKeys.value = leafNodes as string[];
  }
};

// 移除选中的商品
const removeSelected = (key: string) => {
  // 找到对应的分类
  for (const category of treeData.value) {
    if (category.children?.some((item) => item.key === key)) {
      checkedKeys.value = checkedKeys.value.filter((k) => k !== key);
      break;
    }
  }
};

// 移除分类下所有商品
const removeCategoryItems = (category: string) => {
  // 找到对应的分类节点
  const categoryNode = treeData.value.find((item) => item.title === category);
  if (categoryNode?.children) {
    const childKeys = new Set(categoryNode.children.map((child) => child.key));
    checkedKeys.value = checkedKeys.value.filter((key) => !childKeys.has(key));
  }
};

// 关闭抽屉
const handleClose = () => {
  emit('update:visible', false);
};

// 确认选择
const handleConfirm = () => {
  emit('select', checkedKeys.value);
  handleClose();
};

// 监听visible变化，重置选中状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      checkedKeys.value = [];
    }
  },
);
</script>

<template>
  <Drawer
    :visible="visible"
    title="选择商品"
    placement="right"
    width="500"
    class="select-goods-drawer"
    @close="handleClose"
  >
    <div class="flex h-full flex-col">
      <!-- 已选商品展示 -->
      <div class="mb-4 rounded-lg bg-gray-50 p-4">
        <div class="mb-3 flex items-center">
          <div class="text-base font-medium text-gray-700">已选商品</div>
          <template v-if="checkedKeys.length > 0">
            <div
              class="bg-primary ml-2 rounded-full px-2 py-0.5 text-xs text-white"
            >
              {{ checkedKeys.length }}
            </div>
          </template>
        </div>

        <template v-if="Object.keys(selectedGroups).length > 0">
          <div class="space-y-3">
            <div
              v-for="(items, category) in selectedGroups"
              :key="category"
              class="rounded-md bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="font-medium text-gray-800">{{ category }}</span>
                <Button
                  type="link"
                  size="small"
                  class="text-red-500 hover:text-red-600"
                  @click="removeCategoryItems(category)"
                >
                  移除全部
                </Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Tag
                  v-for="key in items"
                  :key="key"
                  class="border-primary bg-primary/5 rounded-full px-3"
                  closable
                  @close="removeSelected(key)"
                >
                  {{ key }}
                </Tag>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="flex min-h-[100px] flex-col items-center justify-center rounded-md bg-white p-4"
          >
            <div class="mb-2 text-4xl">📦</div>
            <div class="text-gray-400">从下方选择商品添加到此处</div>
          </div>
        </template>
      </div>

      <!-- 树形选择器 -->
      <div
        class="flex-1 overflow-auto rounded-lg border border-gray-100 bg-white p-4"
      >
        <Tree
          checkable
          :tree-data="treeData"
          :checked-keys="checkedKeys"
          :expanded-keys="expandedKeys"
          :check-strictly="false"
          :selectable="false"
          class="select-goods-tree"
          @check="onCheck"
          @expand="(keys) => (expandedKeys = keys as string[])"
        />
      </div>

      <!-- 底部按钮 -->
      <div class="mt-4 flex justify-end gap-3">
        <Button class="min-w-[80px]" @click="handleClose">取消</Button>
        <Button
          type="primary"
          class="min-w-[80px]"
          :disabled="checkedKeys.length === 0"
          @click="handleConfirm"
        >
          确定 {{ checkedKeys.length > 0 ? `(${checkedKeys.length})` : '' }}
        </Button>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
:deep(.ant-drawer-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: #f8fafc;
}

:deep(.select-goods-tree) {
  .ant-tree-treenode {
    padding: 4px 0;
  }

  .ant-tree-node-content-wrapper {
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: #f1f5f9;
    }
  }

  .ant-tree-node-selected {
    background-color: #e2e8f0 !important;
  }
}

:deep(.ant-tag) {
  margin-right: 0;
}
</style>
