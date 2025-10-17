import request from 'supertest';
import express, { Express } from 'express';
import { getCartTotalRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('GET /carts/:cartId/total', () => {
  let app: Express;
  let cartService: CartService;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const cartStorage = new CartStorage();
    const productStorage = new ProductStorage();
    const productService = new ProductService(productStorage);
    cartService = new CartService(cartStorage, productService);

    productService.addProduct({ id: 'p1', name: 'Laptop', price: 50 });
    productService.addProduct({ id: 'p2', name: 'Mouse', price: 60 });

    app.get('/carts/:cartId/total', getCartTotalRoute(cartService));
  });

  it('should return total without discount when under 100', async () => {
    cartService.addProductToCart('cart-1', 'p1', 1); // 50

    const response = await request(app).get('/carts/cart-1/total');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      preTotal: 50,
      discount: 0,
      total: 50,
    });
  });

  it('should return total with 10% discount when over 100', async () => {
    cartService.addProductToCart('cart-1', 'p1', 3); // 150

    const response = await request(app).get('/carts/cart-1/total');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      preTotal: 150,
      discount: 15,
      total: 135,
    });
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app).get('/carts/non-existent/total');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cart not found' });
  });

  it('should return zero total for empty cart', async () => {
    cartService.getOrCreateCart('empty-cart');

    const response = await request(app).get('/carts/empty-cart/total');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      preTotal: 0,
      discount: 0,
      total: 0,
    });
  });
});
