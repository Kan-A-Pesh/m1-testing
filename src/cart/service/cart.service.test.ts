import { CartService } from './cart.service';
import { CartStorage } from '../../storage/cart-storage';
import { ProductService } from '../../product/service/product.service';
import { ProductStorage } from '../../storage/product-storage';
import { Product } from '../../product';

describe('CartService', () => {
  let cartService: CartService;
  let cartStorage: CartStorage;
  let productService: ProductService;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    cartStorage = new CartStorage();
    const productStorage = new ProductStorage();
    productService = new ProductService(productStorage);
    cartService = new CartService(cartStorage, productService);

    product1 = { id: 'p1', name: 'Laptop', price: 50 };
    product2 = { id: 'p2', name: 'Mouse', price: 25 };

    productService.addProduct(product1);
    productService.addProduct(product2);
  });

  describe('Getting cart', () => {
    it('should return existing cart', () => {
      const cart = cartStorage.getOrCreate('cart-1');
      cart.addProduct(product1, 2);

      const retrievedCart = cartService.getCart('cart-1');

      expect(retrievedCart).toBeDefined();
      expect(retrievedCart?.id).toBe('cart-1');
      expect(retrievedCart?.getItems()).toHaveLength(1);
    });

    it('should return undefined for non-existent cart', () => {
      const cart = cartService.getCart('non-existent');

      expect(cart).toBeUndefined();
    });
  });

  describe('Getting or creating cart', () => {
    it('should return existing cart if it exists', () => {
      const cart1 = cartService.getOrCreateCart('cart-1');
      const cart2 = cartService.getOrCreateCart('cart-1');

      expect(cart1).toBe(cart2);
      expect(cart1.id).toBe('cart-1');
    });

    it('should create new cart if it does not exist', () => {
      const cart = cartService.getOrCreateCart('new-cart');

      expect(cart).toBeDefined();
      expect(cart.id).toBe('new-cart');
      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('Adding product to cart', () => {
    it('should add product to cart successfully', () => {
      const result = cartService.addProductToCart('cart-1', 'p1', 2);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const cart = cartStorage.get('cart-1');
      expect(cart?.getItems()).toHaveLength(1);
      expect(cart?.getItems()[0].quantity).toBe(2);
    });

    it('should return error when product does not exist', () => {
      const result = cartService.addProductToCart('cart-1', 'non-existent', 2);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
      // Cart should not be created if product doesn't exist
      expect(cartStorage.exists('cart-1')).toBe(false);
    });

    it('should return error when quantity is negative', () => {
      const result = cartService.addProductToCart('cart-1', 'p1', -1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Quantity must be positive');
    });

    it('should create cart if it does not exist', () => {
      const result = cartService.addProductToCart('new-cart', 'p1', 1);

      expect(result.success).toBe(true);
      expect(cartStorage.exists('new-cart')).toBe(true);
    });
  });

  describe('Updating cart item quantity', () => {
    beforeEach(() => {
      cartService.addProductToCart('cart-1', 'p1', 2);
    });

    it('should update item quantity successfully', () => {
      const result = cartService.updateCartItemQuantity('cart-1', 'p1', 5);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const cart = cartStorage.get('cart-1');
      expect(cart?.getItem('p1')?.quantity).toBe(5);
    });

    it('should return error when cart does not exist', () => {
      const result = cartService.updateCartItemQuantity('non-existent', 'p1', 5);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart not found');
    });

    it('should return error when item does not exist in cart', () => {
      const result = cartService.updateCartItemQuantity('cart-1', 'p2', 5);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Product not found in cart');
    });

    it('should return error when quantity is negative', () => {
      const result = cartService.updateCartItemQuantity('cart-1', 'p1', -1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Quantity must be non-negative');
    });

    it('should remove item when quantity is set to zero', () => {
      const result = cartService.updateCartItemQuantity('cart-1', 'p1', 0);

      expect(result.success).toBe(true);

      const cart = cartStorage.get('cart-1');
      expect(cart?.getItems()).toHaveLength(0);
    });
  });

  describe('Removing product from cart', () => {
    beforeEach(() => {
      cartService.addProductToCart('cart-1', 'p1', 2);
      cartService.addProductToCart('cart-1', 'p2', 1);
    });

    it('should remove product from cart successfully', () => {
      const result = cartService.removeProductFromCart('cart-1', 'p1');

      expect(result.success).toBe(true);

      const cart = cartStorage.get('cart-1');
      expect(cart?.getItems()).toHaveLength(1);
      expect(cart?.getItem('p1')).toBeUndefined();
    });

    it('should return error when cart does not exist', () => {
      const result = cartService.removeProductFromCart('non-existent', 'p1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart not found');
    });

    it('should succeed even when product does not exist in cart', () => {
      const result = cartService.removeProductFromCart('cart-1', 'non-existent');

      expect(result.success).toBe(true);
    });
  });

  describe('Getting cart item', () => {
    beforeEach(() => {
      cartService.addProductToCart('cart-1', 'p1', 3);
    });

    it('should return cart item when it exists', () => {
      const item = cartService.getCartItem('cart-1', 'p1');

      expect(item).toBeDefined();
      expect(item?.product).toEqual(product1);
      expect(item?.quantity).toBe(3);
    });

    it('should return undefined when cart does not exist', () => {
      const item = cartService.getCartItem('non-existent', 'p1');

      expect(item).toBeUndefined();
    });

    it('should return undefined when item does not exist in cart', () => {
      const item = cartService.getCartItem('cart-1', 'p2');

      expect(item).toBeUndefined();
    });
  });

  describe('Clearing cart', () => {
    beforeEach(() => {
      cartService.addProductToCart('cart-1', 'p1', 2);
      cartService.addProductToCart('cart-1', 'p2', 1);
    });

    it('should clear all items from cart', () => {
      const result = cartService.clearCart('cart-1');

      expect(result.success).toBe(true);

      const cart = cartStorage.get('cart-1');
      expect(cart?.getItems()).toHaveLength(0);
    });

    it('should return error when cart does not exist', () => {
      const result = cartService.clearCart('non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart not found');
    });
  });

  describe('Calculating cart total', () => {
    it('should calculate total without discount', () => {
      cartService.addProductToCart('cart-1', 'p1', 1); // 50
      cartService.addProductToCart('cart-1', 'p2', 1); // 25

      const total = cartService.calculateCartTotal('cart-1');

      expect(total).toBeDefined();
      expect(total?.preTotal).toBe(75);
      expect(total?.discount).toBe(0);
      expect(total?.total).toBe(75);
    });

    it('should calculate total with discount when over 100', () => {
      cartService.addProductToCart('cart-1', 'p1', 3); // 150

      const total = cartService.calculateCartTotal('cart-1');

      expect(total).toBeDefined();
      expect(total?.preTotal).toBe(150);
      expect(total?.discount).toBe(15);
      expect(total?.total).toBe(135);
    });

    it('should return undefined when cart does not exist', () => {
      const total = cartService.calculateCartTotal('non-existent');

      expect(total).toBeUndefined();
    });
  });
});
