export type Mode = 'auto' | 'drawer' | 'modal' | 'use';
export interface FormConfig {
  [key: string]: any;
  mode: Mode;
  layout: 'horizontal' | 'vertical';
}

export interface SchemaItem {
  [key: string]: any;
}
