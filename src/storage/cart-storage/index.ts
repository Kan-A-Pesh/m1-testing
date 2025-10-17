import { Cart } from '../../cart';

export class CartStorage {
  private carts: Map<string, Cart>;

  constructor() {
    this.carts = new Map();
  }

  add(cart: Cart): void {
    this.carts.set(cart.id, cart);
  }

  get(id: string): Cart | undefined {
    return this.carts.get(id);
  }

  getAll(): Cart[] {
    return Array.from(this.carts.values());
  }

  getOrCreate(id: string): Cart {
    let cart = this.carts.get(id);

    if (!cart) {
      cart = new Cart(id);
      this.carts.set(id, cart);
    }

    return cart;
  }

  remove(id: string): boolean {
    return this.carts.delete(id);
  }

  exists(id: string): boolean {
    return this.carts.has(id);
  }

  clear(): void {
    this.carts.clear();
  }
}
