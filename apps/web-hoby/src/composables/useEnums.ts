import { ref } from 'vue';

// 定义枚举类型
/**
 * 枚举项
 *
 * 颜色
 * default|success|processing|warning|error|【自定义】
 */
interface EnumItem {
  label: string;
  color?: string; // color 非必填
}
interface Enums {
  [key: string]: Record<string, EnumItem>;
}
// interface Enums {
//   restockingStatus: Record<string, EnumItem>; // 进货状态
//   voucherType: Record<string, EnumItem>; // 结算凭证类型
//   paymentStatus: Record<string, EnumItem>; // 付款状态
// }

// 本地枚举值
const localEnums: Enums = {
  boolean: {
    '0': {
      label: '否',
      color: 'default',
    },
    '1': {
      label: '是',
      color: 'success',
    },
  },
  restockingStatus: {
    '0': {
      label: '不需要进货',
      color: 'default',
    },
    '1': {
      label: '已完成进货',
      color: 'success',
    },
    '2': {
      label: '正在进货',
      color: 'processing',
    },
  },
  voucherType: {
    '1': {
      label: '订单现结支付凭证',
    },
    '2': {
      label: '订单预付支付凭证',
    },
    '3': {
      label: '信用担保支付订单尾款凭证',
    },
    '4': {
      label: '信用担保支付订单全款凭证',
    },
    '101': {
      label: '厂商分成结算凭证',
    },
    '102': {
      label: '经销商分成结算凭证',
    },
    '103': {
      label: '运营平台分成结算凭证',
    },
  },
  paymentStatus: {
    '0': {
      label: '未支付',
      color: 'warning',
    },
    '1': {
      label: '等待支付确认',
      color: 'processing',
    },
    '2': {
      label: '部分支付',
      color: 'warning',
    },
    '3': {
      label: '已支付',
      color: 'success',
    },
    '10': {
      label: '已支付后撤销',
      color: 'default',
    },
    '11': {
      label: '已支付后提交退款申请',
      color: 'error',
    },
    '20': {
      label: '支付中',
      color: 'processing',
    },
    '30': {
      label: '信用担保支付全款',
      color: 'success',
    },
  },
  // 仓库状态（摇奖活动状态）
  warehouseStatus: {
    '0': {
      label: '已停止',
      color: 'default',
    },
    '1': {
      label: '策划',
      color: 'processing',
    },
    '2': {
      label: '发布',
      color: 'success',
    },
    '3': {
      label: '作废',
      color: 'error',
    },
    '4': {
      label: '开始报名',
      color: 'default',
    },
    '5': {
      label: '报名结束',
      color: 'default',
    },
    '6': {
      label: '摇奖开始',
      color: 'default',
    },
    '7': {
      label: '摇奖结束',
      color: 'default',
    },
    '8': {
      label: '活动结束',
      color: 'default',
    },
    '9': {
      label: '报名已满',
      color: 'default',
    },
    '1000': {
      label: '进行中',
      color: 'processing',
    },
    '1001': {
      label: '未通过审批',
      color: 'warning',
    },
  },
  // HOBY库存单据类型
  warehouseBillCateStatus: {
    '0': {
      label: '未知',
      color: 'default',
    },
    '1': {
      label: '入库单',
      color: 'success',
    },
    '2': {
      label: '出库单',
      color: 'processing',
    },
    '3': {
      label: '调拨单',
      color: 'success',
    },
    '4': {
      label: '订单配货单',
      color: 'processing',
    },
    '20': {
      label: '仓储购物车',
      color: 'default',
    },
  },
  // HOBY库存单据状态
  warehouseBillStatus: {
    '0': {
      label: '待审核',
      color: 'success',
    },
    '11': {
      label: '待入库',
      color: 'success',
    },
    '12': {
      label: '已入库',
      color: 'processing',
    },
    '21': {
      label: '待出库',
      color: 'processing',
    },
    '22': {
      label: '已出库',
      color: 'default',
    },
  },
};

// 自定义 Hook
export function useEnums() {
  // 将枚举值转换为响应式对象
  const enums = ref<Enums>(localEnums);

  /**
   * 获取枚举值的描述
   * @param type 枚举类型（如 'enumName|id'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的描述（如 '不需要进货'）
   */
  const getEnumLabel = (type: string, key: string): string => {
    const [enumName, id] = type.split('|') as [keyof Enums, string];
    const mapKey = enumName || id;
    const enumValue = enums.value[mapKey]?.[key];
    return enumValue?.label || '未知';
  };

  /**
   * 获取枚举值的颜色
   * @param type 枚举类型（如 'enumName|id'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的颜色（如 'default'），如果未定义则返回默认值
   */
  const getEnumColor = (type: string, key: string): string => {
    const [enumName, id] = type.split('|') as [keyof Enums, string];
    const mapKey = enumName || id;
    const enumValue = enums.value[mapKey]?.[key];
    return enumValue?.color || '#434B52'; // 默认灰色
  };

  /**
   * 获取枚举列表
   * @param type 枚举类型（如 'restockingStatus'）
   * @returns 枚举键值对列表（如 [{ value: '0', label: '不需要进货', color: 'default' }]）
   */
  const getEnumList = (
    type: keyof Enums,
  ): Array<{ color?: string; label: string; value: string }> => {
    return (
      (enums.value[type] &&
        Object.entries(enums.value[type]).map(([key, item]) => ({
          value: key,
          label: item.label,
          color: item.color, // color 非必填
        }))) ||
      []
    );
  };

  return {
    enums,
    getEnumLabel,
    getEnumColor,
    getEnumList,
  };
}
