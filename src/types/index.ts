import { Product } from '../product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTotal {
  preTotal: number;
  discount: number;
  total: number;
}
