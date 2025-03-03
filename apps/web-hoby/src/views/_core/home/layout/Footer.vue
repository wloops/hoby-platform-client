<script setup lang="ts">
const footerSections = {
  about: {
    title: '关于我们',
    items: ['公司介绍', '招贤纳士', '联系我们', '隐私政策'],
  },
  service: {
    title: '客户服务',
    items: ['帮助中心', '售后政策', '配送方式', '支付方式'],
  },
  business: {
    title: '商务合作',
    items: ['成为供应商', '广告合作', '招商合作', '平台规则'],
  },
  download: {
    title: '下载APP',
    items: ['iOS版本', 'Android版本', '小程序', '快捷支付'],
  },
};
</script>

<template>
  <!-- 底部信息 -->
  <footer class="mt-12 border-t bg-white py-16">
    <div class="mx-auto max-w-7xl px-4">
      <div class="mb-8 grid grid-cols-4 gap-8">
        <div v-for="(section, index) in footerSections" :key="index">
          <h3 class="mb-4 font-bold text-gray-800">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="item in section.items" :key="item">
              <a
                href="#"
                class="text-sm text-gray-500 transition-colors hover:text-purple-600"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t pt-8 text-center text-sm text-gray-500">
        <p>© 2024 Modern Store. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
