import { reactive, ref } from 'vue';

interface ImportPlatform {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface FieldMapping {
  systemField: string;
  thirdPartyField: string;
  sampleValue: string;
}

interface ImportOptions {
  skipExisting: boolean;
  autoStatus: boolean;
  notifyCustomer: boolean;
}

interface PreviewOrder {
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface ImportResult {
  success: number;
  skipped: number;
  failed: number;
  errors: Array<{
    orderNumber: string;
    reason: string;
  }>;
}

export function useImportState() {
  const platforms = ref<ImportPlatform[]>([
    {
      id: 'zcy',
      name: '政采云',
      logo: '',
      description: '政采云订单导入',
    },
    {
      id: 'other',
      name: '其他平台',
      logo: '',
      description: '其他平台订单导入',
    },
  ]);

  const selectedPlatform = ref('');
  const uploadedFile = ref<File | null>(null);

  const thirdPartyFields = ref([
    '订单号',
    '买家昵称',
    '收货人姓名',
    '联系电话',
    '收货地址',
    '商品名称',
    '商品数量',
    '商品单价',
    '订单金额',
    '支付方式',
    '订单状态',
    '创建时间',
  ]);

  const fieldMappings = ref<FieldMapping[]>([
    {
      systemField: '订单编号',
      thirdPartyField: '',
      sampleValue: 'TB123456789',
    },
    { systemField: '客户姓名', thirdPartyField: '', sampleValue: '张三' },
    {
      systemField: '联系电话',
      thirdPartyField: '',
      sampleValue: '13800138000',
    },
    {
      systemField: '收货地址',
      thirdPartyField: '',
      sampleValue: '北京市朝阳区xxx街道',
    },
    { systemField: '商品名称', thirdPartyField: '', sampleValue: '智能手机' },
    { systemField: '商品数量', thirdPartyField: '', sampleValue: '1' },
    { systemField: '订单金额', thirdPartyField: '', sampleValue: '3999.00' },
    { systemField: '订单状态', thirdPartyField: '', sampleValue: '已付款' },
    {
      systemField: '创建时间',
      thirdPartyField: '',
      sampleValue: '2023-03-15 14:30:25',
    },
  ]);

  const importOptions = reactive<ImportOptions>({
    skipExisting: true,
    autoStatus: true,
    notifyCustomer: false,
  });

  const previewData = ref<PreviewOrder[]>([
    {
      orderNumber: 'TB123456789',
      customer: '张三',
      product: '智能手机',
      amount: 3999,
      status: '已付款',
      createdAt: '2023-03-15 14:30:25',
    },
    {
      orderNumber: 'TB123456790',
      customer: '李四',
      product: '蓝牙耳机',
      amount: 299,
      status: '已付款',
      createdAt: '2023-03-15 15:20:10',
    },
    {
      orderNumber: 'TB123456791',
      customer: '王五',
      product: '智能手表',
      amount: 1299,
      status: '待发货',
      createdAt: '2023-03-15 16:45:30',
    },
  ]);

  const importResult = reactive<ImportResult>({
    success: 2,
    skipped: 0,
    failed: 1,
    errors: [{ orderNumber: 'TB123456791', reason: '商品信息不完整' }],
  });

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      uploadedFile.value = input.files[0] as File;
    }
  };

  const startImport = () => {
    // 模拟导入过程，这里可以替换为实际的导入逻辑
    // console.log('开始导入数据...');
    return import.meta.env.PROD
      ? new Promise((resolve) => setTimeout(resolve, 1000))
      : Promise.resolve();
  };

  const resetForm = () => {
    selectedPlatform.value = '';
    uploadedFile.value = null;
    fieldMappings.value.forEach((field) => {
      field.thirdPartyField = '';
    });
  };

  const getPlatformName = (id: string): string => {
    const platform = platforms.value.find((p) => p.id === id);
    return platform ? platform.name : '未知平台';
  };

  return {
    platforms,
    selectedPlatform,
    uploadedFile,
    thirdPartyFields,
    fieldMappings,
    importOptions,
    previewData,
    importResult,
    handleFileUpload,
    startImport,
    resetForm,
    getPlatformName,
  };
}
