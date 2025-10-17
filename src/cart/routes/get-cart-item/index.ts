import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const getCartItemRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId, itemId } = req.params;

    const item = cartService.getCartItem(cartId, itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ item });
  };
};
