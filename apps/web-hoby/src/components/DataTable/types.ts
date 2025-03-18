// 定义字段类型枚举
export enum FieldType {
  CHECKBOX = 'checkbox', // 新增复选框类型
  DATE = 'date', // 新增日期类型
  DATETIME = 'datetime', // 新增日期时间类型
  NUMBER = 'number',
  SELECT = 'select',
  STRING = 'string',
  SWITCH = 'switch', // 新增开关类型
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

// 定义表头配置接口
export interface ColumnConfig {
  dataIndex: string; // 字段名
  fixed?: 'left' | 'right' | boolean; // 是否固定列
  options?: Array<{
    // 下拉选项（当type为SELECT时使用）
    label: string;
    value: number | string;
  }>;
  render?: (text: any, record: any, index: number) => any; // 自定义渲染函数
  searchable?: boolean; // 是否可搜索
  sorter?: boolean; // 是否可排序
  title: string; // 显示名称
  type?: FieldType; // 字段类型
  visible?: boolean; // 是否显示
  width?: number | string; // 列宽度
}

// 定义表格数据通用接口
export interface TableItem {
  [key: string]: any;
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
