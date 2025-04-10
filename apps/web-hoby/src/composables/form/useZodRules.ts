import { z } from '#/adapter/form'; // 确保从你的适配器中导入z

/**
 * 表单验证规则类型
 */
interface RuleConfig {
  // 规则类型
  type:
    | 'array'
    | 'boolean'
    | 'custom'
    | 'date'
    | 'email'
    | 'number'
    | 'object'
    | 'string'
    | 'url';
  // 是否必填
  required?: boolean;
  // 错误信息
  message?: string;
  // 字符串最小长度
  min?: number;
  // 字符串最大长度
  max?: number;
  // 数字最小值
  minValue?: number;
  // 数字最大值
  maxValue?: number;
  // 正则表达式
  pattern?: RegExp;
  // 自定义验证函数
  validator?: (value: any) => boolean;
  // 自定义错误消息
  customMessage?: string;
}

/**
 * 创建表单验证规则
 * @param rules 规则配置数组
 * @returns zod schema
 */
export function useZodRules(rules: RuleConfig[]) {
  // 处理空规则情况
  if (!rules || rules.length === 0) {
    return z.any();
  }

  // 从第一个规则开始构建基础schema
  let schema = createBaseSchema(rules[0] as RuleConfig);

  // 应用其余规则
  for (let i = 1; i < rules.length; i++) {
    schema = applyRule(schema, rules[i] as RuleConfig);
  }

  return schema;
}

/**
 * 根据规则类型创建基础schema
 */
function createBaseSchema(rule: RuleConfig) {
  let schema;

  switch (rule.type) {
    case 'array': {
      schema = z.array(z.any());
      break;
    }
    case 'boolean': {
      schema = z.boolean();
      break;
    }
    case 'custom': {
      schema = z.any();
      break;
    }
    case 'date': {
      schema = z.date();
      break;
    }
    case 'email': {
      schema = z.string().email(rule.message || '请输入有效的电子邮箱');
      break;
    }
    case 'number': {
      schema = z.number();
      break;
    }
    case 'object': {
      schema = z.object({});
      break;
    }
    case 'string': {
      schema = z.string();
      break;
    }
    case 'url': {
      schema = z.string().url(rule.message || '请输入有效的URL');
      break;
    }
    default: {
      schema = z.any();
    }
  }

  return applyRule(schema, rule);
}

/**
 * 应用规则到schema
 */
function applyRule(schema: any, rule: RuleConfig) {
  // 处理非必填
  if (rule.required === false) {
    schema = schema.optional();
  }

  // 针对字符串类型的规则
  if (rule.type === 'string') {
    // 必填
    if (rule.required) {
      schema = schema.min(1, rule.message || '此字段不能为空');
    }

    // 最小长度
    if (rule.min !== undefined && rule.min > 1) {
      schema = schema.min(
        rule.min,
        rule.message || `长度不能少于${rule.min}个字符`,
      );
    }

    // 最大长度
    if (rule.max !== undefined) {
      schema = schema.max(
        rule.max,
        rule.message || `长度不能超过${rule.max}个字符`,
      );
    }

    // 正则表达式
    if (rule.pattern) {
      schema = schema.regex(rule.pattern, rule.message || '格式不正确');
    }
  }

  // 针对数字类型的规则
  if (rule.type === 'number') {
    // 最小值
    if (rule.minValue !== undefined) {
      schema = schema.min(
        rule.minValue,
        rule.message || `不能小于${rule.minValue}`,
      );
    }

    // 最大值
    if (rule.maxValue !== undefined) {
      schema = schema.max(
        rule.maxValue,
        rule.message || `不能大于${rule.maxValue}`,
      );
    }
  }

  // 自定义验证
  if (rule.validator) {
    schema = schema.refine(rule.validator, {
      message: rule.customMessage || rule.message || '验证失败',
    });
  }

  return schema;
}

/**
 * 快速创建必填规则
 */
export function requiredRule(message?: string) {
  return useZodRules([
    {
      type: 'string',
      required: true,
      message: message || '此字段不能为空',
    },
  ]);
}

/**
 * 快速创建邮箱验证规则
 */
export function emailRule(required = true, message?: string) {
  return useZodRules([
    {
      type: 'email',
      required,
      message: message || '请输入有效的电子邮箱',
    },
  ]);
}

/**
 * 快速创建手机号验证规则
 */
export function phoneRule(required = true, message?: string) {
  return useZodRules([
    {
      type: 'string',
      required,
      pattern: /^1[3-9]\d{9}$/,
      message: message || '请输入有效的手机号码',
    },
  ]);
}

/**
 * 快速创建URL验证规则
 */
export function urlRule(required = true, message?: string) {
  return useZodRules([
    {
      type: 'url',
      required,
      message: message || '请输入有效的URL',
    },
  ]);
}

/**
 * 快速创建身份证验证规则
 */
export function idCardRule(required = true, message?: string) {
  return useZodRules([
    {
      type: 'string',
      required,
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i,
      message: message || '请输入有效的身份证号码',
    },
  ]);
}
