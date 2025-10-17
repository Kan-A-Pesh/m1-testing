import { ProductService } from './product.service';
import { ProductStorage } from '../../storage/product-storage';
import { Product } from '../product';

describe('ProductService', () => {
  let service: ProductService;
  let storage: ProductStorage;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    storage = new ProductStorage();
    service = new ProductService(storage);
    product1 = { id: 'p1', name: 'Laptop', price: 999 };
    product2 = { id: 'p2', name: 'Mouse', price: 25 };
  });

  describe('Getting all products', () => {
    it('should return all products from storage', () => {
      storage.add(product1);
      storage.add(product2);

      const products = service.getAllProducts();

      expect(products).toHaveLength(2);
      expect(products).toContainEqual(product1);
      expect(products).toContainEqual(product2);
    });

    it('should return empty array when no products exist', () => {
      const products = service.getAllProducts();

      expect(products).toEqual([]);
    });
  });

  describe('Getting product by id', () => {
    beforeEach(() => {
      storage.add(product1);
    });

    it('should return product when it exists', () => {
      const product = service.getProductById('p1');

      expect(product).toEqual(product1);
    });

    it('should return undefined when product does not exist', () => {
      const product = service.getProductById('non-existent');

      expect(product).toBeUndefined();
    });
  });

  describe('Adding products', () => {
    it('should add a new product to storage', () => {
      service.addProduct(product1);

      const products = storage.getAll();
      expect(products).toHaveLength(1);
      expect(products[0]).toEqual(product1);
    });

    it('should add multiple products', () => {
      service.addProduct(product1);
      service.addProduct(product2);

      expect(storage.getAll()).toHaveLength(2);
    });
  });

  describe('Product existence check', () => {
    beforeEach(() => {
      storage.add(product1);
    });

    it('should return true when product exists', () => {
      expect(service.productExists('p1')).toBe(true);
    });

    it('should return false when product does not exist', () => {
      expect(service.productExists('non-existent')).toBe(false);
    });
  });
});
