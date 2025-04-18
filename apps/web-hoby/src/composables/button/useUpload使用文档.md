# useUpload 文件上传 Hook 使用文档

`useUpload` 是一个用于处理文件上传的 Vue Composable，提供了完整的上传状态管理、进度跟踪和错误处理功能。

## 功能特点

- 支持单文件上传
- 自动处理上传进度
- 提供上传状态管理（加载中、错误、进度、响应数据）
- 支持自定义请求头和URL参数
- 支持FormData附加字段
- 自动携带用户认证信息

## 基本用法

```typescript
<script setup lang="ts">
import { ref } from 'vue';
import { useUpload } from '@/composables/button/useUpload';

// 初始化上传hook
const { upload, isLoading, error, progress, data } = useUpload<API.UploadResponse>();

// 文件输入元素引用
const fileInput = ref<HTMLInputElement | null>(null);

// 处理文件上传
const handleUpload = async () => {
  if (!fileInput.value?.files?.length) {
    return;
  }

  try {
    const file = fileInput.value.files[0];
    const result = await upload({
      file,
      // 可选：显示上传进度
      onProgress: (percent) => {
        console.log(`上传进度: ${percent}%`);
      }
    });

    console.log('上传成功:', result);
  } catch (err) {
    console.error('上传失败:', err);
  }
};
</script>

<template>
  <div>
    <input type="file" ref="fileInput" />
    <button @click="handleUpload" :disabled="isLoading">上传文件</button>

    <div v-if="isLoading">上传中... {{ progress }}%</div>
    <div v-if="error">上传失败: {{ error }}</div>
    <div v-if="data">上传成功: {{ data }}</div>
  </div>
</template>
```

## 参数说明

### UploadOptions 接口

```typescript
interface UploadOptions<T = any> {
  url?: string; // 上传URL，默认为'/java-hoby-member-service-plug-plat/buttonServiceFileNew'
  file: Blob | File; // 要上传的文件对象（必填）
  data?: Record<string, any>; // URL查询参数
  formData?: Record<string, any>; // 附加到FormData的字段
  headers?: Record<string, string>; // 自定义请求头
  onProgress?: (progress: number) => void; // 上传进度回调
  axiosConfig?: Omit<
    AxiosRequestConfig,
    'data' | 'headers' | 'method' | 'onUploadProgress' | 'url'
  >; // 其他Axios配置
}
```

### 返回值

```typescript
{
  upload: (options: UploadOptions<T>) => Promise<T>; // 上传方法
  reset: () => void;                               // 重置状态方法
  isLoading: Ref<boolean>;                         // 是否正在上传
  error: Ref<unknown>;                             // 错误信息
  progress: Ref<number>;                           // 上传进度（0-100）
  data: Ref<T | null>;                             // 上传成功后的响应数据
}
```

## 高级用法示例

### 自定义上传URL和参数

```typescript
const { upload } = useUpload<API.UploadResponse>();

const handleCustomUpload = async (file: File) => {
  const result = await upload({
    file,
    url: '/api/custom-upload', // 自定义上传URL
    data: {
      // URL查询参数
      type: 'avatar',
      userId: '12345',
    },
    formData: {
      // 附加到FormData的字段
      description: '用户头像',
      category: 'profile',
    },
    headers: {
      // 自定义请求头
      'X-Custom-Header': 'custom-value',
    },
  });

  return result;
};
```

### 显示上传进度条

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useUpload } from '@/composables/button/useUpload';

const { upload, isLoading, progress } = useUpload();
const file = ref<File | null>(null);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

const handleUpload = async () => {
  if (!file.value) return;

  await upload({
    file: file.value,
    onProgress: (percent) => {
      // progress ref会自动更新，这里可以做额外处理
      console.log(`当前进度: ${percent}%`);
    },
  });
};
</script>

<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="handleUpload" :disabled="isLoading || !file">上传</button>

    <!-- 进度条 -->
    <div v-if="isLoading" class="progress-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      <span>{{ progress }}%</span>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-container span {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  line-height: 20px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}
</style>
```

### 处理多文件上传

```typescript
<script setup lang="ts">
import { ref } from 'vue';
import { useUpload } from '@/composables/button/useUpload';

const files = ref<File[]>([]);
const uploadResults = ref<any[]>([]);
const uploadErrors = ref<any[]>([]);
const isUploading = ref(false);
const currentProgress = ref<Record<string, number>>({});

const handleFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    files.value = Array.from(target.files);
  }
};

const uploadMultipleFiles = async () => {
  if (!files.value.length) return;

  isUploading.value = true;
  uploadResults.value = [];
  uploadErrors.value = [];
  currentProgress.value = {};

  // 为每个文件创建一个上传实例
  const uploadPromises = files.value.map(async (file) => {
    const { upload } = useUpload();

    // 初始化进度
    currentProgress.value[file.name] = 0;

    try {
      const result = await upload({
        file,
        onProgress: (percent) => {
          currentProgress.value[file.name] = percent;
        }
      });

      uploadResults.value.push({
        fileName: file.name,
        result
      });

      return result;
    } catch (error) {
      uploadErrors.value.push({
        fileName: file.name,
        error
      });
      throw error;
    }
  });

  // 等待所有上传完成
  try {
    await Promise.allSettled(uploadPromises);
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div>
    <input type="file" multiple @change="handleFilesChange" />
    <button @click="uploadMultipleFiles" :disabled="isUploading || !files.length">
      {{ isUploading ? '上传中...' : '上传文件' }}
    </button>

    <!-- 显示每个文件的上传进度 -->
    <div v-if="files.length" class="file-list">
      <div v-for="file in files" :key="file.name" class="file-item">
        <div class="file-info">
          <span>{{ file.name }}</span>
          <span>{{ (file.size / 1024).toFixed(2) }} KB</span>
        </div>
        <div class="progress-container">
          <div
            class="progress-bar"
            :style="{ width: `${currentProgress[file.name] || 0}%` }"
          ></div>
          <span>{{ currentProgress[file.name] || 0 }}%</span>
        </div>
      </div>
    </div>

    <!-- 显示上传结果 -->
    <div v-if="uploadResults.length" class="results">
      <h3>上传成功 ({{ uploadResults.length }})</h3>
      <ul>
        <li v-for="item in uploadResults" :key="item.fileName">
          {{ item.fileName }}
        </li>
      </ul>
    </div>

    <!-- 显示上传错误 -->
    <div v-if="uploadErrors.length" class="errors">
      <h3>上传失败 ({{ uploadErrors.length }})</h3>
      <ul>
        <li v-for="item in uploadErrors" :key="item.fileName">
          {{ item.fileName }}: {{ item.error }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

## 注意事项

1. 默认上传URL为 `/java-hoby-member-service-plug-plat/buttonServiceFileNew`，可通过 `url` 参数自定义
2. 上传时会自动携带用户认证信息（`res_token` 和 `X-CSRF-TOKEN`）
3. 上传进度通过 `onProgress` 回调和 `progress` 响应式变量提供
4. 使用 `reset()` 方法可以重置所有状态（isLoading、error、progress、data）
5. 上传失败时，错误会被存储在 `error` 响应式变量中，同时也会抛出异常

## 类型定义

如果需要指定上传响应的类型，可以在调用 `useUpload` 时提供泛型参数：

```typescript
// 定义上传响应类型
interface UploadResponse {
  code: number;
  message: string;
  data: {
    url: string;
    fileName: string;
    fileSize: number;
  };
}

// 使用泛型指定响应类型
const { upload, data } = useUpload<UploadResponse>();

// 现在 data.value 的类型为 UploadResponse | null
```
