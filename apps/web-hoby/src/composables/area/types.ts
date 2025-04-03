// types/area.ts
export interface AreaNode {
  code: string;
  name: string;
  children?: AreaNode[];
}

export type AreaData = AreaNode[];

export type AreaLevel = 'city' | 'district' | 'province';

export interface GetAreaListParams {
  condition?: string;
  province?: string;
  city?: string;
}
