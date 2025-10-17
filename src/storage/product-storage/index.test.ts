import { ProductStorage } from './index';
import { Product } from '../../product';

describe('ProductStorage', () => {
  let storage: ProductStorage;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    storage = new ProductStorage();
    product1 = { id: 'p1', name: 'Laptop', price: 999 };
    product2 = { id: 'p2', name: 'Mouse', price: 25 };
  });

  describe('Adding products', () => {
    it('should add a product to storage', () => {
      storage.add(product1);

      const retrieved = storage.get('p1');
      expect(retrieved).toEqual(product1);
    });

    it('should add multiple products to storage', () => {
      storage.add(product1);
      storage.add(product2);

      expect(storage.getAll()).toHaveLength(2);
    });

    it('should update existing product when adding with same id', () => {
      storage.add(product1);
      const updatedProduct = { id: 'p1', name: 'Updated Laptop', price: 1299 };
      storage.add(updatedProduct);

      const retrieved = storage.get('p1');
      expect(retrieved).toEqual(updatedProduct);
      expect(storage.getAll()).toHaveLength(1);
    });
  });

  describe('Getting products', () => {
    beforeEach(() => {
      storage.add(product1);
      storage.add(product2);
    });

    it('should get a product by id', () => {
      const product = storage.get('p1');

      expect(product).toEqual(product1);
    });

    it('should return undefined for non-existent product', () => {
      const product = storage.get('non-existent');

      expect(product).toBeUndefined();
    });

    it('should get all products', () => {
      const products = storage.getAll();

      expect(products).toHaveLength(2);
      expect(products).toContainEqual(product1);
      expect(products).toContainEqual(product2);
    });

    it('should return empty array when no products exist', () => {
      const emptyStorage = new ProductStorage();

      expect(emptyStorage.getAll()).toEqual([]);
    });
  });

  describe('Removing products', () => {
    beforeEach(() => {
      storage.add(product1);
      storage.add(product2);
    });

    it('should remove a product by id', () => {
      const removed = storage.remove('p1');

      expect(removed).toBe(true);
      expect(storage.get('p1')).toBeUndefined();
      expect(storage.getAll()).toHaveLength(1);
    });

    it('should return false when removing non-existent product', () => {
      const removed = storage.remove('non-existent');

      expect(removed).toBe(false);
      expect(storage.getAll()).toHaveLength(2);
    });
  });

  describe('Checking existence', () => {
    beforeEach(() => {
      storage.add(product1);
    });

    it('should return true for existing product', () => {
      expect(storage.exists('p1')).toBe(true);
    });

    it('should return false for non-existent product', () => {
      expect(storage.exists('non-existent')).toBe(false);
    });
  });

  describe('Clearing storage', () => {
    it('should remove all products', () => {
      storage.add(product1);
      storage.add(product2);

      storage.clear();

      expect(storage.getAll()).toEqual([]);
    });
  });

  describe('Initializing with seed data', () => {
    it('should initialize with provided products', () => {
      const seedProducts = [product1, product2];
      const seededStorage = new ProductStorage(seedProducts);

      expect(seededStorage.getAll()).toHaveLength(2);
      expect(seededStorage.get('p1')).toEqual(product1);
      expect(seededStorage.get('p2')).toEqual(product2);
    });

    it('should initialize empty when no seed data provided', () => {
      const emptyStorage = new ProductStorage();

      expect(emptyStorage.getAll()).toEqual([]);
    });
  });
});
