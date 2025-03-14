/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-12 17:41:46
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-14 11:32:04
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\components\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
  restockingNumReady: number;
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
