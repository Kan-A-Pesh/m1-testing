import request from 'supertest';
import express, { Express } from 'express';
import { patchCartItemRoute } from './index';
import { CartService } from '../../service/cart.service';
import { CartStorage } from '../../../storage/cart-storage';
import { ProductService } from '../../../product/service/product.service';
import { ProductStorage } from '../../../storage/product-storage';

describe('PATCH /carts/:cartId/items/:itemId', () => {
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

    app.patch('/carts/:cartId/items/:itemId', patchCartItemRoute(cartService));
  });

  it('should update item quantity successfully', async () => {
    cartService.addProductToCart('cart-1', 'p1', 2);

    const response = await request(app)
      .patch('/carts/cart-1/items/p1')
      .send({ quantity: 5 });

    expect(response.status).toBe(200);

    const cart = cartService.getCart('cart-1');
    expect(cart?.getItem('p1')?.quantity).toBe(5);
  });

  it('should return 400 when quantity is missing', async () => {
    const response = await request(app)
      .patch('/carts/cart-1/items/p1')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'quantity is required' });
  });

  it('should return 404 when cart does not exist', async () => {
    const response = await request(app)
      .patch('/carts/non-existent/items/p1')
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Cart not found');
  });

  it('should return 400 when quantity is negative', async () => {
    cartService.addProductToCart('cart-1', 'p1', 2);

    const response = await request(app)
      .patch('/carts/cart-1/items/p1')
      .send({ quantity: -1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Quantity must be non-negative');
  });

  it('should remove item when quantity is set to zero', async () => {
    cartService.addProductToCart('cart-1', 'p1', 2);

    const response = await request(app)
      .patch('/carts/cart-1/items/p1')
      .send({ quantity: 0 });

    expect(response.status).toBe(200);

    const cart = cartService.getCart('cart-1');
    expect(cart?.getItems()).toHaveLength(0);
  });
});
