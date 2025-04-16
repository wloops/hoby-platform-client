import type { ActionUserMap } from '#/composables/form/useSetFieldRealValue';

// 路由meta自定义属性
export interface RouteMetaPageParams {
  pageID: string;
  isTabs?: boolean;
}

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
 * @TIME 时间
 */
export enum FieldType {
  CHECKBOX = 'checkbox', // 复选框类型
  DATE = 'date', // 日期类型
  DATETIME = 'datetime', // 日期时间类型
  NUMBER = 'number',
  OPERATION = 'operation', // 操作类型
  SELECT = 'select',
  STRING = 'string',
  SWITCH = 'switch', // 开关类型
  TIME = 'time', // 时间类型
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

export interface CustomSchemaList {
  // 显示文本
  displayName: string;
  // 域标识
  fieldName: string;
  // 域条件
  value: string;
  // 使用的域类型, 没有就根据value条件来匹配
  useType?:
    | 'date'
    | 'datetime'
    | 'enum'
    | 'form'
    | 'input'
    | 'oldPassword'
    | 'passwordEncBypk'
    | 'query'
    | 'queryArea'
    | 'readOnly'
    | 'time';
  // 是否主键 :默认false
  isPrimaryKey?: boolean;
  // 检验规则
  valueConstraint?: string;
  // 是否显示域
  visible?: boolean;
  // 缺省默认值
  default?: string;
}

// 修复 AnyFunction 未定义的问题
export type AnyFunction = (...args: any[]) => any;

// 更新 ActionButtonProps 接口，添加 API 和参数相关字段
export interface ActionButtonProps {
  // 按钮文字
  text?: string;
  // 按钮标签（优先于text）
  label?: string;
  icon?: string;
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
  // 自定义域列表
  schema?: CustomSchemaList[];
  // 新增 API 相关属性
  api?: (params: any) => Promise<any>; // API 调用函数
  params?: ((record: any, user?: ActionUserMap) => any) | Record<string, any>; // 单条记录参数
  batchParams?: (records: any[], user?: ActionUserMap) => any; // 批量操作参数
  fields?: string[]; // 要从记录中提取的字段
  successMsg?: string; // 成功提示消息
  errorMsg?: string; // 错误提示消息

  // 按钮执行模式
  runMode?: 'default' | 'drawer' | 'modal' | 'route'; // 默认不传为直接执行，drawer为弹抽屉执行，modal为弹窗执行，route为跳转执行
  // 添加批量操作相关属性
  batchable?: boolean; // 是否支持批量操作，默认为false
  batchConfirm?: string; // 批量操作确认提示文本
  originParams?: Record<string, any>; // 原始参数
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
  type: FieldType | string;
  width?: number;
  fixed?: 'left' | 'right' | boolean;
  align?: 'center' | 'left' | 'right';
  ellipsis?: boolean;
  enumName?: string;
  options?: SelectOption[];
  render?: (text: any, record: TableRecord, index: number) => any;
  actions?: ActionButtonProps[];
  actionColumnProps?: ActionColumnProps;
  defaultActions?: boolean | string[]; // true表示全部显示，字符串数组表示显示指定的按钮，false表示不显示默认按钮
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

// 展开子表配置
export interface ChildTableProps {
  // 子表列配置
  childTableColumns: any[];
  // 子表数据加载方法
  loadChildTableData?: (row: TableRecord) => Promise<any[]>;
  // 子表数据参数映射
  childTableParams?:
    | ((row: TableRecord) => Record<string, any>)
    | Record<string, any>;
  // 子表数据转换方法
  childTableDataTransform?: (data: any) => any[];
  // 子表页面ID
  pageID?: string;
  // 子表数据集ID
  pageDataGrpID?: string;
}
export interface CommonTableParams {
  pageID: string;
  showAddButton?: boolean;
  isTabs?: boolean; // 是否为多标签页
  [key: string]: any;
}

export interface TabOption {
  label: string;
  value: string;
  [key: string]: any;
}

// CommonTable 组件属性
export interface CommonTableProps {
  // 基础配置
  params: CommonTableParams;
  // 表格列配置
  columns: ColumnDefinition[];
  // 页面按钮
  pageButtons?: ActionButtonProps[];
  // 表格数据
  tableData?: TableRecord[];
  // 是否自动刷新
  autoRefresh?: boolean;
  // 是否展示搜索表单
  showSearch?: boolean;
  // 自定义请求方法
  requestApi?: RequestFunction;
  // 是否显示复选框列
  showCheckbox?: boolean;
  // 行唯一标识
  rowKey?: string;
  // 批量操作按钮
  batchActions?: ActionButtonProps[];
  // 最小选中数量
  minSelected?: number;
  // 是否启用批量操作
  enableBatchActions?: boolean;
  // 使用操作列中的按钮作为批量操作按钮
  useColumnActions?: boolean;
  // 展开子表参数
  childTables?: ChildTableProps;
  // 选中行变化事件
  onSelectionChange?: (records: TableRecord[], keys: string[]) => void;
}
