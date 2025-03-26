export type Mode = 'default' | 'drawer' | 'modal';
export interface FormConfig {
  [key: string]: any;
  mode: Mode;
  layout: 'horizontal' | 'vertical';
}

export interface SchemaItem {
  [key: string]: any;
}
