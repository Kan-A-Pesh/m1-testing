import { Cart } from './cart';
import { Product } from '../product';

describe('Cart', () => {
  let cart: Cart;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    cart = new Cart('cart-1');
    product1 = { id: 'p1', name: 'Laptop', price: 50 };
    product2 = { id: 'p2', name: 'Mouse', price: 25 };
  });

  describe('Cart creation', () => {
    it('should create a cart with an id', () => {
      expect(cart.id).toBe('cart-1');
    });

    it('should create an empty cart', () => {
      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('Adding products', () => {
    it('should add a product to the cart', () => {
      cart.addProduct(product1, 1);

      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].product).toEqual(product1);
      expect(items[0].quantity).toBe(1);
    });

    it('should add multiple different products to the cart', () => {
      cart.addProduct(product1, 2);
      cart.addProduct(product2, 1);

      const items = cart.getItems();
      expect(items).toHaveLength(2);
      expect(items[0].product).toEqual(product1);
      expect(items[0].quantity).toBe(2);
      expect(items[1].product).toEqual(product2);
      expect(items[1].quantity).toBe(1);
    });

    it('should increment quantity when adding the same product twice', () => {
      cart.addProduct(product1, 2);
      cart.addProduct(product1, 3);

      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it('should handle adding product with quantity zero', () => {
      cart.addProduct(product1, 0);

      const items = cart.getItems();
      expect(items).toHaveLength(0);
    });

    it('should not add product with negative quantity', () => {
      expect(() => cart.addProduct(product1, -1)).toThrow('Quantity must be positive');
    });
  });

  describe('Removing products', () => {
    beforeEach(() => {
      cart.addProduct(product1, 3);
      cart.addProduct(product2, 2);
    });

    it('should remove a product completely from the cart', () => {
      cart.removeProduct('p1');

      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('p2');
    });

    it('should do nothing when removing non-existent product', () => {
      cart.removeProduct('non-existent');

      const items = cart.getItems();
      expect(items).toHaveLength(2);
    });
  });

  describe('Updating product quantity', () => {
    beforeEach(() => {
      cart.addProduct(product1, 3);
    });

    it('should update quantity of existing product', () => {
      cart.updateQuantity('p1', 5);

      const items = cart.getItems();
      expect(items[0].quantity).toBe(5);
    });

    it('should remove product when quantity set to zero', () => {
      cart.updateQuantity('p1', 0);

      const items = cart.getItems();
      expect(items).toHaveLength(0);
    });

    it('should throw error when updating with negative quantity', () => {
      expect(() => cart.updateQuantity('p1', -1)).toThrow('Quantity must be non-negative');
    });

    it('should throw error when updating non-existent product', () => {
      expect(() => cart.updateQuantity('non-existent', 5)).toThrow('Product not found in cart');
    });
  });

  describe('Getting specific item', () => {
    beforeEach(() => {
      cart.addProduct(product1, 3);
      cart.addProduct(product2, 2);
    });

    it('should return specific cart item by product id', () => {
      const item = cart.getItem('p1');

      expect(item).toBeDefined();
      expect(item?.product).toEqual(product1);
      expect(item?.quantity).toBe(3);
    });

    it('should return undefined for non-existent product', () => {
      const item = cart.getItem('non-existent');

      expect(item).toBeUndefined();
    });
  });

  describe('Clearing cart', () => {
    it('should remove all items from cart', () => {
      cart.addProduct(product1, 3);
      cart.addProduct(product2, 2);

      cart.clear();

      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('Calculating total', () => {
    it('should calculate total without discount when total is under 100', () => {
      cart.addProduct(product1, 1); // 50
      cart.addProduct(product2, 1); // 25

      const total = cart.calculateTotal();

      expect(total.preTotal).toBe(75);
      expect(total.discount).toBe(0);
      expect(total.total).toBe(75);
    });

    it('should apply 10% discount when total exceeds 100', () => {
      cart.addProduct(product1, 3); // 150

      const total = cart.calculateTotal();

      expect(total.preTotal).toBe(150);
      expect(total.discount).toBe(15); // 10% of 150
      expect(total.total).toBe(135);
    });

    it('should apply 10% discount when total equals 100.01', () => {
      const expensiveProduct: Product = { id: 'p3', name: 'Expensive', price: 100.01 };
      cart.addProduct(expensiveProduct, 1);

      const total = cart.calculateTotal();

      expect(total.preTotal).toBe(100.01);
      expect(total.discount).toBeCloseTo(10.001, 2);
      expect(total.total).toBeCloseTo(90.009, 2);
    });

    it('should not apply discount when total is exactly 100', () => {
      const product: Product = { id: 'p3', name: 'Product', price: 100 };
      cart.addProduct(product, 1);

      const total = cart.calculateTotal();

      expect(total.preTotal).toBe(100);
      expect(total.discount).toBe(0);
      expect(total.total).toBe(100);
    });

    it('should return zero total for empty cart', () => {
      const total = cart.calculateTotal();

      expect(total.preTotal).toBe(0);
      expect(total.discount).toBe(0);
      expect(total.total).toBe(0);
    });
  });
});

