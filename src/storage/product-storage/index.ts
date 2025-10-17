import { Product } from '../../product';

export class ProductStorage {
  private products: Map<string, Product>;

  constructor(seedProducts: Product[] = []) {
    this.products = new Map();
    seedProducts.forEach((product) => this.add(product));
  }

  add(product: Product): void {
    this.products.set(product.id, product);
  }

  get(id: string): Product | undefined {
    return this.products.get(id);
  }

  getAll(): Product[] {
    return Array.from(this.products.values());
  }

  remove(id: string): boolean {
    return this.products.delete(id);
  }

  exists(id: string): boolean {
    return this.products.has(id);
  }

  clear(): void {
    this.products.clear();
  }
}
