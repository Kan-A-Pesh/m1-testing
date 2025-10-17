import { Request, Response } from 'express';
import { ProductService } from '../../service/product.service';

export const getProductsRoute = (productService: ProductService) => {
  return (req: Request, res: Response) => {
    const products = productService.getAllProducts();

    res.status(200).json({ products });
  };
};
