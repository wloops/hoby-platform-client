<script setup lang="ts">
import { ref } from 'vue';

import {
  HomeOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  TagOutlined,
} from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Radio,
  Tooltip,
} from 'ant-design-vue';

type FormState = {
  agreement: boolean;
  storeType: string;
};

const props = defineProps<{
  formState: FormState;
}>();

const emit = defineEmits(['prev', 'next', 'showAgreement', 'update:formState']);

const updateFormState = (field: keyof FormState, value: boolean | string) => {
  emit('update:formState', { ...props.formState, [field]: value });
};

const storeTypes = [
  {
    label: '直销店铺',
    value: 'direct',
    icon: ShopOutlined,
    description: '适合品牌直接销售自有产品，无中间商环节',
  },
  {
    label: '自营店铺',
    value: 'self',
    icon: HomeOutlined,
    description: '适合平台自营商品，提供统一的服务和保障',
  },
  {
    label: '授权销售店铺',
    value: 'authorized',
    icon: TagOutlined,
    description: '适合获得品牌授权的经销商，需提供授权证明',
  },
] as const;

const hoveredType = ref<null | string>(null);
</script>

<template>
  <div class="step-content">
    <Card :bordered="false" class="store-type-card">
      <template #title>
        <div class="card-title">
          <h3>请选择店铺类型</h3>
          <Tooltip
            title="不同店铺类型有不同的权限和要求，请根据您的实际情况选择"
          >
            <InfoCircleOutlined class="info-icon" />
          </Tooltip>
        </div>
      </template>

      <Form :model="formState" class="selection-form" layout="vertical">
        <div class="store-type-options">
          <div
            v-for="type in storeTypes"
            :key="type.value"
            class="store-type-option"
            :class="{
              selected: formState.storeType === type.value,
              hovered: hoveredType === type.value,
            }"
            @click="updateFormState('storeType', type.value)"
            @mouseenter="hoveredType = type.value"
            @mouseleave="hoveredType = null"
          >
            <Radio
              :value="type.value"
              :checked="formState.storeType === type.value"
              class="radio-hidden"
            />
            <div class="option-content">
              <div class="option-icon">
                <component :is="type.icon" />
              </div>
              <div class="option-details">
                <div class="option-label">{{ type.label }}</div>
                <div class="option-description">{{ type.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div class="agreement-section">
          <Checkbox
            :checked="formState.agreement"
            @update:checked="(val) => updateFormState('agreement', val)"
          >
            我已阅读并同意
            <a
              href="#"
              @click.prevent="emit('showAgreement')"
              class="agreement-link"
              >《供应商入驻协议》</a
            >
          </Checkbox>
        </div>

        <div class="step-actions">
          <Button style="margin-right: 16px" @click="emit('prev')">
            上一步
          </Button>
          <Button
            type="primary"
            :disabled="!formState.agreement || !formState.storeType"
            @click="emit('next')"
          >
            提交申请
          </Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.step-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0;
  background: #fff;
  border-radius: 8px;
}

.store-type-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 5%);
}

.card-title {
  display: flex;
  align-items: center;
}

.info-icon {
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
}

h3 {
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.selection-form {
  margin-top: 16px;
}

.store-type-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.store-type-option {
  position: relative;
  padding: 16px;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.3s;
}

.store-type-option:hover {
  background-color: #f0f7ff;
  border-color: #1890ff;
}

.store-type-option.selected {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

.store-type-option.hovered {
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  transform: translateY(-2px);
}

.radio-hidden {
  position: absolute;
  top: 16px;
  right: 16px;
}

.option-content {
  display: flex;
  align-items: flex-start;
}

.option-icon {
  margin-top: 4px;
  margin-right: 12px;
  font-size: 24px;
  color: #1890ff;
}

.option-details {
  flex: 1;
}

.option-label {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.option-description {
  font-size: 14px;
  line-height: 1.5;
  color: #595959;
}

.agreement-section {
  margin: 24px 0;
}

.agreement-link {
  color: #1890ff;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

.step-actions {
  margin-top: 32px;
  text-align: right;
}

@media (max-width: 768px) {
  .store-type-options {
    grid-template-columns: 1fr;
  }

  .step-content {
    padding: 16px;
  }
}
</style>
