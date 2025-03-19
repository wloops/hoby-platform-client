import type { VNodeChild } from 'vue';

// 定义字段类型枚举
/**
 * @CHECKBOX 复选框
 * @DATE 日期
 * @DATETIME 日期时间
 * @NUMBER 数字
 * @OPERATION 操作
 * @SELECT 选择
 * @STRING 字符串
 * @SWITCH 开关
 */
export enum FieldType {
  CHECKBOX = 'checkbox', // 新增复选框类型
  DATE = 'date', // 新增日期类型
  DATETIME = 'datetime', // 新增日期时间类型
  NUMBER = 'number',
  OPERATION = 'operation', // 新增操作类型
  SELECT = 'select',
  STRING = 'string',
  SWITCH = 'switch', // 新增开关类型
}
// 定义表格数据通用接口
export interface TableItem {
  [key: string]: any;
}

// 定义选项接口
export interface SelectOption {
  label: string;
  value: number | string;
}

// 不直接引用ant-design-vue的类型，改为自定义
export type FilterValue = (boolean | number | string)[];
export type SorterOrder = 'ascend' | 'descend' | null;

export interface SorterResult {
  column?: {
    [key: string]: any;
    dataIndex: string;
  };
  columnKey: string;
  field: string;
  order?: SorterOrder;
}

// 定义操作按钮接口 (放在ColumnConfig之前定义)
export interface ActionButton {
  // 按钮类型
  type?: 'dashed' | 'default' | 'ghost' | 'link' | 'primary' | 'text';
  // 按钮危险状态
  danger?: boolean;
  // 按钮文本
  text: string;
  // 图标名称（可选）
  icon?: string;
  // 点击事件
  onClick: (record: TableItem) => void;
  // 控制按钮是否显示
  show?: (record: TableItem) => boolean;
  // 控制按钮是否禁用
  disabled?: (record: TableItem) => boolean;
  // 确认提示文本（如果设置，点击时会显示确认对话框）
  confirm?: string;
  // 确认对话框标题
  confirmTitle?: string;
  // 按钮权限控制，如果设置，只有当用户有此权限时才显示
  permission?: string;
  // 其他任意属性
  [key: string]: any;
}

// 定义表头配置接口
export interface ColumnConfig {
  title: string; // 列标题
  dataIndex: string; // 列数据索引
  visible: boolean; // 是否显示
  searchable?: boolean; // 是否可搜索
  type: FieldType; // 列类型
  width?: number; // 列宽度
  fixed?: 'left' | 'right' | boolean; // 是否固定
  align?: 'center' | 'left' | 'right'; // 对齐方式
  ellipsis?: boolean; // 是否显示省略号
  options?: SelectOption[]; // 选项列表
  render?: (text: any, record: TableItem, index: number) => VNodeChild; // 自定义渲染
  // 列操作按钮配置
  actions?: ActionButton[]; // 操作按钮配置
  // 操作列样式
  actionColumnProps?: {
    align?: 'center' | 'left' | 'right'; // 对齐方式
    fixed?: 'left' | 'right' | boolean; // 是否固定
    title?: string; // 标题
    width?: number | string; // 宽度
  };
}

// 定义搜索表单接口
export interface SearchFormState {
  [key: string]: any;
}

// 定义分页变化信息接口
export interface PageChangeInfo {
  current: number;
  filters?: Record<string, FilterValue>;
  pageSize: number;
  sorter?: SorterResult | SorterResult[];
}

// 定义搜索参数接口
export interface SearchParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

// 定义表格响应数据接口
export interface TableResponseData {
  data: TableItem[];
  total: number;
}

// 定义选择变化事件接口
export interface SelectionChangeEvent {
  keys: Array<number | string>;
  rows: TableItem[];
}

// 添加值转换器接口
export interface ValueTransformer {
  toDisplay: (value: any, column: ColumnConfig) => string;
  toValue: (displayValue: string, column: ColumnConfig) => any;
}
