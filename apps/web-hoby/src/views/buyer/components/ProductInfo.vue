<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-12 10:51:03
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-12 18:23:50
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\components\ProductInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 商品信息展示组件
-->
<script lang="ts" setup>
import type { ProductDetail } from './types';

import { Descriptions } from 'ant-design-vue';

interface Props {
  data: ProductDetail;
  layout?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  data: () => ({
    name: '',
    image: '',
    specs: [],
    brand: '',
    category: '',
    purchaseUnit: '',
    manufacturer: '',
    model: '',
    sku: '',
    unitPrice: 0,
    totalPrice: 0,
    quantity: 0,
    requiredQuantity: 0,
    orderNo: '',
    product: '',
    restockingNum: 0,
    restockingNumStill: 0,
  }),
});
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div class="flex items-start gap-4">
      <div
        v-if="props.data.image"
        class="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded border bg-gray-100 text-gray-400"
      >
        商品图片
      </div>
      <div class="flex-1">
        <Descriptions
          :column="layout === 'horizontal' ? 2 : 1"
          size="small"
          :bordered="true"
          :colon="false"
        >
          <Descriptions.Item label="采购单位">
            {{ props.data.purchaseUnit }}
          </Descriptions.Item>
          <Descriptions.Item label="销售订单号">
            {{ props.data.orderNo }}
          </Descriptions.Item>
          <Descriptions.Item label="厂商">
            {{ props.data.manufacturer }}
          </Descriptions.Item>
          <Descriptions.Item label="产品">
            {{ props.data.product }}
          </Descriptions.Item>
          <Descriptions.Item label="型号">
            {{ props.data.model }}
          </Descriptions.Item>
          <Descriptions.Item label="SKU">
            {{ props.data.sku }}
          </Descriptions.Item>
          <Descriptions.Item label="销售单价">
            <span class="text-primary"
              >¥{{ props.data.unitPrice.toFixed(2) }}</span
            >
          </Descriptions.Item>
          <Descriptions.Item label="销售总价">
            <span class="text-primary"
              >¥{{ props.data.totalPrice.toFixed(2) }}</span
            >
          </Descriptions.Item>
          <Descriptions.Item label="销售数量">
            {{ props.data.quantity }}
          </Descriptions.Item>
          <Descriptions.Item label="需进货数量">
            {{ props.data.requiredQuantity }}
          </Descriptions.Item>
          <Descriptions.Item label="已进货数量">
            {{ props.data.restockingNum }}
          </Descriptions.Item>
          <Descriptions.Item label="待进货数量">
            {{ props.data.restockingNumStill }}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  </div>
</template>
