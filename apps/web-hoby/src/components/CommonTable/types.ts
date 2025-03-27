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

// 按钮类型定义
export type ButtonType = 'dashed' | 'default' | 'link' | 'primary' | 'text';
export type VxeButtonType =
  | 'default'
  | 'error'
  | 'info'
  | 'link'
  | 'primary'
  | 'success'
  | 'warning';

// 表格行数据类型
export interface TableRecord {
  [key: string]: any;
}

// 操作按钮配置
export interface ActionButtonProps {
  key?: string;
  name?: string;
  label?: string;
  text?: string;
  type?: VxeButtonType;
  status?: 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';
  danger?: boolean;
  disabled?: ((record: TableRecord | TableRecord[]) => boolean) | boolean;
  visible?: ((record: TableRecord) => boolean) | boolean;
  confirm?: 'auto' | boolean | string;
  buttonProps?: Record<string, any>;
  onClick?: (record: TableRecord | TableRecord[]) => void;
  batchable?: boolean; // 是否可用于批量操作
}

// 操作列配置项
export interface ActionColumnProps {
  align?: 'center' | 'left' | 'right';
  fixed?: 'left' | 'right' | boolean;
  title?: string;
  width?: number | string;
}

// 选项类型
export interface SelectOption {
  label: string;
  value: number | string;
  [key: string]: any;
}

// 列配置
export interface ColumnDefinition {
  title: string;
  dataIndex: string;
  visible: boolean;
  searchable?: boolean;
  type: FieldType;
  width?: number;
  fixed?: 'left' | 'right' | boolean;
  align?: 'center' | 'left' | 'right';
  ellipsis?: boolean;
  enumName?: string;
  options?: SelectOption[];
  render?: (text: any, record: TableRecord, index: number) => any;
  actions?: ActionButtonProps[];
  actionColumnProps?: ActionColumnProps;
  editable?: ((record: TableRecord) => boolean) | boolean;
  editConfig?: any; // 如果需要使用原有的 EditableCellConfig
}

// VxeTable schema 配置项
export interface SchemaItem {
  component: string;
  fieldName: string;
  label: string;
  defaultValue?: any;
  componentProps?: Record<string, any>;
  [key: string]: any;
}

// VxeTable 单元格渲染参数
export interface CellRenderParams {
  row: TableRecord;
  column: any;
  rowIndex: number;
  [key: string]: any;
}

// 请求参数
export interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

// 请求结果
export interface RequestResult {
  items: TableRecord[];
  total: number;
  [key: string]: any;
}

// 自定义请求方法类型
export type RequestFunction = (
  page: PageParams,
  formValues: any,
) => Promise<RequestResult>;

// CommonTable 组件属性
export interface CommonTableProps {
  columns: ColumnDefinition[];
  tableData?: TableRecord[];
  autoRefresh?: boolean;
  showSearch?: boolean;
  requestApi?: RequestFunction;
  showCheckbox?: boolean;
  rowKey?: string;
  batchActions?: ActionButtonProps[];
  minSelected?: number;
}
