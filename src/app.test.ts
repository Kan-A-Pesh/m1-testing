import request from 'supertest';
import { createApp } from './app';

describe('E2E Integration Tests', () => {
  const app = createApp();

  describe('Complete shopping flow', () => {
    it('should support full cart workflow: view products, add to cart, update, calculate total, and clear', async () => {
      // 1. Get all products
      const productsResponse = await request(app).get('/products');
      expect(productsResponse.status).toBe(200);
      expect(productsResponse.body.products.length).toBeGreaterThan(0);

      const laptopId = productsResponse.body.products[0].id;

      // 2. Add products to cart
      const addResponse1 = await request(app)
        .patch('/carts/test-cart')
        .send({ productId: laptopId, quantity: 1 });
      expect(addResponse1.status).toBe(200);

      // 3. Get cart
      const cartResponse = await request(app).get('/carts/test-cart');
      expect(cartResponse.status).toBe(200);
      expect(cartResponse.body.items).toHaveLength(1);

      // 4. Update item quantity
      const updateResponse = await request(app)
        .patch(`/carts/test-cart/items/${laptopId}`)
        .send({ quantity: 3 });
      expect(updateResponse.status).toBe(200);

      // 5. Get cart total
      const totalResponse = await request(app).get('/carts/test-cart/total');
      expect(totalResponse.status).toBe(200);
      expect(totalResponse.body).toHaveProperty('preTotal');
      expect(totalResponse.body).toHaveProperty('discount');
      expect(totalResponse.body).toHaveProperty('total');

      // 6. Clear cart
      const clearResponse = await request(app).delete('/carts/test-cart');
      expect(clearResponse.status).toBe(204);

      // 7. Verify cart is empty (cart still exists but has no items)
      const emptyCartResponse = await request(app).get('/carts/test-cart/total');
      expect(emptyCartResponse.status).toBe(200);
      expect(emptyCartResponse.body.total).toBe(0);
    });

    it('should apply discount when cart total exceeds 100', async () => {
      // Add expensive product (Monitor at 299.99)
      await request(app)
        .patch('/carts/discount-cart')
        .send({ productId: '4', quantity: 1 });

      const totalResponse = await request(app).get('/carts/discount-cart/total');

      expect(totalResponse.status).toBe(200);
      expect(totalResponse.body.preTotal).toBeGreaterThan(100);
      expect(totalResponse.body.discount).toBeGreaterThan(0);
      expect(totalResponse.body.total).toBeLessThan(totalResponse.body.preTotal);
    });

    it('should handle removing specific items from cart', async () => {
      // Add two different products
      await request(app)
        .patch('/carts/remove-cart')
        .send({ productId: '1', quantity: 1 });

      await request(app)
        .patch('/carts/remove-cart')
        .send({ productId: '2', quantity: 1 });

      // Verify 2 items
      let cartResponse = await request(app).get('/carts/remove-cart');
      expect(cartResponse.body.items).toHaveLength(2);

      // Remove one item
      const removeResponse = await request(app).delete('/carts/remove-cart/items/1');
      expect(removeResponse.status).toBe(204);

      // Verify only 1 item remains
      cartResponse = await request(app).get('/carts/remove-cart');
      expect(cartResponse.body.items).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .patch('/carts/error-cart')
        .send({ productId: 'non-existent', quantity: 1 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative quantity', async () => {
      const response = await request(app)
        .patch('/carts/error-cart')
        .send({ productId: '1', quantity: -1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent cart', async () => {
      const response = await request(app).get('/carts/non-existent-cart');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Cart not found' });
    });
  });
});
