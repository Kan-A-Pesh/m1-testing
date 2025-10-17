import request from 'supertest';
import express, { Express } from 'express';
import { getProductsRoute } from './index';
import { ProductService } from '../../service/product.service';
import { ProductStorage } from '../../../storage/product-storage';
import { Product } from '../../product';

describe('GET /products', () => {
  let app: Express;
  let productService: ProductService;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const productStorage = new ProductStorage();
    productService = new ProductService(productStorage);

    product1 = { id: 'p1', name: 'Laptop', price: 999 };
    product2 = { id: 'p2', name: 'Mouse', price: 25 };

    productService.addProduct(product1);
    productService.addProduct(product2);

    app.get('/products', getProductsRoute(productService));
  });

  it('should return all products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      products: [product1, product2],
    });
  });

  it('should return empty array when no products exist', async () => {
    const emptyStorage = new ProductStorage();
    const emptyService = new ProductService(emptyStorage);

    const emptyApp = express();
    emptyApp.use(express.json());
    emptyApp.get('/products', getProductsRoute(emptyService));

    const response = await request(emptyApp).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      products: [],
    });
  });
});
