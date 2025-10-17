import { Router } from 'express';
import { ProductService } from '../service/product.service';
import { getProductsRoute } from './get-products';

export const createProductRoutes = (productService: ProductService): Router => {
  const router = Router();

  router.get('/products', getProductsRoute(productService));

  return router;
};
