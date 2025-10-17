import request from 'supertest';
import express, { Express } from 'express';
import { patchCartRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('PATCH /carts/:cartId', () => {
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

    app.patch('/carts/:cartId', patchCartRoute(cartService));
  });

  it('should add product to cart successfully', async () => {
    const response = await request(app)
      .patch('/carts/cart-1')
      .send({ productId: 'p1', quantity: 2 });

    expect(response.status).toBe(200);

    const cart = cartService.getCart('cart-1');
    expect(cart?.getItems()).toHaveLength(1);
    expect(cart?.getItems()[0].quantity).toBe(2);
  });

  it('should return 400 when productId is missing', async () => {
    const response = await request(app)
      .patch('/carts/cart-1')
      .send({ quantity: 2 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'productId and quantity are required' });
  });

  it('should return 400 when quantity is missing', async () => {
    const response = await request(app)
      .patch('/carts/cart-1')
      .send({ productId: 'p1' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'productId and quantity are required' });
  });

  it('should return 404 when product does not exist', async () => {
    const response = await request(app)
      .patch('/carts/cart-1')
      .send({ productId: 'non-existent', quantity: 1 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Product not found');
  });

  it('should return 400 when quantity is negative', async () => {
    const response = await request(app)
      .patch('/carts/cart-1')
      .send({ productId: 'p1', quantity: -1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Quantity must be positive');
  });
});
