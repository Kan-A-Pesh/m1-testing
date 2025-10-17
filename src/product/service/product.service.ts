import { Product } from '../product';
import { ProductStorage } from '../../storage/product-storage';

export class ProductService {
  constructor(private storage: ProductStorage) {}

  getAllProducts(): Product[] {
    return this.storage.getAll();
  }

  getProductById(id: string): Product | undefined {
    return this.storage.get(id);
  }

  addProduct(product: Product): void {
    this.storage.add(product);
  }

  productExists(id: string): boolean {
    return this.storage.exists(id);
  }
}
