import { Product } from '../product';
import { CartItem, CartTotal } from '../types';

export class Cart {
  public readonly id: string;
  private items: Map<string, CartItem>;

  constructor(id: string) {
    this.id = id;
    this.items = new Map();
  }

  addProduct(product: Product, quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity must be positive');
    }

    if (quantity === 0) {
      return;
    }

    const existingItem = this.items.get(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.set(product.id, { product, quantity });
    }
  }

  removeProduct(productId: string): void {
    this.items.delete(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }

    const item = this.items.get(productId);

    if (!item) {
      throw new Error('Product not found in cart');
    }

    if (quantity === 0) {
      this.items.delete(productId);
    } else {
      item.quantity = quantity;
    }
  }

  getItem(productId: string): CartItem | undefined {
    return this.items.get(productId);
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  clear(): void {
    this.items.clear();
  }

  calculateTotal(): CartTotal {
    const preTotal = this.getItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const discount = preTotal > 100 ? preTotal * 0.1 : 0;
    const total = preTotal - discount;

    return {
      preTotal,
      discount,
      total,
    };
  }
}
