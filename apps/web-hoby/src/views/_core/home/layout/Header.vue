<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-02-27 16:17:55
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-03 10:11:19
 * @FilePath: \HOBY-platform\app\components\layout\Header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <header class="bg-gray-200 shadow-sm">
    <div class="container mx-auto px-4">
      <!-- 顶部信息栏 -->
      <div class="border-b py-2 text-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <RouterLink to="/" class="flex items-center hover:text-gray-600">
              <i class="i-lucide:house" mr-1></i>
              首页
            </RouterLink>
            <span>您好，欢迎来到HOBY货比平台！</span>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink to="/auth/login" class="text-red-500">
              请登录
            </RouterLink>
            <RouterLink to="/auth/register" class="text-dark-100">
              免费注册
            </RouterLink>
            <!-- <div class="ml-4 flex items-center space-x-4">
              <RouterLink to="/user">
                我的货比
              </RouterLink>
              <RouterLink to="/cart">
                采购车
              </RouterLink>
              <RouterLink to="/user/orders">
                我的订单
              </RouterLink>
              <RouterLink to="/">
                我要买货
              </RouterLink>
              <RouterLink to="/">
                我要卖货
              </RouterLink>
              <RouterLink to="/">
                工作台
              </RouterLink>
              <RouterLink to="/help">
                客服中心
              </RouterLink>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
