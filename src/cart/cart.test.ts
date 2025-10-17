import { Cart } from './cart';
import { Product } from '../product';

describe('Cart', () => {
  describe('Adding products', () => {
    it('should add a product to the cart', () => {
      const cart = new Cart('cart-1');
      const product: Product = { id: 'p1', name: 'Laptop', price: 50 };

      cart.addProduct(product, 1);

      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(1);
    });
  });
});

