import request from 'supertest';
import express, { Express } from 'express';
import { getCartItemRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('GET /carts/:cartId/items/:itemId', () => {
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

    app.get('/carts/:cartId/items/:itemId', getCartItemRoute(cartService));
  });

  it('should return cart item when it exists', async () => {
    cartService.addProductToCart('cart-1', 'p1', 3);

    const response = await request(app).get('/carts/cart-1/items/p1');

    expect(response.status).toBe(200);
    expect(response.body.item).toBeDefined();
    expect(response.body.item.product.id).toBe('p1');
    expect(response.body.item.quantity).toBe(3);
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app).get('/carts/non-existent/items/p1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });

  it('should return 404 when item does not exist in cart', async () => {
    cartService.getOrCreateCart('cart-1');

    const response = await request(app).get('/carts/cart-1/items/p1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });
});
