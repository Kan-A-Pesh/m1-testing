import express, { Express } from 'express';
import { ProductStorage } from './storage/product-storage';
import { CartStorage } from './storage/cart-storage';
import { ProductService } from './product/service/product.service';
import { CartService } from './cart/service/cart.service';
import { createProductRoutes } from './product/routes';
import { createCartRoutes } from './cart/routes';
import { Product } from './product';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(express.json());

  // Initialize storage with seed data
  const seedProducts: Product[] = [
    { id: '1', name: 'Laptop', price: 999.99 },
    { id: '2', name: 'Mouse', price: 25.50 },
    { id: '3', name: 'Keyboard', price: 75.00 },
    { id: '4', name: 'Monitor', price: 299.99 },
    { id: '5', name: 'Headphones', price: 150.00 },
  ];

  const productStorage = new ProductStorage(seedProducts);
  const cartStorage = new CartStorage();

  // Initialize services
  const productService = new ProductService(productStorage);
  const cartService = new CartService(cartStorage, productService);

  // Register routes
  app.use(createProductRoutes(productService));
  app.use(createCartRoutes(cartService));

  return app;
};
