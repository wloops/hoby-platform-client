<script lang="ts" setup>
import type { SelectOptionType } from '../types';

import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';

import {
  DatePicker,
  FormItem,
  Input,
  InputNumber,
  Select,
  SelectOption,
} from 'ant-design-vue';
import dayjs from 'dayjs';

const props = defineProps({
  text: { type: [String, Number, Boolean], default: '' },
  record: { type: Object, required: true },
  editable: { type: Boolean, default: false },
  type: { type: String, default: 'input' },
  options: { type: Array as () => SelectOptionType[], default: () => [] },
  rules: { type: Array as () => any[], default: () => [] },
});

const emit = defineEmits(['save']);

const editing = ref(false);
const editValue = ref<any>(props.text);
const validateStatus = ref('');
const help = ref('');

// 判断是否为日期类型
const isDateType = (type: string) => type === 'date' || type === 'datetime';

// 获取适合当前类型的日期格式
const getDateFormat = (type: string) => {
  return type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
};

watch(
  () => props.text,
  (val) => {
    if (isDateType(props.type) && val) {
      editValue.value = typeof val === 'string' ? dayjs(val) : val;
    } else {
      editValue.value = val;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (isDateType(props.type) && props.text) {
    editValue.value =
      typeof props.text === 'string' ? dayjs(props.text) : props.text;
  }
});

const edit = () => {
  if (props.editable) {
    editing.value = true;
  }
};

const validate = () => {
  if (!props.rules || props.rules.length === 0) {
    return true;
  }

  for (const rule of props.rules) {
    if (rule.required && !editValue.value) {
      validateStatus.value = 'error';
      help.value = rule.message || '此字段不能为空';
      return false;
    }

    if (rule.pattern && !rule.pattern.test(editValue.value)) {
      validateStatus.value = 'error';
      help.value = rule.message || '格式不正确';
      return false;
    }
  }

  validateStatus.value = 'success';
  help.value = '';
  return true;
};

const save = () => {
  if (!validate()) {
    return;
  }

  editing.value = false;

  let valueToSave = editValue.value;
  if (isDateType(props.type) && valueToSave) {
    valueToSave = dayjs.isDayjs(valueToSave)
      ? valueToSave.format(getDateFormat(props.type))
      : valueToSave;
  }

  emit('save', {
    record: props.record,
    value: valueToSave,
  });
};
</script>

<template>
  <div class="editable-cell">
    <div
      v-if="editing"
      class="editable-cell-input-wrapper flex items-center justify-between"
    >
      <FormItem
        :validate-status="validateStatus"
        :help="help"
        style="margin-bottom: 0"
      >
        <!-- 输入框编辑器 -->
        <Input
          v-if="type === 'input'"
          v-model:value="editValue"
          @press-enter="save"
          @blur="save"
        />

        <!-- 数字输入框 -->
        <InputNumber
          v-else-if="type === 'number'"
          v-model:value="editValue"
          style="width: 100%"
          @press-enter="save"
          @blur="save"
        />

        <!-- 下拉选择框 -->
        <Select
          v-else-if="type === 'select'"
          v-model:value="editValue"
          style="width: 100%"
          @change="save"
          @blur="save"
        >
          <SelectOption
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectOption>
        </Select>

        <!-- 日期选择器 -->
        <DatePicker
          v-else-if="type === 'date'"
          v-model:value="editValue"
          style="width: 100%"
          value-format="YYYY-MM-DD"
          @change="save"
          @blur="save"
        />

        <!-- 日期时间选择器 -->
        <DatePicker
          v-else-if="type === 'datetime'"
          v-model:value="editValue"
          show-time
          style="width: 100%"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="save"
          @blur="save"
        />

        <!-- 只有当help不为空时才显示错误提示 -->
        <div v-if="help" class="error-message">{{ help }}</div>
      </FormItem>
      <svg
        @click="save"
        class="editable-icon ml-2 cursor-pointer text-xs text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <!-- Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ -->
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        >
          <path d="m4 12.9l3.143 3.6L15 7.5" opacity=".5" />
          <path d="m20 7.563l-8.571 9L11 16" />
        </g>
      </svg>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <div @click="edit" class="editable-cell-trigger">
        <span class="cell-content"><slot></slot></span>
        <!-- <EditOutlined  class="editable-icon" /> -->
        <svg
          v-if="editable"
          class="editable-icon text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <!-- Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ -->
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path
              d="M2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12v-1.5M13.5 2H12C7.286 2 4.929 2 3.464 3.464c-.973.974-1.3 2.343-1.409 4.536"
            />
            <path
              d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-2.983 2.982m-2.982 2.983c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editable-cell {
  position: relative;
  width: 100%;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.editable-cell-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
  cursor: pointer;
}

.cell-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.editable-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.editable-cell-trigger:hover {
  background-color: #f5f5f5;
}

/* 修改错误提示相关样式 */
.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  padding: 4px 8px;
  font-size: 12px;
  color: #ff4d4f;
  background: white;
  border: 1px solid #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

/* 移除深度选择器中的错误提示样式，因为我们自己处理了 */
:deep(.ant-form-item-explain) {
  display: none;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
