import request from 'supertest';
import express, { Express } from 'express';
import { deleteCartRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('DELETE /carts/:cartId', () => {
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

    app.delete('/carts/:cartId', deleteCartRoute(cartService));
  });

  it('should clear cart successfully', async () => {
    cartService.addProductToCart('cart-1', 'p1', 2);

    const response = await request(app).delete('/carts/cart-1');

    expect(response.status).toBe(204);

    const cart = cartService.getCart('cart-1');
    expect(cart?.getItems()).toHaveLength(0);
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app).delete('/carts/non-existent');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cart not found' });
  });

  it('should return 204 for already empty cart', async () => {
    cartService.getOrCreateCart('empty-cart');

    const response = await request(app).delete('/carts/empty-cart');

    expect(response.status).toBe(204);
  });
});
