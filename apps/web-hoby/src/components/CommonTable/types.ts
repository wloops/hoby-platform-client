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

// 修复 AnyFunction 未定义的问题
export type AnyFunction = (...args: any[]) => any;

// 更新 ActionButtonProps 接口，添加 API 和参数相关字段
export interface ActionButtonProps {
  // 按钮文字
  text?: string;
  // 按钮标签（优先于text）
  label?: string;
  // 按钮类型
  type?: VxeButtonType;
  // 是否危险操作
  danger?: boolean;
  // 按钮唯一标识
  key?: string;
  // 按钮名称
  name?: string;
  // 按钮是否禁用 - 修改为只处理单条记录
  disabled?: ((record: any) => boolean) | boolean;
  // 按钮是否可见 - 修改为只处理单条记录
  visible?: ((record: any) => boolean) | boolean;
  // 点击回调 - 修改为只处理单条记录
  onClick?: AnyFunction;
  // 是否需要确认
  confirm?: 'auto' | boolean | string;
  // 操作后是否清除选择
  clearAfterAction?: boolean;
  autoRefresh?: boolean; // 点击后是否自动刷新表格，默认为true

  // 新增 API 相关属性
  api?: (params: any) => Promise<any>; // API 调用函数
  params?: ((record: any) => any) | Record<string, any>; // 单条记录参数
  batchParams?: (records: any[]) => any; // 批量操作参数
  fields?: string[]; // 要从记录中提取的字段
  successMsg?: string; // 成功提示消息
  errorMsg?: string; // 错误提示消息
}

// 批量操作事件数据
export interface BatchActionEvent {
  action: ActionButtonProps;
  records: TableRecord[];
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

// 分页信息
export interface PageInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

// 定义搜索参数接口
export interface SearchParams {
  [key: string]: any;
  currentPage: number;
  numOfPerPage: number;
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
