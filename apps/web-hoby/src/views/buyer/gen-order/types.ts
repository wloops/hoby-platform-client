export type Platform = {
  id: string;
  name: string;
};

export type Product = {
  name: string;
  price: number;
  quantity: number;
  sku: string;
};

export type Customer = {
  address: string;
  email: string;
  name: string;
  phone: string;
};

export type Payment = {
  method: string;
  paymentTime: string;
  status: string;
  transactionId: string;
};

export type Amount = {
  discount: number;
  shippingFee: number;
  subtotal: string;
  tax: number;
  total: string;
};

export type OrderForm = {
  amount: Amount;
  customer: Customer;
  notes: string;
  orderNumber: string;
  orderTime: string;
  payment: Payment;
  platform: string;
  products: Product[];
  status: string;
};

export type RecentOrder = {
  amount: number;
  createdAt: string;
  customer: string;
  orderNumber: string;
  platform: string;
  status: string;
};

export type ProductCatalog = {
  name: string;
  price: number;
  sku: string;
};
