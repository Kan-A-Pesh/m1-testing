import { CartStorage } from './index';
import { Cart } from '../../cart';

describe('CartStorage', () => {
  let storage: CartStorage;
  let cart1: Cart;
  let cart2: Cart;

  beforeEach(() => {
    storage = new CartStorage();
    cart1 = new Cart('cart-1');
    cart2 = new Cart('cart-2');
  });

  describe('Adding carts', () => {
    it('should add a cart to storage', () => {
      storage.add(cart1);

      const retrieved = storage.get('cart-1');
      expect(retrieved).toEqual(cart1);
    });

    it('should add multiple carts to storage', () => {
      storage.add(cart1);
      storage.add(cart2);

      expect(storage.getAll()).toHaveLength(2);
    });

    it('should update existing cart when adding with same id', () => {
      storage.add(cart1);
      cart1.addProduct({ id: 'p1', name: 'Product', price: 50 }, 1);
      storage.add(cart1);

      const retrieved = storage.get('cart-1');
      expect(retrieved?.getItems()).toHaveLength(1);
      expect(storage.getAll()).toHaveLength(1);
    });
  });

  describe('Getting carts', () => {
    beforeEach(() => {
      storage.add(cart1);
      storage.add(cart2);
    });

    it('should get a cart by id', () => {
      const cart = storage.get('cart-1');

      expect(cart).toEqual(cart1);
      expect(cart?.id).toBe('cart-1');
    });

    it('should return undefined for non-existent cart', () => {
      const cart = storage.get('non-existent');

      expect(cart).toBeUndefined();
    });

    it('should get all carts', () => {
      const carts = storage.getAll();

      expect(carts).toHaveLength(2);
      expect(carts).toContainEqual(cart1);
      expect(carts).toContainEqual(cart2);
    });

    it('should return empty array when no carts exist', () => {
      const emptyStorage = new CartStorage();

      expect(emptyStorage.getAll()).toEqual([]);
    });
  });

  describe('Getting or creating cart', () => {
    it('should return existing cart if it exists', () => {
      storage.add(cart1);

      const cart = storage.getOrCreate('cart-1');

      expect(cart).toEqual(cart1);
      expect(storage.getAll()).toHaveLength(1);
    });

    it('should create new cart if it does not exist', () => {
      const cart = storage.getOrCreate('new-cart');

      expect(cart).toBeDefined();
      expect(cart.id).toBe('new-cart');
      expect(storage.getAll()).toHaveLength(1);
    });

    it('should create and store new cart for future retrieval', () => {
      const cart1 = storage.getOrCreate('new-cart');
      const cart2 = storage.getOrCreate('new-cart');

      expect(cart1).toBe(cart2);
      expect(storage.getAll()).toHaveLength(1);
    });
  });

  describe('Removing carts', () => {
    beforeEach(() => {
      storage.add(cart1);
      storage.add(cart2);
    });

    it('should remove a cart by id', () => {
      const removed = storage.remove('cart-1');

      expect(removed).toBe(true);
      expect(storage.get('cart-1')).toBeUndefined();
      expect(storage.getAll()).toHaveLength(1);
    });

    it('should return false when removing non-existent cart', () => {
      const removed = storage.remove('non-existent');

      expect(removed).toBe(false);
      expect(storage.getAll()).toHaveLength(2);
    });
  });

  describe('Checking existence', () => {
    beforeEach(() => {
      storage.add(cart1);
    });

    it('should return true for existing cart', () => {
      expect(storage.exists('cart-1')).toBe(true);
    });

    it('should return false for non-existent cart', () => {
      expect(storage.exists('non-existent')).toBe(false);
    });
  });

  describe('Clearing storage', () => {
    it('should remove all carts', () => {
      storage.add(cart1);
      storage.add(cart2);

      storage.clear();

      expect(storage.getAll()).toEqual([]);
    });
  });
});
