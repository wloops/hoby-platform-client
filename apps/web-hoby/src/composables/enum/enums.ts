// 定义枚举类型
export interface EnumItem {
  value: string;
  label: string;
  color?: string;
}

export interface Enums {
  [key: string]: EnumItem[];
}

export const localEnums: Enums = {
  boolean: [
    { value: '0', label: '否', color: 'default' },
    { value: '1', label: '是', color: 'success' },
  ],
  是否: [
    { value: '0', label: '否', color: 'default' },
    { value: '1', label: '是', color: 'success' },
  ],
  restockingStatus: [
    { value: '0', label: '不需要进货', color: 'default' },
    { value: '1', label: '已完成进货', color: 'success' },
    { value: '2', label: '正在进货', color: 'processing' },
  ],
  voucherType: [
    { value: '1', label: '订单现结支付凭证' },
    { value: '2', label: '订单预付支付凭证' },
    { value: '3', label: '信用担保支付订单尾款凭证' },
    { value: '4', label: '信用担保支付订单全款凭证' },
    { value: '101', label: '厂商分成结算凭证' },
    { value: '102', label: '经销商分成结算凭证' },
    { value: '103', label: '运营平台分成结算凭证' },
  ],
  paymentStatus: [
    { value: '0', label: '未支付', color: 'warning' },
    { value: '1', label: '等待支付确认', color: 'processing' },
    { value: '2', label: '部分支付', color: 'warning' },
    { value: '3', label: '已支付', color: 'success' },
    { value: '10', label: '已支付后撤销', color: 'default' },
    { value: '11', label: '已支付后提交退款申请', color: 'error' },
    { value: '20', label: '支付中', color: 'processing' },
    { value: '30', label: '信用担保支付全款', color: 'success' },
  ],
  // 仓库状态（摇奖活动状态）
  warehouseStatus: [
    { value: '0', label: '已停止', color: 'default' },
    { value: '1', label: '策划', color: 'processing' },
    { value: '2', label: '发布', color: 'success' },
    { value: '3', label: '作废', color: 'error' },
    { value: '4', label: '开始报名', color: 'default' },
    { value: '5', label: '报名结束', color: 'default' },
    { value: '6', label: '摇奖开始', color: 'default' },
    { value: '7', label: '摇奖结束', color: 'default' },
    { value: '8', label: '活动结束', color: 'default' },
    { value: '9', label: '报名已满', color: 'default' },
    { value: '1000', label: '进行中', color: 'processing' },
    { value: '1001', label: '未通过审批', color: 'warning' },
  ],
  摇奖活动状态: [
    { value: '0', label: '已停止', color: 'default' },
    { value: '1', label: '策划', color: 'processing' },
    { value: '2', label: '发布', color: 'success' },
    { value: '3', label: '作废', color: 'error' },
    { value: '4', label: '开始报名', color: 'default' },
    { value: '5', label: '报名结束', color: 'default' },
    { value: '6', label: '摇奖开始', color: 'default' },
    { value: '7', label: '摇奖结束', color: 'default' },
    { value: '8', label: '活动结束', color: 'default' },
    { value: '9', label: '报名已满', color: 'default' },
    { value: '1000', label: '进行中', color: 'processing' },
    { value: '1001', label: '未通过审批', color: 'warning' },
  ],
  // HOBY库存单据类型
  warehouseBillCateStatus: [
    { value: '0', label: '未知', color: 'default' },
    { value: '1', label: '入库单', color: 'success' },
    { value: '2', label: '出库单', color: 'processing' },
    { value: '3', label: '调拨单', color: 'success' },
    { value: '4', label: '订单配货单', color: 'processing' },
    { value: '20', label: '仓储购物车', color: 'default' },
  ],
  // HOBY库存单据状态
  warehouseBillStatus: [
    { value: '0', label: '待审核', color: 'success' },
    { value: '11', label: '待入库', color: 'success' },
    { value: '12', label: '已入库', color: 'processing' },
    { value: '21', label: '待出库', color: 'processing' },
    { value: '22', label: '已出库', color: 'default' },
  ],
  // 地址类型
  地址类型: [
    { value: '0', label: '未知', color: 'default' },
    { value: '1', label: '家庭', color: 'processing' },
    { value: '2', label: '单位', color: 'processing' },
    { value: '20', label: '仓库', color: 'processing' },
    { value: '1001', label: '宿舍', color: 'processing' },
    { value: '1002', label: '教室', color: 'processing' },
    { value: '1003', label: '操场', color: 'processing' },
    { value: '2003', label: '经营场所', color: 'processing' },
  ],
  // 证件类型
  证件类型: [
    { value: '0', label: '身份证', color: 'default' },
    { value: '1', label: '护照', color: 'default' },
    { value: '2', label: '户口簿', color: 'default' },
    { value: '3', label: '军官证', color: 'default' },
    { value: '4', label: '士兵证', color: 'default' },
    { value: '5', label: '警官证', color: 'default' },
    { value: '6', label: '台胞证', color: 'default' },
    { value: '7', label: '回乡证', color: 'default' },
    { value: '8', label: 'USBKEY', color: 'default' },
    { value: '9', label: '数字证书', color: 'default' },
    { value: '10', label: '指纹', color: 'default' },
    { value: '11', label: '人脸识别数据', color: 'default' },
    { value: '12', label: '军人身份证件', color: 'default' },
    { value: '13', label: '武装警察身份证件', color: 'default' },
    { value: '14', label: '授权密钥', color: 'default' },
    { value: '26', label: '邮箱', color: 'default' },
    { value: '27', label: '手机', color: 'default' },
    { value: '28', label: '应用系统会员', color: 'default' },
    { value: '29', label: '应用系统操作员', color: 'default' },
    { value: '30', label: '微信openID', color: 'default' },
    { value: '99', label: '其他', color: 'default' },
  ],
  // 会员状态
  会员状态: [
    { value: '0', label: '作废', color: 'error' },
    { value: '101002', label: '注册', color: 'processing' },
    { value: '101006', label: '拒绝启用', color: 'warning' },
    { value: '102002', label: '注销', color: 'default' },
    { value: '104002', label: '锁住', color: 'error' },
    { value: '105002', label: '活动', color: 'success' },
  ],
  // 登录状态
  登录状态: [
    { value: '0', label: '未登录', color: 'default' },
    { value: '1', label: '已登录', color: 'success' },
  ],
};
