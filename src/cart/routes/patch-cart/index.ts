import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const patchCartRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    const result = cartService.addProductToCart(cartId, productId, quantity);

    if (!result.success) {
      const statusCode = result.error === 'Product not found' ? 404 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    res.status(200).send();
  };
};
