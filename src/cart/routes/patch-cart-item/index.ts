import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const patchCartItemRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required' });
    }

    const result = cartService.updateCartItemQuantity(cartId, itemId, quantity);

    if (!result.success) {
      const statusCode = result.error === 'Cart not found' ? 404 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    res.status(200).send();
  };
};
