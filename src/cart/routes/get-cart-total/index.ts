import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const getCartTotalRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId } = req.params;

    const total = cartService.calculateCartTotal(cartId);

    if (!total) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(total);
  };
};
