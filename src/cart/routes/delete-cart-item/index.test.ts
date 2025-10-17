import request from 'supertest';
import express, { Express } from 'express';
import { deleteCartItemRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('DELETE /carts/:cartId/items/:itemId', () => {
  let app: Express;
  let cartService: CartService;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const cartStorage = new CartStorage();
    const productStorage = new ProductStorage();
    const productService = new ProductService(productStorage);
    cartService = new CartService(cartStorage, productService);

    productService.addProduct({ id: 'p1', name: 'Laptop', price: 999 });
    productService.addProduct({ id: 'p2', name: 'Mouse', price: 25 });

    app.delete('/carts/:cartId/items/:itemId', deleteCartItemRoute(cartService));
  });

  it('should remove item from cart successfully', async () => {
    cartService.addProductToCart('cart-1', 'p1', 2);
    cartService.addProductToCart('cart-1', 'p2', 1);

    const response = await request(app).delete('/carts/cart-1/items/p1');

    expect(response.status).toBe(204);

    const cart = cartService.getCart('cart-1');
    expect(cart?.getItems()).toHaveLength(1);
    expect(cart?.getItem('p1')).toBeUndefined();
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app).delete('/carts/non-existent/items/p1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cart not found' });
  });

  it('should return 204 even when item does not exist in cart', async () => {
    cartService.getOrCreateCart('cart-1');

    const response = await request(app).delete('/carts/cart-1/items/p1');

    expect(response.status).toBe(204);
  });
});
