import request from 'supertest';
import express, { Express } from 'express';
import { getCartRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('GET /carts/:cartId', () => {
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

    app.get('/carts/:cartId', getCartRoute(cartService));
  });

  it('should return cart with items and total', async () => {
    cartService.addProductToCart('cart-1', 'p1', 1);
    cartService.addProductToCart('cart-1', 'p2', 2);

    const response = await request(app).get('/carts/cart-1');

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    // 999 + 50 = 1049, with 10% discount = 944.1
    expect(response.body.total).toBe(944.1);
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app).get('/carts/non-existent');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cart not found' });
  });

  it('should return empty cart with zero total', async () => {
    cartService.getOrCreateCart('empty-cart');

    const response = await request(app).get('/carts/empty-cart');

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.total).toBe(0);
  });
});
