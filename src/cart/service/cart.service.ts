import { Cart } from '../cart';
import { CartStorage } from '../../storage/cart-storage';
import { ProductService } from '../../product/service/product.service';
import { CartItem, CartTotal } from '../../types';

export interface ServiceResult {
  success: boolean;
  error?: string;
}

export class CartService {
  constructor(
    private cartStorage: CartStorage,
    private productService: ProductService
  ) {}

  getCart(cartId: string): Cart | undefined {
    return this.cartStorage.get(cartId);
  }

  getOrCreateCart(cartId: string): Cart {
    return this.cartStorage.getOrCreate(cartId);
  }

  addProductToCart(
    cartId: string,
    productId: string,
    quantity: number
  ): ServiceResult {
    const product = this.productService.getProductById(productId);

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    try {
      const cart = this.cartStorage.getOrCreate(cartId);
      cart.addProduct(product, quantity);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  updateCartItemQuantity(
    cartId: string,
    productId: string,
    quantity: number
  ): ServiceResult {
    const cart = this.cartStorage.get(cartId);

    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    try {
      cart.updateQuantity(productId, quantity);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  removeProductFromCart(cartId: string, productId: string): ServiceResult {
    const cart = this.cartStorage.get(cartId);

    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    cart.removeProduct(productId);
    return { success: true };
  }

  getCartItem(cartId: string, productId: string): CartItem | undefined {
    const cart = this.cartStorage.get(cartId);

    if (!cart) {
      return undefined;
    }

    return cart.getItem(productId);
  }

  clearCart(cartId: string): ServiceResult {
    const cart = this.cartStorage.get(cartId);

    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    cart.clear();
    return { success: true };
  }

  calculateCartTotal(cartId: string): CartTotal | undefined {
    const cart = this.cartStorage.get(cartId);

    if (!cart) {
      return undefined;
    }

    return cart.calculateTotal();
  }
}
