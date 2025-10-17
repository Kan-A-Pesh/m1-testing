import { Product } from './product';

describe('Product', () => {
  describe('Product creation', () => {
    it('should create a valid product with id, name, and price', () => {
      const product: Product = {
        id: 'p1',
        name: 'Laptop',
        price: 999.99,
      };

      expect(product.id).toBe('p1');
      expect(product.name).toBe('Laptop');
      expect(product.price).toBe(999.99);
    });

    it('should allow products with zero price', () => {
      const product: Product = {
        id: 'p2',
        name: 'Free Sample',
        price: 0,
      };

      expect(product.price).toBe(0);
    });

    it('should allow products with decimal prices', () => {
      const product: Product = {
        id: 'p3',
        name: 'Coffee',
        price: 3.50,
      };

      expect(product.price).toBe(3.50);
    });
  });
});
