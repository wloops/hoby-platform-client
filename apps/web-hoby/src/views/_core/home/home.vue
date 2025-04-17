<script lang="ts" setup>
import type { BasicUserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import {
  FireOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
// 按需导入 Ant Design Vue 组件和图标
import { Avatar, Button, Card, Divider } from 'ant-design-vue';

import BrandCard from './components/BrandCard.vue';
import ProductCard from './components/ProductCard.vue';
import SearchBox from './components/SearchBox.vue';
import ServiceCard from './components/ServiceCard.vue';
import Header from './layout/Header.vue';

const router = useRouter();
const userStore = useUserStore();
const accessStore = useAccessStore();

// 切换登录状态（仅用于演示）
const toggleLogin = () => {
  router.push('/auth/login');
};

const headerRef = ref<null | {
  handleLogout: () => void;
}>(null);
function handleLogout() {
  headerRef.value?.handleLogout();
}

const toggleRegister = () => {
  router.push('/auth/register');
};

// 数据
const brands = ref([
  {
    id: 1,
    name: '得力文具',
    logo: './static/logos/deli.png',
  },
  {
    id: 2,
    name: '三只松鼠',
    logo: './static/logos/3shu.png',
  },
  {
    id: 3,
    name: '晨光文具',
    logo: './static/logos/chengguang.png',
  },
  {
    id: 4,
    name: '格力',
    logo: './static/logos/gree.png',
  },
  {
    id: 5,
    name: '霍尼韦尔',
    logo: './static/logos/honeywell.jpg',
  },
  {
    id: 6,
    name: '美的',
    logo: './static/logos/midea.png',
  },
]);

const newProducts = ref([
  {
    id: 1,
    name: '晨光水性笔',
    image: './static/product/cg-sxb.jpg',
    tag: '热销',
  },
  {
    id: 2,
    name: '晨光长尾夹',
    image: './static/product/cg-cwj.jpg',
    tag: '新品',
  },
  {
    id: 3,
    name: '得力档案盒',
    image: './static/product/dl-dah.jpg',
    tag: '促销',
  },
  {
    id: 4,
    name: '格力电风扇',
    image: './static/product/gl-dfs.jpg',
    tag: '限时',
  },
  {
    id: 5,
    name: '格力空调',
    image: './static/product/gl-kt.jpg',
    tag: '热销',
  },
  {
    id: 6,
    name: '美的热水壶',
    image: './static/product/md-rsh.jpg',
    tag: '新品',
  },
  {
    id: 6,
    name: '得力文件袋',
    image: './static/product/dl-wjd.jpg',
    tag: '新品',
  },
  {
    id: 7,
    name: '三只松鼠坚果礼盒',
    image: './static/product/szss.jpg',
    tag: '促销',
  },
]);

const services = ref([
  {
    id: 1,
    name: '供应链金融',
    icon: 'bank-outlined',
    desc: '提供全面的供应链金融解决方案',
  },
  {
    id: 2,
    name: '物流跟踪',
    icon: 'car-outlined',
    desc: '实时追踪货物运输状态',
  },
  {
    id: 3,
    name: '企业采购',
    icon: 'shopping-outlined',
    desc: '一站式企业采购服务平台',
  },
]);

const announcements = ref([
  {
    id: 1,
    title: '系统更新通知',
    content: '我们将于本周六进行系统维护，届时部分功能可能暂时不可用。',
    date: '2023-06-20',
    important: true,
  },
  {
    id: 2,
    title: '新品上架通知',
    content: '多款新品已经上架，现在下单享受首发优惠。',
    date: '2023-06-18',
    important: false,
  },
  {
    id: 3,
    title: '供应商招募计划',
    content: '我们正在寻找更多优质供应商，加入我们的B2B生态系统。',
    date: '2023-06-15',
    important: true,
  },
]);

// 未登录时的快速导航
const guestQuickLinks = ref([
  { icon: 'icon-[lucide--user]', text: '注册账号', link: '/auth/register' },
  { icon: 'icon-[lucide--store]', text: '入驻商城', link: '/auth/login' },
  { icon: 'icon-[lucide--blocks]', text: '产品浏览', link: '/products' },
  { icon: 'icon-[lucide--circle-help]', text: '帮助中心', link: '/help' },
]);

// 已登录用户的快速导航
const userQuickLinks = ref([
  {
    icon: 'icon-[lucide--shopping-cart]',
    text: '我要进货',
    link: '/my/purchase-order',
    authority: ['my'],
  },
  {
    icon: 'icon-[lucide--store]',
    text: '我的店铺',
    link: '/my/shop',
    authority: ['my'],
  },
  {
    icon: 'icon-[solar--clipboard-linear]',
    text: '我的订单',
    link: '/my/sales-order',
    authority: ['my'],
  },
  {
    icon: 'icon-[lucide--blocks]',
    text: '我的产品',
    link: '/my',
    authority: ['my'],
  },
]);

const goToMainPage = async (page: any) => {
  accessStore.setIsAccessChecked(false);
  const access: string[] = page.authority;
  const userInfo = userStore.userInfo;
  const addRolesUserInfo = {
    ...userInfo,
    roles: access,
  };
  await userStore.setUserInfo(addRolesUserInfo as BasicUserInfo);
  // sessionStorage.setItem('userInfo', JSON.stringify(addRolesUserInfo));
  await router.push(page.link);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header容器 -->
    <div class="z-1000 sticky top-0 bg-white shadow-sm">
      <div class="container mx-auto px-0">
        <Header ref="headerRef" />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="mt-4 flex gap-6">
        <!-- 主内容区 -->
        <div class="flex-1">
          <!-- 搜索框区域 - 使用SearchBox组件 -->
          <div class="mb-6">
            <div class="rounded-md border border-gray-300 bg-white shadow-sm">
              <SearchBox />
            </div>
          </div>
          <!-- 品牌展示区 -->
          <section class="z-1 mb-8 rounded-lg bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="flex items-center text-xl font-bold text-gray-800">
                <span
                  class="mr-3 inline-block h-5 w-1 rounded bg-blue-500"
                ></span>
                品牌精选
              </h2>
              <Button type="link" class="text-blue-500 hover:text-blue-700">
                查看更多
              </Button>
            </div>
            <div class="grid grid-cols-6 gap-5">
              <BrandCard
                v-for="brand in brands"
                :key="brand.id"
                :brand="brand"
              />
            </div>
          </section>

          <!-- 新品展示区 -->
          <section class="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="flex items-center text-xl font-bold text-gray-800">
                <span
                  class="mr-3 inline-block h-5 w-1 rounded bg-red-500"
                ></span>
                <FireOutlined class="mr-2 text-red-500" />
                新品首发
              </h2>
              <Button type="link" class="text-blue-500 hover:text-blue-700">
                查看更多
              </Button>
            </div>
            <div class="grid grid-cols-4 gap-4">
              <ProductCard
                v-for="product in newProducts"
                :key="product.id"
                :product="product"
                class="compact"
              />
            </div>
          </section>

          <!-- 服务展示区 -->
          <section class="rounded-lg bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="flex items-center text-xl font-bold text-gray-800">
                <span
                  class="mr-3 inline-block h-5 w-1 rounded bg-green-500"
                ></span>
                <RiseOutlined class="mr-2 text-green-500" />
                企业服务
              </h2>
              <Button
                type="link"
                class="flex items-center text-blue-500 hover:text-blue-700"
              >
                了解更多
                <span class="ml-1">→</span>
              </Button>
            </div>
            <div class="flex gap-4">
              <ServiceCard
                v-for="service in services"
                :key="service.id"
                :service="service"
              />
            </div>
          </section>
        </div>

        <!-- 侧边栏 -->
        <aside class="w-80">
          <!-- 用户信息卡片 -->
          <div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <!-- 根据登录状态显示不同内容 -->
            <template v-if="userStore.userInfo">
              <h2 class="mb-4 border-b pb-2 text-xl font-bold text-gray-800">
                欢迎回来
              </h2>
              <div class="mb-4 flex items-center">
                <Avatar
                  :size="64"
                  class="mr-4 bg-blue-200"
                  :src="userStore.userInfo ? preferences.app.defaultAvatar : ''"
                >
                  <template #icon>
                    <UserOutlined />
                  </template>
                </Avatar>
                <div>
                  <div class="text-lg font-medium">
                    {{ userStore.userInfo?.username }}
                  </div>
                  <div
                    class="flex flex-col items-start gap-1 text-sm text-gray-500"
                  >
                    <span class="text-lg font-bold text-gray-800">{{
                      userStore.userInfo?.tellerNo
                    }}</span>
                    <div>
                      <span
                        class="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                      >
                        {{ userStore.userInfo?.companyName }}
                      </span>
                      <!-- 退出登录 -->
                      <button
                        class="ml-2 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                        @click="handleLogout"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <h2 class="mb-4 border-b pb-2 text-xl font-bold text-gray-800">
                欢迎来到HOBY货比平台
              </h2>
              <div class="mb-4 flex flex-col items-center">
                <Avatar :size="64" class="mb-2 bg-gray-200">
                  <template #icon><UserOutlined /></template>
                </Avatar>
                <p class="mt-2 text-sm text-gray-500">
                  您尚未登录，请先登录或注册
                </p>
                <div class="mt-3 flex w-full gap-2">
                  <Button type="primary" class="flex-1" @click="toggleLogin">
                    登录
                  </Button>
                  <Button class="flex-1" @click="toggleRegister">注册</Button>
                </div>
              </div>
            </template>

            <Divider class="my-3">
              {{ userStore.userInfo ? '快捷导航' : '快速通道' }}
            </Divider>

            <div class="grid grid-cols-2 gap-3">
              <template v-if="userStore.userInfo">
                <Button
                  v-for="link in userQuickLinks"
                  :key="link.text"
                  class="text-center hover:text-blue-500"
                  @click="goToMainPage(link)"
                >
                  <div class="mr-1 flex items-center justify-center">
                    <span :class="link.icon" class="mr-1"></span>
                    <span>{{ link.text }}</span>
                  </div>
                </Button>
              </template>
              <template v-else>
                <Button
                  v-for="link in guestQuickLinks"
                  :key="link.text"
                  class="text-center hover:text-blue-500"
                  @click="goToMainPage(link)"
                >
                  <div class="mr-1 flex items-center justify-center">
                    <span :class="link.icon" class="mr-1"></span>
                    <span>{{ link.text }}</span>
                  </div>
                </Button>
              </template>
            </div>
          </div>

          <!-- 公告区域 -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2
              class="mb-4 flex items-center border-b pb-2 text-xl font-bold text-gray-800"
            >
              <InfoCircleOutlined class="mr-2 text-blue-500" />
              系统公告
            </h2>
            <div class="space-y-3">
              <Card
                v-for="item in announcements"
                :key="item.id"
                class="cursor-pointer transition-all hover:shadow"
                :class="[item.important ? 'border-l-4 border-l-red-500' : '']"
                size="small"
              >
                <template #title>
                  <div class="flex items-center text-base font-medium">
                    <span
                      v-if="item.important"
                      class="mr-2 inline-block rounded border border-red-500 px-1 py-0.5 text-xs text-red-500"
                      >重要</span
                    >
                    {{ item.title }}
                  </div>
                </template>
                <div class="text-sm text-gray-600">{{ item.content }}</div>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs text-gray-400">{{ item.date }}</span>
                  <Button type="link" size="small" class="p-0">查看详情</Button>
                </div>
              </Card>
            </div>
            <div class="mt-3 text-center">
              <Button type="link">查看全部公告</Button>
            </div>
          </div>
        </aside>
      </div>

      <!-- 页脚 -->
      <footer class="mt-10 border-t py-8 text-center text-gray-500">
        <div class="mb-6 flex justify-center space-x-12">
          <a href="#" class="transition-colors hover:text-blue-500">关于我们</a>
          <a href="#" class="transition-colors hover:text-blue-500">帮助中心</a>
          <a href="#" class="transition-colors hover:text-blue-500">联系客服</a>
          <a href="#" class="transition-colors hover:text-blue-500">隐私政策</a>
        </div>
        <p>© 2023 B2B商城平台 版权所有</p>
      </footer>
    </div>
  </div>
</template>
