interface ProductDetail {
  name: string;
  image: string;
  specs: string[];
  brand: string;
  category: string;
  purchaseUnit: string;
  manufacturer: string;
  model: string;
  sku: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  requiredQuantity: number;
  orderNo: string;
  product: string;
  restockingNum: number;
  restockingNumStill: number;
  record: any;
}
interface SourceItem {
  id: string;
  store: string;
  price: number;
  stock: number;
  warehouse: string;
  restockingNum?: number;
  restockingNumStill?: number;
}

export type { ProductDetail, SourceItem };
